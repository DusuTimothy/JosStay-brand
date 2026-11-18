"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Camera, ShieldCheck } from "lucide-react";
import type { Photo, RoomTag } from "@/lib/data";
import { groupedPhotos } from "@/lib/data";
import { cn } from "@/lib/utils";

/**
 * Full-screen photo tour.
 *
 * Photos are grouped by room rather than dumped into one grid: the guest is
 * verifying a specific space ("is the second bedroom really ensuite?"), so the
 * navigation follows their question. Anchored sections, not a flat lightbox.
 */
export function PhotoTour({
  open,
  onClose,
  photos,
  grouped,
  startIndex,
}: {
  open: boolean;
  onClose: () => void;
  photos: Photo[];
  grouped: { tag: RoomTag; photos: Photo[] }[];
  startIndex: number;
}) {
  const [index, setIndex] = useState(startIndex);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (open) setIndex(Math.min(startIndex, photos.length - 1));
  }, [open, startIndex, photos.length]);

  const next = useCallback(
    () => setIndex((i) => (i + 1) % photos.length),
    [photos.length],
  );
  const prev = useCallback(
    () => setIndex((i) => (i - 1 + photos.length) % photos.length),
    [photos.length],
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [open, onClose, next, prev]);

  const current = photos[index];
  const currentGroup = current ? grouped.find((g) => g.tag === current.tag) : undefined;

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Photo tour"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-[80] flex flex-col bg-white"
        >
          {/* Chrome */}
          <div className="flex shrink-0 items-center justify-between gap-3 border-b border-zinc-200 px-3 py-3 sm:px-5">
            <div className="flex min-w-0 items-center gap-2.5">
              <Camera className="size-4 shrink-0 text-pine-700" aria-hidden="true" />
              <p className="truncate text-[0.8125rem] font-semibold text-obsidian">
                {currentGroup ? currentGroup.tag : "Photo tour"}
                <span className="ml-2 font-normal text-zinc-500 tabular">
                  {index + 1} / {photos.length}
                </span>
              </p>
            </div>

            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label="Close photo tour"
              className="inline-flex size-10 items-center justify-center rounded-full text-obsidian transition-colors hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
            >
              <X className="size-5" />
            </button>
          </div>

          {/* Stage */}
          <div className="relative flex min-h-0 flex-1 items-center justify-center bg-zinc-950">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={current?.id ?? index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.16 }}
                className="absolute inset-0"
              >
                {current ? (
                  <Image
                    src={current.src}
                    alt={current.alt}
                    fill
                    sizes="100vw"
                    priority
                    className="object-contain"
                  />
                ) : null}
              </motion.div>
            </AnimatePresence>

            <button
              type="button"
              onClick={prev}
              aria-label="Previous photo"
              className="absolute left-2 top-1/2 z-10 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-obsidian shadow-raised transition-transform hover:scale-105 active:scale-95 sm:left-4 motion-reduce:active:scale-100"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next photo"
              className="absolute right-2 top-1/2 z-10 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-obsidian shadow-raised transition-transform hover:scale-105 active:scale-95 sm:right-4 motion-reduce:active:scale-100"
            >
              <ChevronRight className="size-5" />
            </button>
          </div>

          {/* Filmstrip, grouped by room */}
          <div className="shrink-0 border-t border-zinc-200 bg-white">
            <div className="scrollbar-none flex gap-1.5 overflow-x-auto px-3 py-3 sm:px-5">
              {grouped.map((group) => (
                <div key={group.tag} className="flex shrink-0 items-center gap-1.5">
                  <span className="sticky left-0 z-10 rounded-md bg-white px-1.5 py-1 text-[0.625rem] font-bold uppercase tracking-[0.06em] text-zinc-400">
                    {group.tag}
                  </span>
                  {group.photos.map((photo) => {
                    const i = photos.findIndex((p) => p.id === photo.id);
                    return (
                      <button
                        key={photo.id}
                        type="button"
                        onClick={() => setIndex(i)}
                        aria-label={`View ${photo.alt}`}
                        aria-current={i === index ? "true" : undefined}
                        className={cn(
                          "relative size-14 shrink-0 overflow-hidden rounded-md bg-zinc-100 transition-[opacity,box-shadow] duration-200 sm:size-16",
                          i === index
                            ? "opacity-100 ring-2 ring-pine-800 ring-offset-2"
                            : "opacity-60 hover:opacity-100",
                        )}
                      >
                        <Image src={photo.src} alt="" fill sizes="64px" className="object-cover" />
                      </button>
                    );
                  })}
                  <span aria-hidden="true" className="mx-1 h-8 w-px bg-zinc-200" />
                </div>
              ))}
            </div>

            <div className="flex items-center gap-1.5 border-t border-zinc-100 px-3 py-2 text-[0.75rem] text-zinc-500 sm:px-5">
              <ShieldCheck className="size-3.5 text-emerald-600" aria-hidden="true" />
              Shot by JosStay on inspection day. Not supplied by the property owner.
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
