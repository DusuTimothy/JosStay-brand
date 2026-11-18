import { randomUUID } from "node:crypto";
import { Op, type Transaction } from "sequelize";
import {
  GUEST_REFUND_MESSAGE,
  RefundViewSchema,
  calculateRefundQuote,
  nightsBetweenDates,
  RecoveryQueueItemSchema,
  type RefundRequest,
  type RefundView,
  type RecoveryAction,
  type RecoveryQueueItem,
  type RecoveryQueueQuery,
} from "@josstay/shared";
import { HttpError } from "../api/errors.js";
import { writeAudit } from "../booking/audit.js";
import { getBookingByReference } from "../booking/service.js";
import { assertBookingTransition } from "../booking/state-machine.js";
import { getModels, queryInTransaction, withTransaction } from "../db/client.js";
import { env } from "../env.js";
import { notificationClient } from "../notifications/client.js";
import { notifyRefundInitiated } from "../notifications/service.js";
import type { NotificationClient, NotificationResult } from "../notifications/types.js";
import { paystackClient, type PaymentClient } from "../payment/client.js";

type StoredRefund = {
  id: string;
  bookingId: string;
  amountKobo: string | number;
  commissionReversedKobo: string | number;
  hotelShareKobo: string | number;
  paystackRefundId: string | null;
  idempotencyKey: string | null;
  status: "initiated" | "processing" | "completed" | "failed";
  initiatedBy: string;
  reason: string;
  recoveryStatus: "none" | "open" | "recovering" | "recovered" | "written_off";
  recoveryDueAt: Date | null;
  recoveryNotifiedAt: Date | null;
  recoveredKobo: string | number;
  feeLostKobo: string | number;
  createdAt: Date;
  booking?: {
    reference: string;
    hotel?: { name: string };
  };
};

export type InitiateRefundResult = {
  refund: RefundView;
  notifications: NotificationResult | null;
};

function plain<T>(model: { get(options: { plain: true }): unknown }): T {
  return model.get({ plain: true }) as T;
}

function refundView(refund: StoredRefund, bookingReference: string): RefundView {
  return RefundViewSchema.parse({
    id: refund.id,
    bookingReference,
    amountKobo: Number(refund.amountKobo),
    status: refund.status,
    guestMessage: GUEST_REFUND_MESSAGE,
    initiatedAt: refund.createdAt,
  });
}

function idempotencyKey(reference: string, input: RefundRequest, amountKobo: number): string {
  return [
    "RFD",
    reference,
    input.reasonCode,
    input.hotelPayoutState,
    String(amountKobo),
    input.note ?? "",
  ].join("|");
}

