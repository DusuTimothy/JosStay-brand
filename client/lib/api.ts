import {
  BookingReceiptSchema,
  GuestBookingSchema,
  HotelDetailSchema,
  PaymentInitializationSchema,
  type BookingReceipt,
  type CreateBooking,
  type GuestBooking,
  type HotelDetail,
  type PaymentInitialization,
} from "@josstay/shared";
import type { ZodType } from "zod";

/**
 * Browser-side calls to the JosStay API. Only NEXT_PUBLIC_* values are used;
 * Paystack secrets and internal hotel fields never reach this module.
 */
const API_BASE = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:10000").replace(
  /\/+$/,
  "",
);

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly details?: unknown,
  ) {
    super(message);
  }
}

async function request<T>(
  path: string,
  init: RequestInit | undefined,
  schema: ZodType<T>,
): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE}${path}`, {
      ...init,
      headers: { "content-type": "application/json", ...init?.headers },
    });
  } catch {
    throw new ApiError("JosStay is unreachable right now. Try again or book by chat.", 0);
  }

  const payload: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    const body = payload as { error?: unknown; details?: unknown } | null;
    const message =
      typeof body?.error === "string" ? body.error : `JosStay returned ${response.status}`;
    throw new ApiError(message, response.status, body?.details);
  }

  return schema.parse(payload);
}

export function getHotelDetail(slug: string): Promise<HotelDetail> {
  return request(`/api/hotels/${encodeURIComponent(slug)}`, undefined, HotelDetailSchema);
}

export function createBooking(input: CreateBooking): Promise<GuestBooking> {
  return request(
    "/api/bookings",
    { method: "POST", body: JSON.stringify(input) },
    GuestBookingSchema,
  );
}

export function initializePayment(bookingReference: string): Promise<PaymentInitialization> {
  return request(
    "/api/payments/initialize",
    { method: "POST", body: JSON.stringify({ bookingReference }) },
    PaymentInitializationSchema,
  );
}

export function getBookingReceipt(reference: string): Promise<BookingReceipt> {
  return request(
    `/api/bookings/${encodeURIComponent(reference)}/receipt`,
    { cache: "no-store" },
    BookingReceiptSchema,
  );
}
