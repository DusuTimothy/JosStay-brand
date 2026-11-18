import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, SlidersHorizontal } from "lucide-react";
import { StayExplorer } from "@/components/home/stay-explorer";
import { buttonClasses } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Search verified stays",
  description: "Browse every verified JosStay in Jos by neighbourhood and feature.",
  robots: { index: false, follow: true },
};

export default function SearchPage() {
  return (
    <div className="mx-auto max-w-[1280px] px-4 pb-24 pt-8 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[0.6875rem] font-bold uppercase tracking-[0.12em] text-pine-700">
            Search
          </p>
          <h1 className="mt-2 text-display text-obsidian">Every stay we've verified.</h1>
          <p className="mt-2 max-w-xl text-[0.9375rem] text-zinc-600">
            Filter by neighbourhood or by the thing that actually matters — 24/7
            power. Filters are live; no page reload.
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
        <StayExplorer />
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
