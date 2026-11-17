"use client";

import { useEffect, useRef, useState } from "react";
import { Search, MapPin, CalendarDays, Users, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Sticky shrinking search pill.
 *
 * Expanded: a full split-pill with Where / Check-in / Check-out / Guests.
 * Condensed: a compact pill that still carries the live query, so the guest
 * never loses context while scrolling listings.
 *
 * Both states are the same width on mobile (full bleed), because a shrinking
 * pill on a 360px screen becomes unusable.
 */
export function SearchPill() {
  const [condensed, setCondensed] = useState(false);
  const sentinel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sentinel.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setCondensed(!entry.isIntersecting),
      { rootMargin: "-72px 0px 0px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <>
      <div ref={sentinel} aria-hidden="true" className="h-px w-full" />

      <div
        className={cn(
          "sticky top-[4.5rem] z-40 mx-auto w-full px-4 transition-[padding,top] duration-200 ease-[var(--ease-out-expo)] sm:px-6 motion-reduce:transition-none",
          condensed ? "pt-2" : "pt-0",
        )}
      >
        <form
          role="search"
          onSubmit={(e) => e.preventDefault()}
          className={cn(
            "mx-auto flex items-center rounded-full border border-zinc-200 bg-white shadow-float transition-all duration-200 ease-[var(--ease-out-expo)] motion-reduce:transition-none",
            condensed ? "max-w-2xl gap-1 p-1.5" : "max-w-4xl gap-0 p-2",
          )}
        >
          {condensed ? (
            <>
              <span className="inline-flex min-w-0 flex-1 items-center gap-2 rounded-full px-3 py-1.5">
                <Search className="size-4 shrink-0 text-pine-800" aria-hidden="true" />
                <span className="truncate text-[0.8125rem] font-semibold text-obsidian">
                  Rayfield · 14–17 Nov · 2 guests
                </span>
              </span>
              <button
                type="submit"
                className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full bg-pine-800 px-4 text-[0.8125rem] font-semibold text-white transition-colors hover:bg-pine-900"
              >
                <Search className="size-3.5" aria-hidden="true" />
                Search
              </button>
            </>
          ) : (
            <>
              <Field icon={<MapPin />} label="Where" value="Jos, Plateau" grow />
              <Divider />
              <Field icon={<CalendarDays />} label="Check-in" value="Add dates" />
              <Divider />
              <Field icon={<CalendarDays />} label="Check-out" value="Add dates" />
              <Divider />
              <Field icon={<Users />} label="Guests" value="2 guests" />
              <button
                type="submit"
                aria-label="Search stays"
                className="ml-1 inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-pine-800 text-white transition-colors hover:bg-pine-900 active:scale-95 motion-reduce:active:scale-100"
              >
                <Search className="size-4" aria-hidden="true" />
              </button>
            </>
          )}
        </form>

        {!condensed ? (
          <div className="mx-auto mt-2 flex max-w-4xl items-center justify-center gap-1.5 text-[0.75rem] text-zinc-500">
            <Sparkles className="size-3.5 text-emerald-600" aria-hidden="true" />
            <span>
              Try{" "}
              <span className="font-medium text-zinc-700">
                “2-bedroom in Rayfield with 24/7 power”
              </span>{" "}
              in Ask JosStay
            </span>
          </div>
        ) : null}
      </div>
    </>
  );
}

function Field({
  icon,
  label,
  value,
  grow,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  grow?: boolean;
}) {
  return (
    <button
      type="button"
      className={cn(
        "group flex min-w-0 flex-col items-start gap-0.5 rounded-full px-4 py-1.5 text-left transition-colors hover:bg-zinc-100",
        grow ? "flex-[1.4]" : "flex-1",
      )}
    >
      <span className="flex items-center gap-1.5 pl-0.5 text-[0.6875rem] font-bold uppercase tracking-[0.06em] text-zinc-500">
        <span className="[&>svg]:size-3 [&>svg]:stroke-[2.5]" aria-hidden="true">
          {icon}
        </span>
        {label}
      </span>
      <span className="truncate pl-0.5 text-[0.8125rem] font-semibold text-obsidian">
        {value}
      </span>
    </button>
  );
}

function Divider() {
  return <span aria-hidden="true" className="h-8 w-px shrink-0 bg-zinc-200" />;
}
