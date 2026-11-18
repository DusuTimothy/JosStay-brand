"use client";

import { CalendarCheck, MessageCircle } from "lucide-react";
import type { Stay } from "@/lib/data";
import { useBooking } from "@/components/booking/booking-provider";
import { RangeCalendar } from "@/components/booking/range-calendar";
import { naira, nightsBetween } from "@/lib/format";

/**
 * Inline availability block.
 *
 * Reads and writes the same range as the sticky booking card, so selecting
 * dates here immediately updates the price on the right. The two calendars are
 * two views of one state, not two states.
 */
export function Availability({ stay }: { stay: Stay }) {
  const { range, setRange } = useBooking();
  const nights = nightsBetween(range?.from, range?.to);

  return (
    <section id="availability" aria-labelledby="availability-heading" className="scroll-mt-28">
      <h2 id="availability-heading" className="text-section text-obsidian">
        When you can stay
      </h2>
      <p className="mt-1.5 text-[0.875rem] text-zinc-600">
        Blocked nights are struck through — those are confirmed bookings, not
        guesswork. Minimum 2 nights.
      </p>

      <div className="mt-4 rounded-2xl border border-zinc-200 bg-white p-4 sm:p-5">
        <RangeCalendar stay={stay} range={range} onRangeChange={setRange} />
      </div>

      {range?.from && range?.to && nights > 0 ? (
        <div className="mt-3 flex flex-col gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-center gap-2 text-[0.8125rem] text-pine-900">
            <CalendarCheck className="size-4 shrink-0 text-pine-700" aria-hidden="true" />
            <span>
              <span className="font-semibold">{nights} night{nights > 1 ? "s" : ""}</span> held
              in the booking card
            </span>
          </p>
          <p className="text-[0.8125rem] font-semibold text-pine-900 tabular sm:text-right">
            {naira(stay.nightly * nights)} before fees
          </p>
        </div>
      ) : (
        <p className="mt-3 flex items-center gap-1.5 text-[0.8125rem] text-zinc-500">
          <MessageCircle className="size-4 text-whatsapp-ink" aria-hidden="true" />
          Need dates outside this window? Ask us on WhatsApp — we hold rooms manually too.
        </p>
      )}
    </section>
  );
}
