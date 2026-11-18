import { randomUUID } from "node:crypto";
import type { Transaction } from "sequelize";
import {
  calculateBookingMoney,
  calculatePolicyDeadline,
  GuestBookingSchema,
  nightsBetweenDates,
  type BookingStatus,
  type CreateBooking,
  type GuestBooking,
  type PolicyTemplate,
} from "@josstay/shared";
import { assertRoomAvailable, lockRoom } from "../api/availability.js";
import { HttpError } from "../api/errors.js";
import { getModels, queryInTransaction, withTransaction } from "../db/client.js";
import { env } from "../env.js";
import { writeAudit } from "./audit.js";
import { assertBookingTransition } from "./state-machine.js";

type StoredBooking = {
  id: string;
  reference: string;
  hotelId: string;
  roomId: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  status: BookingStatus;
  totalKobo: string | number | null;
  commissionKobo: string | number | null;
  hotelShareKobo: string | number | null;
  policyTemplateSnapshot: PolicyTemplate;
  policyDeadlineAt: Date | null;
  paystackReference: string | null;
  expiresAt: Date | null;
  createdAt: Date;
};

function plain<T>(model: { get(options: { plain: true }): unknown }): T {
  return model.get({ plain: true }) as T;
}

function newReference(): string {
  return `JS-${randomUUID().slice(0, 8).toUpperCase()}`;
}

/**
 * Create a held booking. The room row is locked for the whole transaction, so
 * two guests racing for the last room cannot both pass the availability check.
 */
export async function createBooking(input: CreateBooking): Promise<GuestBooking> {
  const models = getModels();
  const bookedAt = new Date();
  const nights = nightsBetweenDates(input.checkIn, input.checkOut);
  const holdExpiresAt = new Date(
    bookedAt.getTime() + env.HOLD_TTL_MINUTES * 60 * 1000,
  );
  let view: GuestBooking | undefined;

  await withTransaction(async (transaction) => {
    const hotel = await models.Hotel.findOne({
      where: { slug: input.hotelSlug, status: "published" },
      transaction,
    });
    if (!hotel) throw new HttpError(404, "Hotel not found");

    const hotelId = hotel.get("id") as string;
    const hotelName = hotel.get("name") as string;
    const policyTemplate = hotel.get("policyTemplate") as PolicyTemplate;
    const commissionBps = Number(hotel.get("commissionBps"));
    if (commissionBps !== env.COMMISSION_BPS) {
      throw new HttpError(500, "Hotel commission rate does not match the platform rate");
    }

    const room = await models.Room.findOne({
      where: { id: input.roomId, hotelId },
      transaction,
    });
    if (!room) throw new HttpError(404, "Room not found");
    if (input.guests > Number(room.get("sleeps"))) {
      throw new HttpError(409, "This room does not sleep that many guests");
    }

    await lockRoom(input.roomId, transaction);
    await assertRoomAvailable(input.roomId, input.checkIn, input.checkOut, {
      transaction,
    });

    const money = calculateBookingMoney(
      Number(hotel.get("nightlyKobo")),
      nights,
      commissionBps,
    );
    const policyDeadlineAt = calculatePolicyDeadline(
      policyTemplate,
      input.checkIn,
      bookedAt,
    );
    const actor = `guest:${input.guestEmail}`;

    const booking = await models.Booking.create(
      {
        reference: newReference(),
        hotelId,
        roomId: input.roomId,
        guestName: input.guestName,
        guestEmail: input.guestEmail,
        guestPhone: input.guestPhone,
        checkIn: input.checkIn,
        checkOut: input.checkOut,
        guests: input.guests,
        status: "draft",
        totalKobo: money.totalKobo,
        commissionKobo: money.commissionKobo,
        hotelShareKobo: money.hotelShareKobo,
        policyTemplateSnapshot: policyTemplate,
        policyDeadlineAt,
        expiresAt: holdExpiresAt,
      },
      { transaction },
    );

    const bookingId = booking.get("id") as string;
    await writeAudit(transaction, {
      actor,
      action: "booking.created",
      entityId: bookingId,
      after: {
        status: "draft",
        totalKobo: money.totalKobo,
        policyTemplate,
        policyDeadlineAt: policyDeadlineAt.toISOString(),
      },
    });

    assertBookingTransition("draft", "held");
    await booking.update({ status: "held" }, { transaction });
    await writeAudit(transaction, {
      actor,
      action: "booking.held",
      entityId: bookingId,
      before: { status: "draft" },
      after: { status: "held", expiresAt: holdExpiresAt.toISOString() },
    });

    await models.Hold.create(
      {
        bookingId,
        roomId: input.roomId,
        nights,
        expiresAt: holdExpiresAt,
      },
      { transaction },
    );
    await writeAudit(transaction, {
      actor,
      action: "hold.created",
      entityId: bookingId,
      after: {
        roomId: input.roomId,
        nights,
        expiresAt: holdExpiresAt.toISOString(),
      },
    });

    view = GuestBookingSchema.parse({
      reference: booking.get("reference"),
      status: "held",
      hotelSlug: input.hotelSlug,
      hotelName,
      roomId: input.roomId,
      checkIn: input.checkIn,
      checkOut: input.checkOut,
      guests: input.guests,
      nights,
      totalKobo: money.totalKobo,
      policyTemplate,
      policyDeadlineAt,
      holdExpiresAt,
      whatsappOptIn: input.whatsappOptIn,
    });
  });

  if (!view) throw new Error("Booking transaction did not return a view");
  return view;
}

