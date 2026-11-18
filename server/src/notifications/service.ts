import { nightsBetweenDates, type BookingStatus } from "@josstay/shared";
import type { PolicyTemplate } from "@josstay/shared";
import { writeAudit } from "../booking/audit.js";
import { getBookingByReference } from "../booking/service.js";
import { getModels, withTransaction } from "../db/client.js";
import { notificationClient } from "./client.js";
import type {
  ConfirmationMessage,
  NotificationClient,
  NotificationResult,
} from "./types.js";

const CHAT_URL = "https://wa.me/2348000000000";

const nairaFormatter = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
});

type ConfirmationInput = {
  booking: {
    reference: string;
    guestName: string;
    guestEmail: string;
    guestPhone: string;
    checkIn: string;
    checkOut: string;
    guests: number;
    status: BookingStatus;
    totalKobo: string | number | null;
    policyTemplateSnapshot: PolicyTemplate;
    policyDeadlineAt: Date | null;
    whatsappOptIn: boolean;
  };
  hotelName: string;
  address: string;
  lat: number;
  lng: number;
  hotelPhone: string | null;
  hotelContactEmail: string | null;
  roomName: string;
};

function nairaFromKobo(kobo: string | number | null): string {
  const amount = Math.round(Number(kobo ?? 0) / 100);
  const formatted = nairaFormatter.format(amount);
  return formatted.startsWith("₦") ? formatted : `₦${amount.toLocaleString("en-NG")}`;
}

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Africa/Lagos",
  }).format(new Date(`${iso}T00:00:00+01:00`));
}

function formatDeadline(value: Date): string {
  return `${new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Africa/Lagos",
  }).format(value)} WAT`;
}

function buildMessages(input: ConfirmationInput): ConfirmationMessage[] {
  const { booking, hotelName, address, lat, lng, hotelPhone, hotelContactEmail, roomName } =
    input;
  const nights = nightsBetweenDates(booking.checkIn, booking.checkOut);
  const total = nairaFromKobo(booking.totalKobo);
  const pin = `https://www.google.com/maps?q=${lat},${lng}`;
  const helpLine = `Need help? Message JosStay: ${CHAT_URL}`;

  const sharedLines = [
    `Booking ${booking.reference} is confirmed.`,
    `Hotel: ${hotelName}`,
    `Room: ${roomName}`,
    `Dates: ${formatDate(booking.checkIn)} to ${formatDate(booking.checkOut)} (${nights} nights)`,
    `Guests: ${booking.guests}`,
    `Total paid: ${total} (all-in)`,
    `Cancellation deadline: ${formatDeadline(booking.policyDeadlineAt as Date)}`,
    `Address: ${address}`,
    `Map pin: ${pin}`,
    helpLine,
  ];

  const guestEmailText = [
    ...sharedLines,
    hotelPhone ? `Hotel phone: ${hotelPhone}` : "Hotel phone: not supplied by this hotel",
  ].join("\n");

  // The phone belongs in the guest email only. Guard the other two payloads.
  const guestWhatsAppText = sharedLines.join("\n");
  if (hotelPhone && guestWhatsAppText.includes(hotelPhone)) {
    throw new Error("Hotel phone leaked into the WhatsApp payload");
  }

  const hotelText = [
    `New JosStay booking ${booking.reference}.`,
    `Hotel: ${hotelName}`,
    `Guest name: ${booking.guestName}`,
    `Room: ${roomName}`,
    `Check-in: ${formatDate(booking.checkIn)}`,
    `Check-out: ${formatDate(booking.checkOut)}`,
    `Guests: ${booking.guests}`,
    `Total: ${total}`,
    "Please coordinate arrival through JosStay. Guest contact details are not sent by email; reply to this message and we will relay it.",
  ].join("\n");
  if (
    hotelText.includes(booking.guestEmail) ||
    (booking.guestPhone && hotelText.includes(booking.guestPhone))
  ) {
    throw new Error("Guest contact details leaked into the hotel payload");
  }

  const messages: ConfirmationMessage[] = [
    {
      kind: "guest-email",
      bookingReference: booking.reference,
      to: booking.guestEmail,
      subject: `Your JosStay booking ${booking.reference} is confirmed`,
      text: guestEmailText,
      hotelPhoneIncluded: Boolean(hotelPhone),
    },
  ];

  if (booking.whatsappOptIn) {
    messages.push({
      kind: "guest-whatsapp",
      bookingReference: booking.reference,
      to: booking.guestPhone,
      text: guestWhatsAppText,
      hotelPhoneIncluded: false,
    });
  }

  if (hotelContactEmail) {
    messages.push({
      kind: "hotel-email",
      bookingReference: booking.reference,
      to: hotelContactEmail,
      subject: `New booking ${booking.reference} — JosStay`,
      text: hotelText,
      guestContactIncluded: false,
    });
  }

  return messages;
}

/** Build the three confirmation payloads from stored booking data. */
export async function buildConfirmationMessages(
  reference: string,
): Promise<ConfirmationMessage[]> {
  const models = getModels();
  const booking = await getBookingByReference(reference);
  const hotel = await models.Hotel.findByPk(booking.hotelId);
  const room = await models.Room.findByPk(booking.roomId);
  if (!hotel || !room) throw new Error("Booking hotel or room is missing");

  return buildMessages({
    booking: {
      reference: booking.reference,
      guestName: booking.guestName,
      guestEmail: booking.guestEmail,
      guestPhone: booking.guestPhone,
      checkIn: booking.checkIn,
      checkOut: booking.checkOut,
      guests: booking.guests,
      status: booking.status,
      totalKobo: booking.totalKobo,
      policyTemplateSnapshot: booking.policyTemplateSnapshot,
      policyDeadlineAt: booking.policyDeadlineAt,
      whatsappOptIn: booking.whatsappOptIn,
    },
    hotelName: hotel.get("name") as string,
    address: hotel.get("address") as string,
    lat: Number(hotel.get("lat")),
    lng: Number(hotel.get("lng")),
    hotelPhone: (hotel.get("phoneEncrypted") as string | null) ?? null,
    hotelContactEmail: (hotel.get("contactEmail") as string | null) ?? null,
    roomName: room.get("name") as string,
  });
}

async function logNotification(
  bookingId: string,
  kind: ConfirmationMessage["kind"],
  outcome: "sent" | "failed" | "skipped",
): Promise<void> {
  await withTransaction((transaction) =>
    writeAudit(transaction, {
      actor: "notifications",
      action: `notification.${kind}.${outcome}`,
      entityId: bookingId,
      after: { kind, outcome },
    }),
  );
}

/** Send every applicable confirmation after the payment transaction commits. */
export async function notifyBookingConfirmed(
  reference: string,
  client: NotificationClient = notificationClient,
): Promise<NotificationResult> {
  const messages = await buildConfirmationMessages(reference);
  const booking = await getBookingByReference(reference);
  const result: NotificationResult = { sent: [], failed: [], skipped: [] };

  for (const message of messages) {
    try {
      await client.send(message);
      result.sent.push(message.kind);
      await logNotification(booking.id, message.kind, "sent");
    } catch {
      result.failed.push(message.kind);
      await logNotification(booking.id, message.kind, "failed");
    }
  }

  if (!messages.some((message) => message.kind === "guest-whatsapp")) {
    result.skipped.push("guest-whatsapp");
  }
  if (!messages.some((message) => message.kind === "hotel-email")) {
    result.skipped.push("hotel-email");
  }

  return result;
}
