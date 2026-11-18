import { randomUUID } from "node:crypto";
import type { Transaction } from "sequelize";
import {
  PaymentInitializationSchema,
  type PaystackChargeSuccess,
  type PaymentInitialization,
} from "@josstay/shared";
import { HttpError } from "../api/errors.js";
import {
  beginPaymentInTransaction,
  confirmBookingInTransaction,
  getBookingByReference,
} from "../booking/service.js";
import { writeAudit } from "../booking/audit.js";
import { getModels, queryInTransaction, withTransaction } from "../db/client.js";
import { env } from "../env.js";
import { paystackClient, type PaymentClient } from "./client.js";

export type ChargeResult = {
  bookingReference: string;
  status: "confirmed";
  idempotent: boolean;
};

/** Create a hosted checkout session and mark the held booking as payment pending. */
export async function initializePayment(
  bookingReference: string,
  client: PaymentClient = paystackClient,
): Promise<PaymentInitialization> {
  const models = getModels();
  const booking = await getBookingByReference(bookingReference);
  if (booking.status !== "held") {
    throw new HttpError(409, `Cannot start payment from ${booking.status}`);
  }

  const hotel = await models.Hotel.findByPk(booking.hotelId);
  if (!hotel) throw new HttpError(404, "Hotel not found");

  const subaccountCode = hotel.get("paystackSubaccountCode") as string | null;
  if (!subaccountCode) {
    throw new HttpError(409, "Hotel has no verified Paystack subaccount");
  }
  if (env.SUBACCOUNT_VERIFICATION_REQUIRED && !hotel.get("subaccountVerifiedAt")) {
    throw new HttpError(409, "Hotel subaccount has not been verified");
  }

  const paystackReference = `PS-${bookingReference}-${randomUUID()
    .slice(0, 8)
    .toUpperCase()}`;
  const result = await client.initialize({
    email: booking.guestEmail,
    amountKobo: Number(booking.totalKobo),
    reference: paystackReference,
    callbackUrl: `${env.FRONTEND_URL}/booking/confirmed?reference=${encodeURIComponent(
      bookingReference,
    )}`,
    subaccountCode,
    bearer: "subaccount",
    percentageCharge: env.COMMISSION_BPS / 100,
    metadata: {
      bookingReference,
      hotelName: hotel.get("name") as string,
    },
    channels: ["card", "bank", "ussd"],
  });
  const providerReference = result.reference || paystackReference;

  await withTransaction((transaction) =>
    beginPaymentInTransaction(bookingReference, providerReference, transaction),
  );

  return PaymentInitializationSchema.parse({
    bookingReference,
    paystackReference: providerReference,
    provider: "paystack",
    amountKobo: Number(booking.totalKobo),
    authorizationUrl: result.authorizationUrl,
    channels: ["card", "bank", "ussd"],
  });
}

async function lockBookingRow(id: string, transaction: Transaction): Promise<void> {
  const rows = await queryInTransaction<{ id: string }>(
    `SELECT id::text AS id FROM bookings WHERE id = :id FOR UPDATE`,
    { id },
    transaction,
  );
  if (rows.length === 0) throw new HttpError(404, "Booking not found");
}

/**
 * A signed charge.success webhook is the only proof of payment. Duplicate
 * deliveries are acknowledged without a second confirmation or audit line.
 */
export async function handleChargeSuccess(
  event: PaystackChargeSuccess,
): Promise<ChargeResult> {
  const models = getModels();
  const paystackReference = event.data.reference;

  return withTransaction(async (transaction) => {
    const existing = await models.Booking.findOne({
      where: { paystackReference },
      transaction,
    });
    if (existing?.get("status") === "confirmed") {
      return {
        bookingReference: existing.get("reference") as string,
        status: "confirmed" as const,
        idempotent: true,
      };
    }

    const bookingReference =
      event.data.metadata?.bookingReference ?? (existing?.get("reference") as string | undefined);
    if (!bookingReference) {
      throw new HttpError(400, "Webhook is missing the booking reference");
    }

    const initial = await getBookingByReference(bookingReference, transaction);
    await lockBookingRow(initial.id, transaction);
    const booking = await getBookingByReference(bookingReference, transaction);

    if (booking.paystackReference !== paystackReference) {
      throw new HttpError(409, "Payment reference does not match the booking");
    }
    if (booking.status === "confirmed") {
      return { bookingReference, status: "confirmed" as const, idempotent: true };
    }
    if (booking.status !== "payment_pending") {
      throw new HttpError(409, `Cannot confirm a booking from ${booking.status}`);
    }
    if (event.data.currency.toUpperCase() !== "NGN") {
      throw new HttpError(409, "Unsupported payment currency");
    }
    if (Number(booking.totalKobo) !== event.data.amount) {
      throw new HttpError(409, "Payment amount does not match the booking");
    }

    await writeAudit(transaction, {
      actor: "payment.webhook",
      action: "payment.webhook.received",
      entityId: booking.id,
      after: {
        paystackReference,
        amount: event.data.amount,
        event: event.event,
      },
    });
    await confirmBookingInTransaction(bookingReference, paystackReference, transaction);

    return { bookingReference, status: "confirmed" as const, idempotent: false };
  });
}
