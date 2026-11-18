"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { Heart, Zap } from "lucide-react";
import type { Stay } from "@/lib/data";
import { bentoPhotos } from "@/lib/data";
import { naira } from "@/lib/format";
import { cn } from "@/lib/utils";

/**
 * Listing card: the primary discovery unit.
 *
 * Photo-first. The card is a carousel via CSS scroll-snap (native momentum,
 * no JS on the scroll path). Dots and the wishlist heart are the only
 * interactive pixels.
 */
export function StayCard({ stay, priority = false }: { stay: Stay; priority?: boolean }) {
  const [saved, setSaved] = useState(false);
  const [index, setIndex] = useState(0);
  const track = useRef<HTMLDivElement>(null);
  const photos = bentoPhotos(stay).slice(0, 4);
  const extra = Math.max(0, stay.photos.length - photos.length);

  function onScroll() {
    const el = track.current;
    if (!el) return;
    const i = Math.round(el.scrollLeft / el.clientWidth);
    if (i !== index) setIndex(i);
  }

  return (
    <article className="group relative">
      <div className="relative overflow-hidden rounded-2xl bg-zinc-100">
        <Link
          href={`/stays/${stay.slug}`}
          className="block focus-visible:outline-none"
          aria-label={`${stay.name} — ${stay.area}, Jos`}
        >
          <div
            ref={track}
            onScroll={onScroll}
            className="scrollbar-none flex snap-x snap-mandatory overflow-x-auto"
          >
            {photos.map((photo, i) => (
              <div
                key={photo.id}
                className="relative aspect-[4/3] w-full shrink-0 snap-center"
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  priority={priority && i === 0}
                  sizes="(max-width: 640px) 92vw, (max-width: 1024px) 45vw, 24vw"
                  className="object-cover transition-transform duration-300 ease-out will-transform group-hover:scale-105 motion-reduce:transform-none motion-reduce:transition-none"
                />
              </div>
            ))}
          </div>
        </Link>

        {/* State badge */}
        <div className="pointer-events-none absolute left-3 top-3 flex gap-1.5">
          <span className="inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-[0.6875rem] font-bold text-pine-800 shadow-sm backdrop-blur-sm">
            <span className="inline-flex size-3.5 items-center justify-center rounded-full bg-amber-500 text-[0.5rem] text-white">
              !
            </span>
            Demo listing
          </span>
          {stay.power.includes("24/7") || stay.power.includes("Solar") ? (
            <span className="hidden items-center gap-1 rounded-full bg-obsidian/85 px-2 py-1 text-[0.6875rem] font-bold text-emerald-400 backdrop-blur-sm sm:inline-flex">
              <Zap className="size-3" aria-hidden="true" />
              24/7
            </span>
          ) : null}
        </div>

        {/* Wishlist */}
        <button
          type="button"
          onClick={() => setSaved((v) => !v)}
          aria-pressed={saved}
          aria-label={saved ? `Remove ${stay.name} from saved` : `Save ${stay.name}`}
          className="absolute right-3 top-3 inline-flex size-9 items-center justify-center rounded-full bg-white/15 backdrop-blur-md transition-transform duration-200 hover:bg-white/25 active:scale-90 motion-reduce:active:scale-100"
        >
          <Heart
            className={cn(
              "size-4 transition-colors",
              saved ? "fill-rose-500 text-rose-500" : "text-white drop-shadow",
            )}
            aria-hidden="true"
          />
        </button>

        {/* Pagination dots */}
        {photos.length > 1 ? (
          <div className="pointer-events-none absolute inset-x-0 bottom-2.5 flex justify-center gap-1">
            {photos.map((p, i) => (
              <span
                key={p.id}
                className={cn(
                  "size-1.5 rounded-full transition-all duration-200",
                  i === index ? "w-4 bg-white" : "bg-white/55",
                )}
              />
            ))}
          </div>
        ) : null}

        {/* Photo count */}
        {extra > 0 ? (
          <span className="absolute bottom-2.5 right-2.5 rounded-md bg-obsidian/70 px-1.5 py-0.5 text-[0.625rem] font-semibold text-white tabular backdrop-blur-sm">
            +{extra}
          </span>
        ) : null}
      </div>

      <div className="mt-2.5 space-y-1">
        <div className="flex items-start justify-between gap-2">
          <Link
            href={`/stays/${stay.slug}`}
            className="line-clamp-1 font-display text-[0.9375rem] font-bold leading-snug text-obsidian underline-offset-4 hover:underline"
          >
            {stay.name}
          </Link>
          <span className="inline-flex shrink-0 rounded-full bg-zinc-100 px-2 py-0.5 text-[0.6875rem] font-bold text-zinc-600">
            Demo
          </span>
        </div>
        <p className="text-[0.8125rem] text-zinc-500">
          {stay.area}, Jos · {stay.bedrooms} bed{stay.bedrooms > 1 ? "s" : ""} · sleeps{" "}
          {stay.guests}
        </p>
        <p className="text-[0.8125rem] text-zinc-500">
          <span className="tabular text-[0.9375rem] font-bold text-obsidian">
            {naira(stay.nightly)}
          </span>{" "}
          <span className="text-zinc-500">night</span>
        </p>
      </div>
    </article>
  );
}
