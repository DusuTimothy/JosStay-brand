import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, MapPin, Zap } from "lucide-react";
import { AREAS } from "@/lib/data";
import { buttonClasses } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Jos neighbourhoods",
  description:
    "Areas derived from the demo stays in Jos: Rayfield, Lamingo, Little Rayfield and Bukuru. Counts are demo listings, not inspected inventory.",
};

export default function AreasIndexPage() {
  return (
    <div className="mx-auto max-w-[1080px] px-4 pb-24 pt-10 sm:px-6 lg:px-8">
      <p className="text-[0.6875rem] font-bold uppercase tracking-[0.12em] text-pine-700">
        Explore Jos
      </p>
      <h1 className="mt-3 text-display-hero text-obsidian">Pick your side of Jos.</h1>
      <p className="mt-4 max-w-2xl text-body text-zinc-600">
        Each area has a different traffic pattern, power profile and feel. These
        guides are derived from the demo stays below; no inspection is claimed
        for any of them yet.
      </p>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        {AREAS.filter((a) => !("feature" in a && a.feature)).map((area) => (
          <Link
            key={area.name}
            href={`/jos/${area.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`}
            className="group flex items-start justify-between gap-4 rounded-xl border border-zinc-200 bg-white p-5 transition-[border-color,box-shadow,transform] hover:-translate-y-0.5 hover:border-pine-200 hover:shadow-raised motion-reduce:hover:translate-y-0"
          >
            <div>
              <h2 className="flex items-center gap-1.5 font-display text-lg font-bold text-obsidian">
                <MapPin className="size-4 text-pine-700" aria-hidden="true" />
                {area.name}
              </h2>
              <p className="mt-1.5 text-[0.875rem] leading-relaxed text-zinc-600">
                {AREA_BLURB[area.name]}
              </p>
            </div>
            <span className="shrink-0 rounded-full bg-zinc-100 px-2.5 py-1 text-[0.75rem] font-bold text-zinc-600 tabular">
              {area.count}
            </span>
          </Link>
        ))}
      </div>

      <Link
        href="/jos/24-7-power"
        className="group mt-3 flex items-center justify-between gap-4 rounded-xl border border-pine-200 bg-pine-50 p-5 transition-colors hover:bg-pine-100"
      >
        <div>
          <h2 className="flex items-center gap-1.5 font-display text-lg font-bold text-pine-900">
            <Zap className="size-4 text-emerald-600" aria-hidden="true" />
            24/7 power stays
          </h2>
          <p className="mt-1.5 max-w-xl text-[0.875rem] leading-relaxed text-pine-900/80">
            This is a feature, not a neighbourhood. These demo stays carry a
            24/7 power note; no test has been run and no claim is verified.
          </p>
        </div>
        <ArrowRight className="size-5 shrink-0 text-pine-800 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
      </Link>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link href="/#stays" className={buttonClasses("primary", "md")}>
          Browse all stays
        </Link>
        <Link href="/" className="inline-flex h-11 items-center gap-1.5 px-1 text-[0.875rem] font-semibold text-pine-800 underline-offset-4 hover:underline">
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back to JosStay
        </Link>
      </div>
    </div>
  );
}

const AREA_BLURB: Record<string, string> = {
  Rayfield: "Quiet, central, best for business and family visits. One demo stay here.",
  Lamingo: "Ridge views and newer builds, with cooler evenings and easy access to the city.",
  "Little Rayfield": "Walkable to Rayfield, usually better value, popular with returning guests.",
  Bukuru: "Hotel-led and good for short business trips, with reliable security.",
  Bodija: "Close to the city centre and the market — the most urban of our areas.",
};
