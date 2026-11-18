import { query } from "../db/client.js";

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

export async function getRoomAvailability(
  roomId: string,
  from: string,
  to: string,
): Promise<AvailabilityRow | undefined> {
  const rows = await query<AvailabilityRow>(
    `${AVAILABILITY_SQL} WHERE room_id = :roomId`,
    { roomId, from, to },
  );
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
    guests ? { from, to, guests } : { from, to },
  );
  return {
    roomIds: rows.map((row) => row.room_id),
    hotelIds: [...new Set(rows.map((row) => row.hotel_id))],
  };
}
