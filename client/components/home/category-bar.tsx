"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { Zap, MapPin } from "lucide-react";
import { AREAS } from "@/lib/data";
import { cn } from "@/lib/utils";

/**
 * Neighbourhood / feature rail.
 *
 * Two entity types live here and they are visually separated on purpose:
 * places (Rayfield, Lamingo…) and features (24/7 Power). Mixing them without
 * a divider confuses both the guest ("is 24/7 Power near Rayfield?") and
 * Google (a filter page is not a location page). The feature chip carries a
 * bolt glyph and a leading separator.
 */
export function CategoryBar({
  active,
  onChange,
}: {
  active: string;
  onChange: (name: string) => void;
}) {
  const scroller = useRef<HTMLDivElement>(null);

  return (
    <div className="relative">
      {/* Edge fades signal that the rail scrolls. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-6 bg-gradient-to-r from-[var(--color-canvas)] to-transparent"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-6 bg-gradient-to-l from-[var(--color-canvas)] to-transparent"
      />

      <div
        ref={scroller}
        role="tablist"
        aria-label="Browse by neighbourhood or feature"
        className="scrollbar-none flex snap-x snap-mandatory items-center gap-1.5 overflow-x-auto px-1 py-1"
      >
        <button
          type="button"
          role="tab"
          aria-selected={active === "All"}
          onClick={() => onChange("All")}
          className={cn(
            "relative shrink-0 snap-start rounded-full px-3.5 py-2 text-[0.8125rem] font-semibold transition-colors",
            active === "All" ? "text-white" : "text-zinc-600 hover:bg-zinc-100",
          )}
        >
          {active === "All" ? (
            <motion.span
              layoutId="area-pill"
              className="absolute inset-0 rounded-full bg-pine-800"
              transition={{ type: "spring", stiffness: 400, damping: 34 }}
            />
          ) : null}
          <span className="relative z-10">All stays</span>
        </button>

        {AREAS.map((area) => {
          const isActive = active === area.name;
          const isFeature = "feature" in area && area.feature;
          return (
            <div key={area.name} className="flex shrink-0 items-center">
              {isFeature ? (
                <span aria-hidden="true" className="mx-1.5 h-5 w-px bg-zinc-300" />
              ) : null}
              <button
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => onChange(area.name)}
                className={cn(
                  "relative shrink-0 snap-start rounded-full px-3.5 py-2 text-[0.8125rem] font-semibold transition-colors",
                  isActive ? "text-white" : "text-zinc-600 hover:bg-zinc-100",
                )}
              >
                {isActive ? (
                  <motion.span
                    layoutId="area-pill"
                    className={cn(
                      "absolute inset-0 rounded-full",
                      isFeature ? "bg-pine-800" : "bg-pine-800",
                    )}
                    transition={{ type: "spring", stiffness: 400, damping: 34 }}
                  />
                ) : null}
                <span className="relative z-10 inline-flex items-center gap-1.5">
                  {isFeature ? (
                    <Zap
                      className={cn("size-3.5", isActive ? "text-emerald-400" : "text-emerald-600")}
                      aria-hidden="true"
                    />
                  ) : (
                    <MapPin className="size-3.5 opacity-60" aria-hidden="true" />
                  )}
                  {area.name}
                  <span
                    className={cn(
                      "tabular text-[0.6875rem] font-bold",
                      isActive ? "text-white/60" : "text-zinc-400",
                    )}
                  >
                    {area.count}
                  </span>
                </span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
