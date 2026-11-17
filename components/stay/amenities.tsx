"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Check } from "lucide-react";
import type { Stay } from "@/lib/data";

/**
 * Amenity list, truncated to two groups on the page with a full list in a
 * dialog. Guests scan amenities by category ("will the power hold?", "can I
 * cook?"), so the modal preserves the groups instead of flattening them into
 * one long checklist.
 */
export function Amenities({ stay }: { stay: Stay }) {
  const [open, setOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const preview = stay.amenities.slice(0, 2);
  const total = stay.amenities.reduce((n, g) => n + g.items.length, 0);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [open]);

  return (
    <section aria-labelledby="amenities-heading">
      <h2 id="amenities-heading" className="text-section text-obsidian">
        What this place offers
      </h2>

      <div className="mt-4 grid gap-5 sm:grid-cols-2">
        {preview.map((group) => (
          <div key={group.group}>
            <h3 className="text-[0.8125rem] font-bold uppercase tracking-[0.06em] text-zinc-500">
              {group.group}
            </h3>
            <ul className="mt-2 space-y-2">
              {group.items.slice(0, 4).map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-[0.875rem] text-zinc-700">
                  <Check className="mt-0.5 size-4 shrink-0 text-pine-700" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-5 inline-flex h-11 items-center rounded-md border border-zinc-300 bg-white px-4 text-[0.875rem] font-semibold text-obsidian transition-colors hover:border-zinc-400 hover:bg-zinc-50"
      >
        Show all {total} amenities
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[75] flex items-end justify-center bg-obsidian/45 backdrop-blur-sm sm:items-center sm:p-4"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ y: 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 16, opacity: 0 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="amenities-dialog-heading"
              onClick={(e) => e.stopPropagation()}
              className="safe-bottom flex max-h-[90dvh] w-full max-w-lg flex-col overflow-hidden rounded-t-2xl bg-white sm:rounded-2xl"
            >
              <div className="flex shrink-0 items-center justify-between border-b border-zinc-200 px-5 py-4">
                <h2 id="amenities-dialog-heading" className="font-display text-lg font-bold text-obsidian">
                  What this place offers
                </h2>
                <button
                  ref={closeRef}
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close amenities"
                  className="inline-flex size-9 items-center justify-center rounded-full text-obsidian hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                >
                  <X className="size-5" />
                </button>
              </div>

              <div className="overflow-y-auto px-5 py-4">
                {stay.amenities.map((group) => (
                  <div key={group.group} className="py-3 first:pt-0">
                    <h3 className="text-[0.75rem] font-bold uppercase tracking-[0.07em] text-zinc-500">
                      {group.group}
                    </h3>
                    <ul className="mt-2 grid gap-2 sm:grid-cols-2">
                      {group.items.map((item) => (
                        <li key={item} className="flex items-start gap-2.5 text-[0.875rem] text-zinc-700">
                          <Check className="mt-0.5 size-4 shrink-0 text-pine-700" aria-hidden="true" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}