function providerReason(input: RefundRequest): string {
  const base = input.reasonCode.replaceAll("_", " ");
  return input.note ? `${base}: ${input.note}`.slice(0, 120) : base;
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
 * A confirmed booking is locked while the refund row is written. The provider
 * call happens after commit: no external request runs while the row is held.
 */
export async function initiateRefund(
  input: RefundRequest,
  client: PaymentClient = paystackClient,
  notifications: NotificationClient = notificationClient,
): Promise<InitiateRefundResult> {
  const models = getModels();
  const now = new Date();

  const created = await withTransaction(async (transaction) => {
    const initial = await getBookingByReference(input.bookingReference, transaction);
    await lockBookingRow(initial.id, transaction);
    const booking = await getBookingByReference(input.bookingReference, transaction);

    if (!booking.paystackReference) {
      throw new HttpError(409, "Booking has no payment reference to refund");
    }
    if (!booking.policyDeadlineAt) {
      throw new HttpError(409, "Booking has no cancellation deadline");
    }
    if (booking.totalKobo === null || booking.commissionKobo === null) {
      throw new HttpError(409, "Booking has no confirmed money record");
    }

    const quote = calculateRefundQuote({
      policyTemplate: booking.policyTemplateSnapshot,
      checkIn: booking.checkIn,
      policyDeadlineAt: booking.policyDeadlineAt,
      totalKobo: Number(booking.totalKobo),
      commissionKobo: Number(booking.commissionKobo),
      nights: nightsBetweenDates(booking.checkIn, booking.checkOut),
      reasonCode: input.reasonCode,
      now,
    });

    const key = idempotencyKey(booking.reference, input, quote.amountKobo);
    const existing = await models.Refund.findOne({
      where: { idempotencyKey: key },
      transaction,
    });
    if (existing && existing.get("status") !== "failed") {
      return { refund: plain<StoredRefund>(existing), booking, created: false, retry: false };
    }
    if (existing) {
      if (booking.status !== "refund_pending") {
        throw new HttpError(409, `Cannot retry a refund from ${booking.status}`);
      }
      return { refund: plain<StoredRefund>(existing), booking, created: true, retry: true };
    }

    if (booking.status !== "confirmed") {
      throw new HttpError(409, `Cannot refund a booking from ${booking.status}`);
    }
    if (quote.amountKobo === 0) {
      throw new HttpError(409, "No refund is due under the booking policy");
    }

    const hotelPaidOut = input.hotelPayoutState === "paid_out";
    const recoveryDueAt = hotelPaidOut
      ? new Date(now.getTime() + env.REFUND_RECOVERY_DAYS * 24 * 60 * 60 * 1000)
      : null;

    const refund = await models.Refund.create(
      {
        bookingId: booking.id,
        amountKobo: quote.amountKobo,
        commissionReversedKobo: quote.commissionReversedKobo,
        hotelShareKobo: quote.hotelShareKobo,
        status: "initiated",
        initiatedBy: input.initiatedBy,
        reason: providerReason(input),
        recoveryStatus: hotelPaidOut ? "open" : "none",
        recoveryDueAt,
        recoveryNotifiedAt: null,
        recoveredKobo: 0,
        feeLostKobo: 0,
        idempotencyKey: key,
      },
      { transaction },
    );

    assertBookingTransition(booking.status, "refund_pending");
    await models.Booking.update(
      { status: "refund_pending" },
      { where: { id: booking.id }, transaction },
    );

    await writeAudit(transaction, {
      actor: input.initiatedBy,
      action: "booking.refund_pending",
      entityId: booking.id,
      before: { status: booking.status },
      after: { status: "refund_pending", refundAmountKobo: quote.amountKobo },
    });
    await writeAudit(transaction, {
      actor: input.initiatedBy,
      action: "refund.initiated",
      entity: "refund",
      entityId: refund.get("id") as string,
      after: {
        amountKobo: quote.amountKobo,
        commissionReversedKobo: quote.commissionReversedKobo,
        hotelShareKobo: quote.hotelShareKobo,
        reasonCode: input.reasonCode,
        recoveryStatus: hotelPaidOut ? "open" : "none",
      },
    });
    if (hotelPaidOut) {
      await writeAudit(transaction, {
        actor: input.initiatedBy,
        action: "recovery.task_created",
        entity: "refund",
        entityId: refund.get("id") as string,
        after: {
          hotelShareKobo: quote.hotelShareKobo,
          recoveryDueAt: recoveryDueAt?.toISOString(),
          recoveryDays: env.REFUND_RECOVERY_DAYS,
        },
      });
    }

    return {
      refund: plain<StoredRefund>(refund),
      booking,
      created: true,
      retry: false,
    };
  });

  if (!created.created) {
    return {
      refund: refundView(created.refund, created.booking.reference),
      notifications: null,
    };
  }

  const { refund, booking, retry } = created;
  const providerReference = `RFD-${booking.reference}-${randomUUID()
    .slice(0, 8)
    .toUpperCase()}`;

  let providerResult;
  try {
    providerResult = await client.refund({
      transactionReference: booking.paystackReference as string,
      reference: providerReference,
      amountKobo: Number(refund.amountKobo),
      reason: refund.reason,
    });
  } catch (error) {
    await withTransaction(async (transaction) => {
      const failed = await models.Refund.findByPk(refund.id, { transaction });
      await failed?.update({ status: "failed" }, { transaction });
      await writeAudit(transaction, {
        actor: "refund.provider",
        action: "refund.provider_failed",
        entity: "refund",
        entityId: refund.id,
        after: {
          error: error instanceof Error ? error.message : "unknown provider error",
        },
      });
    });
    throw error;
  }

  const finalRefund = await withTransaction(async (transaction) => {
    const stored = await models.Refund.findByPk(refund.id, { transaction });
    if (!stored) throw new HttpError(404, "Refund not found");

    await stored.update(
      {
        status: providerResult.status,
        paystackRefundId: providerResult.providerRefundId,
        feeLostKobo: providerResult.feeLostKobo,
      },
      { transaction },
    );

    if (providerResult.status === "completed") {
      const current = await getBookingByReference(booking.reference, transaction);
      if (current.status === "refund_pending") {
        assertBookingTransition(current.status, "refunded");
        await models.Booking.update(
          { status: "refunded" },
          { where: { id: booking.id }, transaction },
        );
        await writeAudit(transaction, {
          actor: "refund.provider",
          action: "booking.refunded",
          entityId: booking.id,
          before: { status: "refund_pending" },
          after: { status: "refunded", refundId: refund.id },
        });
      }
    }

    if (retry) {
      await writeAudit(transaction, {
        actor: input.initiatedBy,
        action: "refund.retried",
        entity: "refund",
        entityId: refund.id,
        after: { status: providerResult.status },
      });
    }

    await writeAudit(transaction, {
      actor: "refund.provider",
      action: "refund.provider_accepted",
      entity: "refund",
      entityId: refund.id,
      after: {
        providerRefundId: providerResult.providerRefundId,
        status: providerResult.status,
        feeLostKobo: providerResult.feeLostKobo,
      },
    });

    return plain<StoredRefund>(stored);
  });

  let notificationResult: NotificationResult | null = null;
  try {
    notificationResult = await notifyRefundInitiated(
      booking.reference,
      Number(refund.amountKobo),
      notifications,
    );
  } catch (error) {
    console.error(
      `Refund notification failed for ${booking.reference}: ${
        error instanceof Error ? error.message : "unknown error"
      }`,
    );
  }

  return {
    refund: refundView(finalRefund, booking.reference),
    notifications: notificationResult,
  };
}

async function recoveryQueueItem(
  refund: StoredRefund,
  now: Date,
): Promise<RecoveryQueueItem> {
  const booking = refund.booking;
  if (!booking?.hotel) throw new Error("Recovery row is missing its booking or hotel");
  return RecoveryQueueItemSchema.parse({
    id: refund.id,
    bookingReference: booking.reference,
    hotelName: booking.hotel.name,
    refundStatus: refund.status,
    recoveryStatus: refund.recoveryStatus,
    hotelShareKobo: Number(refund.hotelShareKobo),
    recoveredKobo: Number(refund.recoveredKobo),
    recoveryDueAt: refund.recoveryDueAt,
    recoveryNotifiedAt: refund.recoveryNotifiedAt,
    aged: refund.recoveryDueAt ? refund.recoveryDueAt < now : false,
    initiatedAt: refund.createdAt,
  });
}

/** Internal queue. Hotel name and money only — no guest or hotel contact fields. */
export async function listRecoveryQueue(
  query: RecoveryQueueQuery,
  now: Date = new Date(),
): Promise<RecoveryQueueItem[]> {
  const models = getModels();
  const rows = await models.Refund.findAll({
    where:
      query.status === "all"
        ? { recoveryStatus: { [Op.ne]: "none" } }
        : { recoveryStatus: query.status },
    include: [
      {
        model: models.Booking,
        as: "booking",
        attributes: ["id", "reference", "hotelId"],
        include: [{ model: models.Hotel, as: "hotel", attributes: ["id", "name"] }],
      },
    ],
    order: [["recoveryDueAt", "ASC"]],
  });

  const items = await Promise.all(
    rows.map((row) => recoveryQueueItem(plain<StoredRefund>(row), now)),
  );
  return query.aged === undefined
    ? items
    : items.filter((item) => item.aged === query.aged);
}

export async function applyRecoveryAction(
  refundId: string,
  input: RecoveryAction,
  now: Date = new Date(),
): Promise<RecoveryQueueItem> {
  const models = getModels();

  await withTransaction(async (transaction) => {
    const locked = await queryInTransaction<{ id: string }>(
      `SELECT id::text AS id FROM refunds WHERE id = :id FOR UPDATE`,
      { id: refundId },
      transaction,
    );
    if (locked.length === 0) throw new HttpError(404, "Recovery task not found");

    const refund = await models.Refund.findByPk(refundId, { transaction });
    if (!refund) throw new HttpError(404, "Recovery task not found");
    const status = refund.get("recoveryStatus") as StoredRefund["recoveryStatus"];
    if (status === "recovered" || status === "written_off" || status === "none") {
      throw new HttpError(409, `Cannot act on a recovery task in ${status}`);
    }

    const before = { recoveryStatus: status };
    if (input.action === "notify") {
      await refund.update({ recoveryNotifiedAt: now }, { transaction });
    } else if (input.action === "mark_recovering") {
      if (status !== "open") {
        throw new HttpError(409, `Cannot mark ${status} as recovering`);
      }
      await refund.update({ recoveryStatus: "recovering" }, { transaction });
    } else if (input.action === "mark_recovered") {
      const expected = Number(refund.get("hotelShareKobo"));
      const amount = input.amountKobo ?? expected;
      if (!Number.isInteger(amount) || amount !== expected) {
        throw new HttpError(400, `Recovery amount must match the hotel share (${expected})`);
      }
      await refund.update(
        { recoveredKobo: amount, recoveryStatus: "recovered" },
        { transaction },
      );
    } else {
      await refund.update({ recoveryStatus: "written_off" }, { transaction });
    }

    await writeAudit(transaction, {
      actor: input.actor,
      action: `recovery.${input.action}`,
      entity: "refund",
      entityId: refundId,
      before,
      after: {
        recoveryStatus: refund.get("recoveryStatus"),
        recoveredKobo: Number(refund.get("recoveredKobo")),
        ...(input.note ? { note: input.note } : {}),
      },
    });
  });

  const updated = await models.Refund.findByPk(refundId, {
    include: [
      {
        model: models.Booking,
        as: "booking",
        attributes: ["id", "reference", "hotelId"],
        include: [{ model: models.Hotel, as: "hotel", attributes: ["id", "name"] }],
      },
    ],
  });
  if (!updated) throw new HttpError(404, "Recovery task not found");
  return recoveryQueueItem(plain<StoredRefund>(updated), now);
}
