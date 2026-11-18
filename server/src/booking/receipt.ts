import {
  BookingReceiptSchema,
  nightsBetweenDates,
  type BookingReceipt,
  type BookingStatus,
  type PolicyTemplate,
} from "@josstay/shared";
import { HttpError } from "../api/errors.js";
import { getModels } from "../db/client.js";
import { PUBLIC_HOTEL_ATTRIBUTES } from "../db/public-fields.js";
import { getBookingByReference } from "./service.js";

/**
 * Guest receipt. It uses the public hotel allow-list, so the phone and hotel
 * contact email cannot be selected even if a future refactor forgets to strip
 * them. Guest contact details and the commission split are also excluded.
 */
export async function getBookingReceipt(reference: string): Promise<BookingReceipt> {
  const models = getModels();
  const booking = await getBookingByReference(reference);
  const hotel = await models.Hotel.findByPk(booking.hotelId, {
    attributes: [...PUBLIC_HOTEL_ATTRIBUTES],
  });
  const room = await models.Room.findByPk(booking.roomId, {
    attributes: ["id", "name"],
  });
  if (!hotel || !room) throw new HttpError(404, "Booking detail not found");

  return BookingReceiptSchema.parse({
    reference: booking.reference,
    status: booking.status as BookingStatus,
    hotelSlug: hotel.get("slug"),
    hotelName: hotel.get("name"),
    roomName: room.get("name"),
    address: hotel.get("address"),
    lat: Number(hotel.get("lat")),
    lng: Number(hotel.get("lng")),
    checkIn: booking.checkIn,
    checkOut: booking.checkOut,
    guests: booking.guests,
    nights: nightsBetweenDates(booking.checkIn, booking.checkOut),
    totalKobo: Number(booking.totalKobo),
    policyTemplate: booking.policyTemplateSnapshot as PolicyTemplate,
    policyDeadlineAt: booking.policyDeadlineAt,
    holdExpiresAt: booking.expiresAt,
  });
}
