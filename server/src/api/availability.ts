import type { Transaction } from "sequelize";
import { query, queryInTransaction } from "../db/client.js";
import { HttpError } from "./errors.js";

export type AvailabilityRow = {
  room_id: string;
  hotel_id: string;
  sleeps: number;
  total_inventory: number;
  available: number;
};

/**
 * Shared availability calculation from 02-BACKEND-ARCHITECTURE.md §4.
 * Date ranges are half-open: [from, to). Confirmed and completed/no-show
 * bookings consume stock; unexpired holds and front-desk blocks do too.
 */
const AVAILABILITY_SQL = `
  WITH room_availability AS (
    SELECT
      r.id::text AS room_id,
      r.hotel_id::text AS hotel_id,
      r.sleeps,
      r.total_inventory::int AS total_inventory,
      GREATEST(
        r.total_inventory::int
        - (
          SELECT count(*)::int
            FROM bookings b
           WHERE b.room_id = r.id
             AND b.status IN ('confirmed', 'completed', 'no_show')
             AND b.check_in < :to
             AND b.check_out > :from
        )
        - (
          SELECT count(*)::int
            FROM holds h
            JOIN bookings hb ON hb.id = h.booking_id
           WHERE h.room_id = r.id
             AND h.expires_at > now()
             AND hb.status IN ('held', 'payment_pending')
             AND hb.check_in < :to
             AND hb.check_out > :from
             AND (:excludeBookingId IS NULL OR h.booking_id <> :excludeBookingId)
        )
        - (
          SELECT count(*)::int
            FROM blocks bl
           WHERE bl.room_id = r.id
             AND bl.dates && daterange(:from, :to, '[)')
        ),
        0
      )::int AS available
    FROM rooms r
  )
  SELECT
    room_id,
    hotel_id,
    sleeps,
    total_inventory,
    available
  FROM room_availability
`;

export type AvailabilityOptions = {
  /** Pin the calculation to a writing transaction so the result cannot change under us. */
  transaction?: Transaction;
  /** A booking confirming its own hold must not count that hold against itself. */
  excludeBookingId?: string;
};

export async function getRoomAvailability(
  roomId: string,
  from: string,
  to: string,
  options: AvailabilityOptions = {},
): Promise<AvailabilityRow | undefined> {
  const replacements = {
    roomId,
    from,
    to,
    excludeBookingId: options.excludeBookingId ?? null,
  };
  const sql = `${AVAILABILITY_SQL} WHERE room_id = :roomId`;
  const rows = options.transaction
    ? await queryInTransaction<AvailabilityRow>(sql, replacements, options.transaction)
    : await query<AvailabilityRow>(sql, replacements);
  const row = rows[0];
  if (!row) return undefined;
  return {
    ...row,
    total_inventory: Number(row.total_inventory),
    available: Number(row.available),
  };
}

/** Room IDs with stock for the whole date range, optionally large enough for guests. */
export async function availableRoomIds(
  from: string,
  to: string,
  guests?: number,
): Promise<{ roomIds: string[]; hotelIds: string[] }> {
  const guestClause = guests ? "AND sleeps >= :guests" : "";
  const rows = await query<AvailabilityRow>(
    `${AVAILABILITY_SQL} WHERE available > 0 ${guestClause}`,
    {
      from,
      to,
      excludeBookingId: null,
      ...(guests ? { guests } : {}),
    },
  );
  return {
    roomIds: rows.map((row) => row.room_id),
    hotelIds: [...new Set(rows.map((row) => row.hotel_id))],
  };
}

/** Serialise writers for one room. Every hold and confirmation takes this lock. */
export async function lockRoom(
  roomId: string,
  transaction: Transaction,
): Promise<void> {
  const rows = await queryInTransaction<{ id: string }>(
    `SELECT id::text AS id FROM rooms WHERE id = :roomId FOR UPDATE`,
    { roomId },
    transaction,
  );
  if (rows.length === 0) throw new HttpError(404, "Room not found");
}

/** Re-check stock inside the same transaction that will write the booking. */
export async function assertRoomAvailable(
  roomId: string,
  from: string,
  to: string,
  options: AvailabilityOptions,
): Promise<AvailabilityRow> {
  const row = await getRoomAvailability(roomId, from, to, options);
  if (!row) throw new HttpError(404, "Room not found");
  if (row.available < 1) {
    throw new HttpError(409, "This room is no longer available for those dates");
  }
  return row;
}
