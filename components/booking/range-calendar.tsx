"use client";

import { useMemo, useState } from "react";
import { DayPicker, type DateRange, type DayButtonProps } from "react-day-picker";
import { ArrowRight, Sparkles } from "lucide-react";
import type { Stay } from "@/lib/data";
import { addDays, formatRange, nightsBetween, startOfDay } from "@/lib/format";
import { useMediaQuery } from "@/lib/use-media-query";
import { cn } from "@/lib/utils";

/**
 * Range calendar.
 *
 * Built on react-day-picker v10. The library handles keyboard grid semantics,
 * so we only own the visuals and the availability constraints.
 *
 * Availability rules:
 *  - Past dates are disabled (can't book yesterday).
 *  - Owner-blocked ranges come from `stay.unavailable` and get a strikethrough
 *    so the guest sees *why* a date is out, not just a grey box.
 *  - While picking the checkout date we preview the range on hover. A range
 *    that would cross a blocked night is disallowed by DayPicker itself
 *    because every blocked day is in `disabled`.
 */

function toDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function DayButton({ day, modifiers, className, children, ...rest }: DayButtonProps) {
  const selected = Boolean(modifiers.selected);
  const middle = Boolean(modifiers.range_middle);
  const preview = Boolean(modifiers.preview);
  const disabled = Boolean(modifiers.disabled);

  return (
    <button
      {...rest}
      className={cn(
        "relative mx-auto flex size-10 items-center justify-center rounded-full text-[0.8125rem] font-semibold",
        "transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2",
        disabled && "cursor-not-allowed text-zinc-300 line-through decoration-zinc-400",
        !disabled && !selected && "text-obsidian hover:bg-pine-100",
        middle && !selected && "text-pine-900",
        selected && "bg-pine-800 text-white hover:bg-pine-900",
        !selected && !disabled && preview && "bg-pine-100 text-pine-900",
        !selected && !disabled && modifiers.today && "ring-1 ring-inset ring-pine-300",
        modifiers.outside && "text-zinc-300",
        className,
      )}
    >
      {children}
      {!selected && !disabled && modifiers.today ? (
        <span aria-hidden="true" className="absolute bottom-1 size-1 rounded-full bg-pine-700" />
      ) : null}
    </button>
  );
}

const QUICK: { label: string; nights: number; offset?: number }[] = [
  { label: "This weekend", nights: 2, offset: 3 },
  { label: "Next week", nights: 3, offset: 7 },
  { label: "Two weeks out", nights: 2, offset: 14 },
];

export function RangeCalendar({
  stay,
  range,
  onRangeChange,
  months = 2,
}: {
  stay: Stay;
  range: DateRange | undefined;
  onRangeChange: (range: DateRange | undefined) => void;
  months?: number;
}) {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [hovered, setHovered] = useState<Date | undefined>(undefined);

  const today = startOfDay(new Date());

  const blocked = useMemo(
    () => stay.unavailable.map((r) => ({ from: toDate(r.from), to: toDate(r.to) })),
    [stay.unavailable],
  );

  const disabled = useMemo(
    () => [{ before: today }, ...blocked],
    [blocked, today],
  );

  // Preview band while the guest is choosing checkout.
  const previewMatcher = useMemo(() => {
    if (!range?.from || range?.to || !hovered) return undefined;
    if (hovered <= range.from) return undefined;
    return { from: range.from, to: hovered };
  }, [range, hovered]);

  const nights = nightsBetween(range?.from, range?.to);

  /**
   * Quick chips must never propose a range that overlaps a blocked booking.
   * Walk forward one day at a time until a clean window is found, so the chip
   * always produces a bookable range instead of a total the guest can't buy.
   */
  function applyQuick(offset: number, nightsCount: number) {
    let from = addDays(today, offset);
    for (let guard = 0; guard < 120; guard += 1) {
      const to = addDays(from, nightsCount);
      const conflict = blocked.some((b) => from <= b.to && to > b.from);
      if (!conflict) break;
      from = addDays(from, 1);
    }
    onRangeChange({ from, to: addDays(from, nightsCount) });
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-1.5 border-b border-zinc-200 pb-3">
        {QUICK.map((q) => (
          <button
            key={q.label}
            type="button"
            onClick={() => applyQuick(q.offset ?? 0, q.nights)}
            className="inline-flex items-center gap-1.5 rounded-full border border-zinc-300 bg-white px-3 py-1.5 text-[0.75rem] font-semibold text-zinc-700 transition-colors hover:border-pine-300 hover:bg-pine-50 hover:text-pine-800"
          >
            <Sparkles className="size-3 text-emerald-600" aria-hidden="true" />
            {q.label}
          </button>
        ))}
        {range?.from ? (
          <button
            type="button"
            onClick={() => onRangeChange(undefined)}
            className="ml-auto text-[0.75rem] font-semibold text-zinc-500 underline-offset-4 hover:text-obsidian hover:underline"
          >
            Clear
          </button>
        ) : null}
      </div>

      <div className="pt-3">
        <DayPicker
          mode="range"
          selected={range}
          onSelect={onRangeChange}
          numberOfMonths={isDesktop ? months : 1}
          disabled={disabled}
          showOutsideDays
          startMonth={today}
          endMonth={addDays(today, 365)}
          onDayMouseEnter={(day) => setHovered(day)}
          onDayMouseLeave={() => setHovered(undefined)}
          modifiers={previewMatcher ? { preview: previewMatcher } : undefined}
          components={{ DayButton }}
          classNames={{
            months: "flex flex-col gap-5 md:flex-row md:gap-6",
            month: "w-full",
            month_caption: "relative flex h-10 items-center justify-center",
            caption_label: "font-display text-[0.875rem] font-bold text-obsidian",
            nav: "absolute inset-x-0 top-0 flex h-10 items-center justify-between px-0.5",
            button_previous:
              "inline-flex size-8 items-center justify-center rounded-full border border-zinc-200 bg-white text-obsidian transition-colors hover:bg-zinc-50 disabled:opacity-40",
            button_next:
              "inline-flex size-8 items-center justify-center rounded-full border border-zinc-200 bg-white text-obsidian transition-colors hover:bg-zinc-50 disabled:opacity-40",
            chevron: "size-4",
            month_grid: "w-full border-collapse",
            weekdays: "",
            weekday:
              "h-9 text-center text-[0.625rem] font-bold uppercase tracking-[0.08em] text-zinc-400",
            week: "",
            day: "h-11 p-0 text-center align-middle",
            range_start: "rounded-l-full bg-pine-50",
            range_middle: "bg-pine-50",
            range_end: "rounded-r-full bg-pine-50",
            outside: "opacity-60",
            hidden: "invisible",
          }}
        />
      </div>

      <div className="mt-3 flex min-h-[2.25rem] items-center justify-between gap-3 border-t border-zinc-200 pt-3">
        <p className="text-[0.75rem] text-zinc-500">
          {range?.from ? (
            <span className="font-semibold text-obsidian">{formatRange(range.from, range.to)}</span>
          ) : (
            "Pick a check-in date"
          )}
          {nights > 0 ? (
            <span className="ml-1.5 text-zinc-500">
              · {nights} night{nights > 1 ? "s" : ""}
            </span>
          ) : null}
        </p>
        <span className="inline-flex items-center gap-1 text-[0.6875rem] font-semibold text-zinc-500">
          <span aria-hidden="true" className="size-2 rounded-sm bg-zinc-300" />
          Unavailable
          <ArrowRight className="ml-1 size-3" aria-hidden="true" />
        </span>
      </div>
    </div>
  );
}
