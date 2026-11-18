"use client";

import { createContext, useContext, useMemo, useState } from "react";
import type { DateRange } from "react-day-picker";

type BookingState = {
  range: DateRange | undefined;
  setRange: React.Dispatch<React.SetStateAction<DateRange | undefined>>;
  guests: number;
  setGuests: React.Dispatch<React.SetStateAction<number>>;
};

const BookingContext = createContext<BookingState | null>(null);

/**
 * One source of truth for the selected dates.
 *
 * The booking card, the inline availability calendar and the WhatsApp handoff
 * all read the same range — otherwise a guest picks dates in the body and the
 * sticky card quietly shows a different total. That is the kind of bug that
 * erodes trust in a product whose entire promise is "what you see is real".
 */
export function BookingProvider({ children }: { children: React.ReactNode }) {
  // Start empty on purpose. "Today" is not a stable value to prerender, and
  // prefilling dates that might collide with an owner-blocked range is worse
  // than asking the guest to pick. The quick chips make that one tap.
  const [range, setRange] = useState<DateRange | undefined>(undefined);
  const [guests, setGuests] = useState(2);

  const value = useMemo(
    () => ({ range, setRange, guests, setGuests }),
    [range, guests],
  );

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
}

export function useBooking(): BookingState {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBooking must be used inside <BookingProvider>");
  return ctx;
}
