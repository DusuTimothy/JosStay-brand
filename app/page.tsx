import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Check, ShieldCheck, Zap, Camera, MapPin } from "lucide-react";
import { SearchPill } from "@/components/home/search-pill";
import { StayExplorer } from "@/components/home/stay-explorer";
import { buttonClasses } from "@/components/ui/button";

export default function HomePage() {
  return (
    <>
      {/* ---------------------------------------------------------------- Hero */}
      <section className="relative isolate overflow-hidden bg-pine-900">
        <Image
          src="/images/hero/hero-jos.jpg"
          alt="Golden-hour view across the Jos plateau"
          fill
          priority
          sizes="100vw"
          className="-z-10 object-cover object-center opacity-80"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-gradient-to-r from-pine-950/95 via-pine-900/85 to-pine-900/35"
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 -z-10 h-32 bg-gradient-to-t from-[var(--color-canvas)] to-transparent"
        />

        <div className="mx-auto max-w-[1280px] px-4 pb-16 pt-14 sm:px-6 sm:pb-20 sm:pt-20 lg:px-8">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[0.75rem] font-semibold text-white backdrop-blur-sm">
            <span className="size-1.5 rounded-full bg-emerald-400" />
            Jos, Plateau State · {new Date().getFullYear()}
          </span>

          <h1 className="mt-5 max-w-3xl text-display-hero text-white">
            Find a Jos stay you don’t have to double-check.
          </h1>
          <p className="mt-4 max-w-xl text-body text-white/85">
            Every JosStay is inspected, photographed and power-verified before it
            goes live. Book with Paystack or confirm on WhatsApp — you deal with
            us, not a stranger.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 text-[0.8125rem] text-white/85">
            {[
              ["Checked in person", <ShieldCheck key="s" className="size-4 text-emerald-400" />],
              ["24/7 power verified", <Zap key="z" className="size-4 text-emerald-400" />],
              ["Real photos only", <Camera key="c" className="size-4 text-emerald-400" />],
            ].map(([label, icon]) => (
              <span key={String(label)} className="inline-flex items-center gap-1.5">
                {icon}
                {label}
              </span>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="#stays" className={buttonClasses("signal", "lg")}>
              Browse stays
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
            <Link
              href="#promise"
              className="inline-flex h-12 items-center gap-2 rounded-md border border-white/25 px-6 text-base font-semibold text-white transition-colors hover:bg-white/10"
            >
              How verification works
            </Link>
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------- Search pill */}
      <div className="-mt-8">
        <SearchPill />
      </div>

      {/* ------------------------------------------------------------- Listings */}
      <section id="stays" className="scroll-mt-28 py-10 sm:py-14">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-1.5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[0.75rem] font-bold uppercase tracking-[0.1em] text-pine-700">
                Curated in Jos
              </p>
              <h2 className="mt-1.5 text-section text-obsidian">
                Stays we’ve actually walked through
              </h2>
            </div>
            <Link
              href="/search"
              className="inline-flex items-center gap-1.5 text-[0.875rem] font-semibold text-pine-800 underline-offset-4 hover:underline"
            >
              See all stays
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="mt-6">
            <StayExplorer />
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- Neighbourhoods */}
      <section id="areas" className="scroll-mt-28 border-y border-zinc-200 bg-white py-14 sm:py-16">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-1.5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[0.75rem] font-bold uppercase tracking-[0.1em] text-pine-700">
                Where to stay
              </p>
              <h2 className="mt-1.5 text-section text-obsidian">Pick your side of Jos</h2>
              <p className="mt-1.5 max-w-xl text-[0.875rem] text-zinc-500">
                Each area has its own character, traffic and power profile. These
                pages are written from inspections, not from listing counts.
              </p>
            </div>
          </div>

          <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { name: "Rayfield", blurb: "Quiet, central, best for business and family visits.", count: 24 },
              { name: "Lamingo", blurb: "Ridge views and newer builds; cooler evenings.", count: 18 },
              { name: "Little Rayfield", blurb: "Walkable to Rayfield, usually better value.", count: 11 },
              { name: "Bukuru", blurb: "Hotel-led, good for short business trips.", count: 15 },
              { name: "Bodija", blurb: "Close to the city centre and the market.", count: 9 },
              { name: "24/7 Power", blurb: "Solar and inverter stays, verified on inspection.", count: 31, feature: true },
            ].map((area) => (
              <Link
                key={area.name}
                href={
                  "feature" in area && area.feature
                    ? "/jos/24-7-power"
                    : `/jos/${area.name.toLowerCase().replace(/\s+/g, "-")}`
                }
                className="group flex items-start justify-between gap-4 rounded-xl border border-zinc-200 bg-white p-4 transition-[border-color,box-shadow,transform] hover:-translate-y-0.5 hover:border-pine-200 hover:shadow-raised motion-reduce:hover:translate-y-0"
              >
                <div>
                  <h3 className="flex items-center gap-1.5 font-display text-[0.9375rem] font-bold text-obsidian">
                    {"feature" in area && area.feature ? (
                      <Zap className="size-4 text-emerald-600" aria-hidden="true" />
                    ) : (
                      <MapPin className="size-4 text-pine-700" aria-hidden="true" />
                    )}
                    {area.name}
                  </h3>
                  <p className="mt-1 text-[0.8125rem] leading-snug text-zinc-500">{area.blurb}</p>
                </div>
                <span className="tabular shrink-0 rounded-full bg-zinc-100 px-2 py-0.5 text-[0.75rem] font-bold text-zinc-600">
                  {area.count}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------- Promise */}
      <section id="promise" className="scroll-mt-28 py-14 sm:py-20">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className="text-[0.75rem] font-bold uppercase tracking-[0.1em] text-pine-700">
                The JosStay Promise
              </p>
              <h2 className="mt-2 text-display text-obsidian">
                We check the stay, so you don’t have to.
              </h2>
              <p className="mt-4 max-w-lg text-body text-zinc-600">
                Most shortlet bookings in Nigeria end with a phone number and a
                prayer. JosStay replaces that with a record: who inspected the
                property, when, what the power actually does, and what happens if
                it is not as described.
              </p>

              <ul className="mt-6 space-y-3">
                {[
                  "Inspected and photographed by JosStay, not the owner",
                  "Power backed up and tested on the day of inspection",
                  "If it isn’t as described, we re-house you or refund you",
                  "One support line for the whole stay — no middlemen",
                ].map((item) => (
                  <li key={item} className="flex gap-2.5 text-[0.875rem] text-zinc-700">
                    <Check className="mt-0.5 size-4 shrink-0 text-emerald-600" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>

              <Link href="/promise" className={buttonClasses("primary", "md", "mt-7")}>
                Read the full promise
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-white p-1.5 shadow-raised">
              <div className="rounded-xl bg-pine-900 p-6 text-white sm:p-8">
                <p className="text-[0.75rem] font-bold uppercase tracking-[0.1em] text-emerald-400">
                  Inspection record
                </p>
                <p className="mt-2 font-display text-xl font-bold">
                  The Rayfield Garden Apartment
                </p>

                <dl className="mt-5 divide-y divide-white/10">
                  {[
                    ["Last inspected", "9 November 2026"],
                    ["Inspected by", "JosStay — Guest Experience"],
                    ["Photos", "12 images, shot by us"],
                    ["Power", "Solar + inverter, 24/7 tested"],
                    ["Security", "Gated estate, guard on duty"],
                    ["Open issues", "None"],
                  ].map(([k, v]) => (
                    <div key={k} className="flex items-baseline justify-between gap-4 py-2.5">
                      <dt className="text-[0.8125rem] text-white/60">{k}</dt>
                      <dd className="text-right text-[0.8125rem] font-semibold text-white">{v}</dd>
                    </div>
                  ))}
                </dl>

                <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-3 py-1 text-[0.75rem] font-bold text-emerald-400">
                  <span className="size-1.5 rounded-full bg-emerald-400" />
                  Passed inspection
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------------- Partner */}
      <section className="pb-16">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white">
            <div className="grid gap-6 p-6 sm:p-9 lg:grid-cols-[1.5fr_1fr] lg:items-center">
              <div>
                <h2 className="text-section text-obsidian">Own a place in Jos?</h2>
                <p className="mt-2 max-w-xl text-[0.875rem] text-zinc-600">
                  We handle photography, inspection, pricing and payment. Your name
                  and details never appear on the public listing — every guest
                  books through JosStay.
                </p>
              </div>
              <div className="flex flex-col gap-2.5 sm:flex-row lg:justify-end">
                <Link href="/list-your-property" className={buttonClasses("primary", "md")}>
                  List your property
                </Link>
                <Link href="/list-your-property#model" className={buttonClasses("secondary", "md")}>
                  How partnership works
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
