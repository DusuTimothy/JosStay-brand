"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  CalendarDays,
  Minus,
  Plus,
  ShieldCheck,
  Star,
  Zap,
  X,
  MessageCircle,
  CreditCard,
  Info,
} from "lucide-react";
import type { Stay } from "@/lib/data";
import { naira, nightsBetween, formatRange } from "@/lib/format";
import { RangeCalendar } from "@/components/booking/range-calendar";
import { useBooking } from "@/components/booking/booking-provider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const WHATSAPP_NUMBER = "2348000000000";

/** 2-night minimum is a real revenue decision: 1-nighters rarely cover turnover. */
const MIN_NIGHTS = 2;

export function BookingWidget({ stay }: { stay: Stay }) {
  const { range, setRange, guests, setGuests } = useBooking();
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [guestsOpen, setGuestsOpen] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const nights = nightsBetween(range?.from, range?.to);
  const billableNights = Math.max(nights, 0);

  const totals = useMemo(() => {
    const subtotal = stay.nightly * billableNights;
    const service = Math.round(subtotal * stay.serviceFeeRate);
    const cleaning = billableNights > 0 ? stay.cleaningFee : 0;
    return { subtotal, cleaning, service, total: subtotal + cleaning + service };
  }, [stay, billableNights]);

  const meetsMinimum = billableNights >= MIN_NIGHTS;
  const ready = Boolean(range?.from && range?.to) && meetsMinimum;

  useEffect(() => {
    if (!calendarOpen && !guestsOpen) return;
    const onDown = (e: MouseEvent) => {
      if (cardRef.current && !cardRef.current.contains(e.target as Node)) {
        setCalendarOpen(false);
        setGuestsOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setCalendarOpen(false);
        setGuestsOpen(false);
      }
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [calendarOpen, guestsOpen]);

  const whatsappHref = useMemo(() => {
    const dateLine = range?.from
      ? formatRange(range.from, range.to)
      : "dates not selected yet";
    const text = [
      `Hi JosStay — I'd like to book ${stay.name} (${stay.area}, Jos).`,
      `Dates: ${dateLine}`,
      `Guests: ${guests}`,
      billableNights > 0
        ? `Estimated total: ${naira(totals.total)} for ${billableNights} night${billableNights > 1 ? "s" : ""}.`
        : null,
      "Is it available?",
    ]
      .filter(Boolean)
      .join("\n");
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
  }, [stay, range, guests, billableNights, totals.total]);

  return (
    <>
      <div
        ref={cardRef}
        className="sticky top-28 rounded-2xl border border-zinc-200 bg-white p-5 shadow-float"
      >
        <div className="flex items-baseline justify-between gap-2">
          <p className="text-price tabular text-obsidian">
            {naira(stay.nightly)}
            <span className="ml-1 font-sans text-[0.8125rem] font-normal tracking-normal text-zinc-500">
              night
            </span>
          </p>
          <span className="inline-flex items-center gap-1 text-[0.8125rem] font-semibold text-obsidian">
            <Star className="size-3.5 fill-obsidian text-obsidian" aria-hidden="true" />
            {stay.rating.toFixed(2)}
            <span className="font-normal text-zinc-500">({stay.reviews})</span>
          </span>
        </div>

        <div className="mt-4 overflow-hidden rounded-xl border border-zinc-300">
          {/* Dates */}
          <button
            type="button"
            onClick={() => {
              setCalendarOpen((v) => !v);
              setGuestsOpen(false);
            }}
            aria-expanded={calendarOpen}
            className="flex w-full items-center justify-between gap-3 px-3.5 py-3 text-left transition-colors hover:bg-zinc-50"
          >
            <span className="min-w-0">
              <span className="block text-[0.625rem] font-bold uppercase tracking-[0.08em] text-zinc-500">
                {range?.from ? "Your stay" : "Check-in / Check-out"}
              </span>
              <span
                className={cn(
                  "mt-0.5 block truncate text-[0.8125rem] font-semibold",
                  range?.from ? "text-obsidian" : "text-zinc-400",
                )}
              >
                {range?.from ? formatRange(range.from, range.to) : "Add dates"}
              </span>
            </span>
            <CalendarDays className="size-4 shrink-0 text-zinc-500" aria-hidden="true" />
          </button>

          <div aria-hidden="true" className="h-px bg-zinc-300" />

          {/* Guests */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setGuestsOpen((v) => !v);
                setCalendarOpen(false);
              }}
              aria-expanded={guestsOpen}
              className="flex w-full items-center justify-between gap-3 px-3.5 py-3 text-left transition-colors hover:bg-zinc-50"
            >
              <span>
                <span className="block text-[0.625rem] font-bold uppercase tracking-[0.08em] text-zinc-500">
                  Guests
                </span>
                <span className="mt-0.5 block text-[0.8125rem] font-semibold text-obsidian">
                  {guests} guest{guests > 1 ? "s" : ""}
                </span>
              </span>
              <Plus className="size-4 shrink-0 text-zinc-500" aria-hidden="true" />
            </button>

            <AnimatePresence>
              {guestsOpen ? (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.16 }}
                  className="absolute inset-x-0 top-[calc(100%+0.5rem)] z-30 rounded-xl border border-zinc-200 bg-white p-4 shadow-overlay"
                >
                  <p className="text-[0.8125rem] font-semibold text-obsidian">
                    Who's coming?
                  </p>
                  <p className="mt-0.5 text-[0.75rem] text-zinc-500">
                    This stay sleeps up to {stay.guests}.
                  </p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-[0.8125rem] text-zinc-700">Guests</span>
                    <div className="flex items-center gap-2">
                      <Stepper
                        label="Remove guest"
                        disabled={guests <= 1}
                        onClick={() => setGuests((g) => Math.max(1, g - 1))}
                      >
                        <Minus className="size-3.5" />
                      </Stepper>
                      <span className="w-6 text-center text-[0.875rem] font-semibold text-obsidian tabular">
                        {guests}
                      </span>
                      <Stepper
                        label="Add guest"
                        disabled={guests >= stay.guests}
                        onClick={() => setGuests((g) => Math.min(stay.guests, g + 1))}
                      >
                        <Plus className="size-3.5" />
                      </Stepper>
                    </div>
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </div>

        {/* Calendar, desktop popover */}
        <AnimatePresence>
          {calendarOpen ? (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.18 }}
              className="absolute inset-x-0 top-[calc(100%+0.5rem)] z-40 hidden rounded-2xl border border-zinc-200 bg-white p-4 shadow-overlay md:block"
            >
              <RangeCalendar stay={stay} range={range} onRangeChange={setRange} />
            </motion.div>
          ) : null}
        </AnimatePresence>

        {ready ? (
          <Button size="lg" full className="mt-4">
            <CreditCard className="size-4" aria-hidden="true" />
            Reserve · {naira(totals.total)}
          </Button>
        ) : (
          <Button size="lg" full className="mt-4" onClick={() => setCalendarOpen(true)}>
            <CalendarDays className="size-4" aria-hidden="true" />
            {range?.from && nights === 0 ? "Add check-out" : "Check availability"}
          </Button>
        )}

        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-flex h-11 w-full items-center justify-center gap-2 rounded-md border border-whatsapp-ink/25 bg-whatsapp-soft text-[0.875rem] font-semibold text-whatsapp-ink transition-colors hover:bg-[#d7f3e4]"
        >
          <MessageCircle className="size-4" aria-hidden="true" />
          Confirm on WhatsApp instead
        </a>

        <p className="mt-3 text-center text-[0.75rem] text-zinc-500">
          You won't be charged yet
        </p>

        {billableNights > 0 ? (
          <dl className="mt-4 space-y-2 border-t border-zinc-200 pt-4 text-[0.8125rem]">
            <Row
              label={`${naira(stay.nightly)} × ${billableNights} night${billableNights > 1 ? "s" : ""}`}
              value={naira(totals.subtotal)}
            />
            {stay.cleaningFee > 0 ? (
              <Row label="Cleaning fee" value={naira(totals.cleaning)} />
            ) : null}
            <Row label="JosStay service fee" value={naira(totals.service)} />
            <div className="mt-2 flex items-baseline justify-between border-t border-zinc-200 pt-3 text-[0.875rem] font-bold text-obsidian">
              <span>Total</span>
              <span className="tabular">{naira(totals.total)}</span>
            </div>
          </dl>
        ) : null}

        {range?.from && !meetsMinimum ? (
          <p className="mt-3 flex items-start gap-1.5 rounded-md bg-[#FEF3E2] px-2.5 py-2 text-[0.75rem] leading-snug text-warning">
            <Info className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
            {nights === 0
              ? "Choose a check-out date to see the total."
              : `${MIN_NIGHTS}-night minimum on this stay.`}
          </p>
        ) : null}

        <div className="mt-4 space-y-2 border-t border-zinc-200 pt-4">
          <p className="flex items-start gap-1.5 text-[0.75rem] leading-snug text-zinc-600">
            <ShieldCheck className="mt-0.5 size-3.5 shrink-0 text-emerald-600" aria-hidden="true" />
            <span>
              <span className="font-semibold text-obsidian">The JosStay Promise.</span> If it
              isn't as described, we re-house you or refund you.
            </span>
          </p>
          <p className="flex items-start gap-1.5 text-[0.75rem] leading-snug text-zinc-600">
            <Zap className="mt-0.5 size-3.5 shrink-0 text-emerald-600" aria-hidden="true" />
            <span>{stay.power} — tested on inspection day.</span>
          </p>
        </div>
      </div>

      {/* Mobile: calendar becomes a sheet, and a fixed action bar takes over. */}
      <AnimatePresence>
        {calendarOpen ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-end bg-obsidian/40 backdrop-blur-sm md:hidden"
            onClick={() => setCalendarOpen(false)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 34 }}
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-label="Select your dates"
              className="safe-bottom max-h-[90dvh] w-full overflow-y-auto rounded-t-2xl bg-white p-4"
            >
              <div className="mb-1 flex items-center justify-between">
                <p className="font-display text-lg font-bold text-obsidian">Select dates</p>
                <button
                  type="button"
                  onClick={() => setCalendarOpen(false)}
                  aria-label="Close calendar"
                  className="inline-flex size-9 items-center justify-center rounded-full hover:bg-zinc-100"
                >
                  <X className="size-5" />
                </button>
              </div>
              <RangeCalendar stay={stay} range={range} onRangeChange={setRange} months={1} />
              <Button full size="lg" className="mt-3" onClick={() => setCalendarOpen(false)}>
                Done
              </Button>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Mobile fixed bar. Hidden while the calendar sheet is open. */}
      <div
        className={cn(
          "safe-bottom fixed inset-x-0 bottom-0 z-40 border-t border-zinc-200 bg-white/95 px-4 py-3 backdrop-blur-md md:hidden",
          calendarOpen && "hidden",
        )}
      >
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[0.9375rem] font-bold text-obsidian tabular">
              {naira(stay.nightly)}
              <span className="text-[0.75rem] font-normal text-zinc-500"> night</span>
            </p>
            <p className="mt-0.5 text-[0.6875rem] text-zinc-500">
              {range?.from ? formatRange(range.from, range.to) : "Add your dates"}
            </p>
          </div>
          <Button size="md" onClick={() => setCalendarOpen(true)}>
            {ready ? "Reserve" : "Check dates"}
          </Button>
        </div>
      </div>
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="text-zinc-600">{label}</dt>
      <dd className="shrink-0 text-obsidian tabular">{value}</dd>
    </div>
  );
}

function Stepper({
  children,
  label,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="inline-flex size-8 items-center justify-center rounded-full border border-zinc-300 text-obsidian transition-colors hover:border-pine-400 hover:bg-pine-50 disabled:cursor-not-allowed disabled:opacity-35"
    >
      {children}
    </button>
  );
}
