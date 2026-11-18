"use client";

import { useMemo, useState } from "react";
import { CategoryBar } from "@/components/home/category-bar";
import { StayCard } from "@/components/home/stay-card";
import { STAYS } from "@/lib/data";
import { cn } from "@/lib/utils";

/** Filter rail + 4-column listing grid. Filtering is local for the demo. */
export function StayExplorer() {
  const [area, setArea] = useState("All");

  const stays = useMemo(() => {
    if (area === "All") return STAYS;
    if (area === "24/7 Power") return STAYS.filter((s) => /24\/7|Solar/i.test(s.power));
    return STAYS.filter((s) => s.area === area);
  }, [area]);

  return (
    <div>
      <div className="sticky top-[4.5rem] z-30 -mx-4 bg-[var(--color-canvas)]/90 px-4 py-2 backdrop-blur-sm sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <CategoryBar active={area} onChange={setArea} />
      </div>

      <div className="mt-4 flex items-baseline justify-between gap-4">
        <p className="text-[0.8125rem] text-zinc-500">
          <span className="font-semibold text-obsidian">{stays.length} stays</span>
          {area !== "All" ? ` in ${area}` : " across Jos"}
        </p>
        <p className="hidden text-[0.8125rem] text-zinc-500 sm:block">
          Prices include taxes and fees
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
            No stays in {area} yet
          </p>
          <p className="mx-auto mt-1 max-w-sm text-[0.875rem] text-zinc-500">
            We only list properties we have inspected. New ones go live weekly —
            try another neighbourhood, or ask us on WhatsApp.
          </p>
        </div>
      ) : null}
    </div>
  );
}