/** Payment is a server-side transition, never a browser redirect. */
export async function beginPayment(
  reference: string,
  paystackReference?: string,
): Promise<void> {
  const models = getModels();

  await withTransaction(async (transaction) => {
    const booking = await models.Booking.findOne({
      where: { reference },
      transaction,
    });
    if (!booking) throw new HttpError(404, "Booking not found");

    const from = booking.get("status") as BookingStatus;
    assertBookingTransition(from, "payment_pending");
    await booking.update(
      {
        status: "payment_pending",
        ...(paystackReference ? { paystackReference } : {}),
      },
      { transaction },
    );
    await writeAudit(transaction, {
      actor: "payment.init",
      action: "booking.payment_pending",
      entityId: booking.get("id") as string,
      before: { status: from },
      after: {
        status: "payment_pending",
        ...(paystackReference ? { paystackReference } : {}),
      },
    });
  });
}

/**
 * Final confirmation re-checks availability inside the same transaction. The
 * booking's own hold is excluded from that check; every other hold counts.
 */
export async function confirmBooking(
  reference: string,
  paystackReference: string,
): Promise<StoredBooking> {
  const models = getModels();
  let confirmed: StoredBooking | undefined;

  await withTransaction(async (transaction: Transaction) => {
    const booking = await models.Booking.findOne({
      where: { reference },
      transaction,
    });
    if (!booking) throw new HttpError(404, "Booking not found");

    const record = plain<StoredBooking>(booking);
    assertBookingTransition(record.status, "confirmed");

    await lockRoom(record.roomId, transaction);
    await assertRoomAvailable(record.roomId, record.checkIn, record.checkOut, {
      transaction,
      excludeBookingId: record.id,
    });

    await booking.update(
      { status: "confirmed", paystackReference, expiresAt: null },
      { transaction },
    );
    await models.Hold.destroy({
      where: { bookingId: record.id },
      transaction,
    });
    await writeAudit(transaction, {
      actor: "payment.webhook",
      action: "booking.confirmed",
      entityId: record.id,
      before: { status: record.status },
      after: { status: "confirmed", paystackReference },
    });

    confirmed = plain<StoredBooking>(booking);
  });

  if (!confirmed) throw new Error("Confirmation transaction did not return a booking");
  return confirmed;
}

/** Runnable by the every-minute job. Safe to call concurrently. */
export async function expireStaleHolds(now: Date = new Date()): Promise<number> {
  const models = getModels();

  return withTransaction(async (transaction) => {
    const stale = await queryInTransaction<{ id: string; reference: string }>(
      `SELECT b.id::text AS id, b.reference
         FROM bookings b
         JOIN holds h ON h.booking_id = b.id
        WHERE b.status IN ('held', 'payment_pending')
          AND b.expires_at <= :now
          AND h.expires_at <= :now
        FOR UPDATE OF b, h`,
      { now },
      transaction,
    );

    for (const row of stale) {
      const booking = await models.Booking.findByPk(row.id, { transaction });
      if (!booking) continue;
      const from = booking.get("status") as BookingStatus;
      assertBookingTransition(from, "expired");
      await booking.update({ status: "expired" }, { transaction });
      await models.Hold.destroy({
        where: { bookingId: row.id },
        transaction,
      });
      await writeAudit(transaction, {
        actor: "hold-expiry-job",
        action: "booking.expired",
        entityId: row.id,
        before: { status: from },
        after: { status: "expired", expiredAt: now.toISOString() },
      });
    }

    return stale.length;
  });
}

/** Internal lookup for jobs and verification — not a guest-facing route. */
export async function getBookingByReference(reference: string): Promise<StoredBooking> {
  const models = getModels();
  const booking = await models.Booking.findOne({ where: { reference } });
  if (!booking) throw new HttpError(404, "Booking not found");
  return plain<StoredBooking>(booking);
}

export type { StoredBooking };
