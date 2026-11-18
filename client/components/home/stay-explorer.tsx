"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { CategoryBar } from "@/components/home/category-bar";
import { StayCard } from "@/components/home/stay-card";
import { STAYS, hasRoundTheClockPower } from "@/lib/data";
import { cn } from "@/lib/utils";

type StayExplorerProps = {
  initialArea?: string;
  initialGuests?: number;
  initialFrom?: string;
  initialTo?: string;
};

function overlapsBlock(
  stay: { unavailable: { from: string; to: string }[] },
  from: string,
  to: string,
): boolean {
  return stay.unavailable.some((block) => from < block.to && to > block.from);
}

/** Filter rail + listing grid. Filtering is local to the demo data. */
export function StayExplorer({
  initialArea = "All",
  initialGuests,
  initialFrom,
  initialTo,
}: StayExplorerProps) {
  const [area, setArea] = useState(initialArea);

  const stays = useMemo(() => {
    return STAYS.filter((stay) => {
      if (area === "24/7 Power" && !hasRoundTheClockPower(stay)) return false;
      if (area !== "All" && area !== "24/7 Power" && stay.area !== area) return false;
      if (initialGuests && stay.guests < initialGuests) return false;
      if (initialFrom && initialTo && overlapsBlock(stay, initialFrom, initialTo)) return false;
      return true;
    });
  }, [area, initialGuests, initialFrom, initialTo]);

  const hasQuery = Boolean(initialGuests || initialFrom || initialTo);

  return (
    <div>
      <div className="sticky top-[4.5rem] z-30 -mx-4 bg-[var(--color-canvas)]/90 px-4 py-2 backdrop-blur-sm sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <CategoryBar active={area} onChange={setArea} />
      </div>

      <div className="mt-4 flex items-baseline justify-between gap-4">
        <p className="text-[0.8125rem] text-zinc-500">
          <span className="font-semibold text-obsidian">
            {stays.length} of {STAYS.length} demo stays
          </span>
          {area !== "All" ? ` in ${area}` : " across Jos"}
          {initialGuests ? ` · sleeps ${initialGuests}+` : ""}
          {initialFrom && initialTo ? ` · ${initialFrom} to ${initialTo}` : ""}
        </p>
        <p className="hidden text-[0.8125rem] text-zinc-500 sm:block">
          All-in demo prices — no guest service fee
        </p>
      </div>

      <div
        className={cn(
          "mt-4 grid grid-cols-1 gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-4",
        )}
      >
        {stays.map((stay, i) => (
          <StayCard key={stay.slug} stay={stay} priority={i < 2} />
        ))}
      </div>

      {stays.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-zinc-300 bg-white p-10 text-center">
          <p className="font-display text-lg font-bold text-obsidian">
            No demo stays match these filters
          </p>
          <p className="mx-auto mt-1 max-w-sm text-[0.875rem] text-zinc-500">
            These are sample blocks on invented listings, not live availability.
            Try another area or clear the filters.
          </p>
          <Link
            href="/search"
            className="mt-4 inline-flex text-[0.875rem] font-semibold text-pine-800 underline-offset-4 hover:underline"
          >
            Clear filters
          </Link>
        </div>
      ) : null}

      {hasQuery ? (
        <p className="mt-6 text-center text-[0.75rem] text-zinc-500">
          Filters came from the search box. No hotel is live and nothing here is
          a confirmed availability check.
        </p>
      ) : null}
    </div>
  );
}
