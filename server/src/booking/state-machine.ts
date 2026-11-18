import type { BookingStatus } from "@josstay/shared";
import { HttpError } from "../api/errors.js";

/**
 * Server-side booking lifecycle from 02-BACKEND-ARCHITECTURE.md §5.
 * A browser redirect or a page refresh never advances a booking by itself.
 */
export const BOOKING_TRANSITIONS: Record<BookingStatus, readonly BookingStatus[]> = {
  draft: ["held", "expired", "cancelled"],
  held: ["payment_pending", "expired", "failed", "cancelled"],
  payment_pending: ["confirmed", "expired", "failed", "cancelled"],
  confirmed: ["completed", "cancelled", "no_show", "refund_pending"],
  completed: [],
  expired: [],
  failed: [],
  cancelled: [],
  refund_pending: ["refunded"],
  refunded: [],
  no_show: [],
};

export function canTransition(from: BookingStatus, to: BookingStatus): boolean {
  return BOOKING_TRANSITIONS[from].includes(to);
}

export function assertBookingTransition(from: BookingStatus, to: BookingStatus): void {
  if (!canTransition(from, to)) {
    throw new HttpError(409, `Cannot change a booking from ${from} to ${to}`);
  }
}
