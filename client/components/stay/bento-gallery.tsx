"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { Images } from "lucide-react";
import type { Photo } from "@/lib/data";
import { cn } from "@/lib/utils";

/**
 * The signature 5-photo bento.
 *
 * Desktop: a 4x2 grid, hero occupying 2x2 on the left, four square tiles on
 * the right. Fixed 460px height so the booking column below never jumps.
 *
 * Mobile: a native scroll-snap carousel — no JS on the scroll path — with a
 * live "3 / 12" counter, because dots alone cannot communicate depth on a
 * gallery this large.
 */
export function BentoGallery({
  photos,
  allPhotos,
  total,
  onOpen,
}: {
  photos: Photo[];
  allPhotos: Photo[];
  total: number;
  onOpen: (index: number) => void;
}) {
  const [active, setActive] = useState(0);
  const track = useRef<HTMLDivElement>(null);

  function handleScroll() {
    const el = track.current;
    if (!el) return;
    const next = Math.round(el.scrollLeft / el.clientWidth);
    if (next !== active) setActive(next);
  }

  return (
    <div className="relative">
      {/* ------------------------------------------------ Desktop bento */}
      <div className="hidden md:block">
        <div className="grid h-[460px] grid-cols-4 grid-rows-2 gap-2 overflow-hidden rounded-2xl">
          {photos.map((photo, i) => (
            <button
              key={photo.id}
              type="button"
              onClick={() => onOpen(i)}
              aria-label={`Open photo ${i + 1} of ${total}: ${photo.alt}`}
              className={cn(
                "group relative overflow-hidden bg-zinc-100 no-tap-highlight",
                "focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-emerald-500",
                i === 0 && "col-span-2 row-span-2",
              )}
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                priority={i === 0}
                sizes={i === 0 ? "(min-width: 1024px) 640px, 50vw" : "(min-width: 1024px) 320px, 25vw"}
                className="object-cover transition-[filter,transform] duration-500 ease-[var(--ease-out-expo)] group-hover:scale-[1.02] group-hover:brightness-90 will-transform motion-reduce:transform-none motion-reduce:transition-none"
              />
              {i === 0 ? (
                <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1 text-[0.6875rem] font-bold text-pine-800 shadow-sm backdrop-blur-sm">
                  <span className="inline-flex size-3.5 items-center justify-center rounded-full bg-amber-500 text-[0.5rem] text-white">
                    !
                  </span>
                  Demo photos
                </span>
              ) : null}
            </button>
          ))}
        </div>
      </div>

      {/* ------------------------------------------------- Mobile carousel */}
      <div className="md:hidden">
        <div
          ref={track}
          onScroll={handleScroll}
          className="scrollbar-none flex snap-x snap-mandatory overflow-x-auto rounded-xl"
        >
          {allPhotos.map((photo, i) => (
            <button
              key={photo.id}
              type="button"
              onClick={() => onOpen(i)}
              aria-label={`Open photo ${i + 1} of ${total}: ${photo.alt}`}
              className="relative aspect-[4/3] w-full shrink-0 snap-center overflow-hidden bg-zinc-100"
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                priority={i === 0}
                sizes="100vw"
                className="object-cover"
              />
            </button>
          ))}
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-3 flex items-center justify-between px-3">
          <span className="rounded-md bg-obsidian/70 px-2 py-1 text-[0.6875rem] font-semibold text-white tabular backdrop-blur-sm">
            {active + 1} / {total}
          </span>
          <span className="rounded-md bg-obsidian/70 px-2 py-1 text-[0.6875rem] font-semibold text-white backdrop-blur-sm">
            Swipe
          </span>
        </div>
      </div>

      {/* ----------------------------------------------------- Show all pill */}
      <button
        type="button"
        onClick={() => onOpen(0)}
        className="absolute bottom-3 right-3 hidden items-center gap-2 rounded-lg border border-obsidian/10 bg-white px-3.5 py-2 text-[0.8125rem] font-semibold text-obsidian shadow-raised transition-[background-color,transform] duration-200 hover:bg-zinc-50 active:scale-[0.97] md:inline-flex motion-reduce:active:scale-100"
      >
        <Images className="size-4" aria-hidden="true" />
        Show all {total} photos
      </button>
    </div>
  );
}
