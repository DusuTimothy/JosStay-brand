import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, SlidersHorizontal } from "lucide-react";
import { StayExplorer } from "@/components/home/stay-explorer";
import { DemoPill } from "@/components/ui/demo-pill";
import { buttonClasses } from "@/components/ui/button";
import { AREAS } from "@/lib/data";

export const metadata: Metadata = {
  title: "Search demo stays",
  description:
    "Filter the clearly labelled demo stays in Jos by area, dates and guests. No hotel is live.",
  robots: { index: false, follow: true },
};

type RawSearchParams = Record<string, string | string[] | undefined>;

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<RawSearchParams>;
}) {
  const raw = await searchParams;
  const requestedArea = first(raw.area);
  const area = AREAS.some((item) => item.name === requestedArea)
    ? requestedArea
    : undefined;

  const guestValue = Number(first(raw.guests));
  const guests =
    Number.isInteger(guestValue) && guestValue >= 1 && guestValue <= 8
      ? guestValue
      : undefined;

  const fromValue = first(raw.from);
  const toValue = first(raw.to);
  const from = fromValue && ISO_DATE.test(fromValue) ? fromValue : undefined;
  const to = toValue && ISO_DATE.test(toValue) ? toValue : undefined;

  return (
    <div className="mx-auto max-w-[1280px] px-4 pb-24 pt-8 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[0.6875rem] font-bold uppercase tracking-[0.12em] text-pine-700">
            Search
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <h1 className="text-display text-obsidian">Every demo stay in Jos.</h1>
            <DemoPill label="No hotel is live" />
          </div>
          <p className="mt-2 max-w-xl text-[0.9375rem] text-zinc-600">
            Filter by neighbourhood, guest count and sample dates. Prices are
            all-in demo prices; blocked nights are examples, not live
            availability.
          </p>
        </div>
        <div className="flex gap-2">
          <span className="inline-flex h-10 items-center gap-1.5 rounded-md border border-zinc-300 bg-white px-3 text-[0.8125rem] font-semibold text-zinc-600">
            <SlidersHorizontal className="size-3.5" aria-hidden="true" />
            Filters
          </span>
          <Link href="/jos" className={buttonClasses("secondary", "sm", "h-10")}>
            By area
          </Link>
        </div>
      </div>

      <div className="mt-8">
        <StayExplorer
          initialArea={area}
          initialGuests={guests}
          initialFrom={from}
          initialTo={to}
        />
      </div>

      <Link
        href="/"
        className="mt-12 inline-flex items-center gap-1.5 text-[0.875rem] font-semibold text-pine-800 underline-offset-4 hover:underline"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Back to JosStay
      </Link>
    </div>
  );
}
