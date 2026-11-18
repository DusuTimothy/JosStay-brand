import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, MapPin, Zap, ShieldCheck, Car } from "lucide-react";
import { AREAS, STAYS } from "@/lib/data";
import { StayCard } from "@/components/home/stay-card";
import { buttonClasses } from "@/components/ui/button";

const COPY: Record<
  string,
  { lead: string; body: string; suits: string; getting: string; power: string }
> = {
  Rayfield: {
    lead: "The default choice for a reason.",
    body:
      "Rayfield is where most of our guests end up, and where most of our inventory is. It is quiet without being remote, central without the market noise, and the roads hold up better in the rainy season than most of the city. You are five minutes from the Rayfield Resort roundabout and ten from the city centre.",
    suits: "Business travellers, family visits, and anyone who wants to walk to a café.",
    getting: "10–15 minutes to the city centre by car. Bolt is reliable here during the day.",
    power: "Mixed grid. The demo note mentions solar or inverter backup; no test has been run.",
  },
  Lamingo: {
    lead: "Cooler air and a view.",
    body:
      "Lamingo sits on the ridge, so evenings are noticeably cooler and the views open up across the plateau. Newer builds dominate, which means better insulation and more consistent plumbing. It is a short drive from Rayfield but feels further away.",
    suits: "Couples, solo travellers, and anyone who wants quiet at the end of the day.",
    getting: "15–20 minutes to the centre. A car is more useful here than in Rayfield.",
    power: "Newer estates often have solar. Confirm the backup duration on the listing.",
  },
  "Little Rayfield": {
    lead: "Rayfield's quieter, better-value neighbour.",
    body:
      "Little Rayfield sits just off the main Rayfield corridor, close enough to walk for groceries but far enough to avoid the traffic. The housing stock is older and more varied, which is why a dated inspection matters here — and why prices are usually keener for the same number of bedrooms.",
    suits: "Longer stays, families, and guests who want space over polish.",
    getting: "Walkable to Rayfield amenities; 10 minutes by car to the centre.",
    power: "Older wiring is common. A real listing needs an under-load test recorded here; the demo has none.",
  },
  Bukuru: {
    lead: "Hotel service on the southern edge.",
    body:
      "Bukuru is hotel-led rather than shortlet-led, which suits guests who want breakfast, housekeeping and a front desk instead of a self-catered apartment. The hillside position gives it cooler evenings and a calmer feel than the city centre.",
    suits: "Short business trips, official visits, and guests who prefer hotel service.",
    getting: "20–25 minutes to central Jos. Budget for the drive.",
    power: "Hotels here typically run generator plus inverter. Ask about generator hours before booking.",
  },
  Bodija: {
    lead: "The most urban base we offer.",
    body:
      "Bodija is the closest thing to a city-centre stay in our collection: the market, transport and food are on the doorstep. It is livelier and noisier than the northern areas, and that is the point.",
    suits: "Guests who want to be in the middle of things and don't need a car.",
    getting: "Central. Most trips are short; traffic is the main variable.",
    power: "Grid-heavy area. A backup claim needs a dated test before it can be trusted.",
  },
  "24/7 Power": {
    lead: "Notes only — not tested in the demo.",
    body:
      "Power is the first question every guest asks, and the first thing most listings exaggerate. In the demo this collection groups stays whose notes mention 24/7 power. A real collection would require a dated test with the mains off, saying what actually kept running.",
    suits: "Remote workers, guests on calls, families with young children, and anyone who has been burned before.",
    getting: "Spread across Rayfield, Lamingo, Little Rayfield and Bukuru. Filter by area inside the collection.",
    power: "No property here has a dated power test yet. A 24/7 claim appears only after an agent test.",
  },
};

function slugFor(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function generateStaticParams() {
  return AREAS.map((area) => ({ area: slugFor(area.name) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ area: string }>;
}): Promise<Metadata> {
  const { area } = await params;
  const found = AREAS.find((a) => slugFor(a.name) === area);
  if (!found) return { title: "Area not found" };
  const copy = COPY[found.name];
  return {
    title: `Demo stays in ${found.name}, Jos`,
    description: `${copy.lead} ${copy.body.slice(0, 120)}…`,
  };
}

export default async function AreaPage({ params }: { params: Promise<{ area: string }> }) {
  const { area } = await params;
  const found = AREAS.find((a) => slugFor(a.name) === area);
  if (!found) notFound();

  const copy = COPY[found.name];
  const isFeature = "feature" in found && Boolean(found.feature);

  const stays = isFeature
    ? STAYS.filter((s) => /24\/7|Solar/i.test(s.power))
    : STAYS.filter((s) => s.area === found.name);

  return (
    <div className="mx-auto max-w-[1280px] px-4 pb-24 pt-6 sm:px-6 lg:px-8">
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[0.75rem] text-zinc-500">
        <Link href="/" className="hover:text-obsidian hover:underline underline-offset-4">
          JosStay
        </Link>
        <span aria-hidden="true">/</span>
        <Link href="/jos" className="hover:text-obsidian hover:underline underline-offset-4">
          Neighbourhoods
        </Link>
        <span aria-hidden="true">/</span>
        <span className="text-zinc-700">{found.name}</span>
      </nav>

      <header className="mt-6 max-w-3xl">
        <p className="inline-flex items-center gap-1.5 text-[0.6875rem] font-bold uppercase tracking-[0.12em] text-pine-700">
          {isFeature ? (
            <Zap className="size-3.5 text-emerald-600" aria-hidden="true" />
          ) : (
            <MapPin className="size-3.5" aria-hidden="true" />
          )}
          {isFeature ? "Feature guide" : "Neighbourhood guide"}
        </p>
        <h1 className="mt-2 text-display-hero text-obsidian">
          {isFeature ? "Stays with 24/7 power" : `Stays in ${found.name}`}
        </h1>
        <p className="mt-3 text-title text-pine-800">{copy.lead}</p>
        <p className="mt-3 text-body text-zinc-600">{copy.body}</p>
      </header>

      <dl className="mt-7 grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-zinc-200 bg-white p-4">
          <dt className="text-[0.6875rem] font-bold uppercase tracking-[0.07em] text-zinc-500">
            Best for
          </dt>
          <dd className="mt-1 text-[0.875rem] leading-relaxed text-obsidian">{copy.suits}</dd>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-4">
          <dt className="flex items-center gap-1 text-[0.6875rem] font-bold uppercase tracking-[0.07em] text-zinc-500">
            <Car className="size-3" aria-hidden="true" />
            Getting around
          </dt>
          <dd className="mt-1 text-[0.875rem] leading-relaxed text-obsidian">{copy.getting}</dd>
        </div>
        <div className="rounded-xl border border-pine-200 bg-pine-50 p-4">
          <dt className="flex items-center gap-1 text-[0.6875rem] font-bold uppercase tracking-[0.07em] text-pine-700">
            <ShieldCheck className="size-3" aria-hidden="true" />
            Power & verification
          </dt>
          <dd className="mt-1 text-[0.875rem] leading-relaxed text-pine-900">{copy.power}</dd>
        </div>
      </dl>

      <section className="mt-10">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="text-section text-obsidian">
            {stays.length} demo {stays.length === 1 ? "stay" : "stays"}
          </h2>
          <p className="hidden text-[0.8125rem] text-zinc-500 sm:block">
            All-in demo prices · NGN
          </p>
        </div>

        {stays.length > 0 ? (
          <div className="mt-5 grid grid-cols-1 gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
            {stays.map((stay, i) => (
              <StayCard key={stay.slug} stay={stay} priority={i < 2} />
            ))}
          </div>
        ) : (
          <div className="mt-5 rounded-2xl border border-dashed border-zinc-300 bg-white p-8 text-center">
            <p className="font-display text-lg font-bold text-obsidian">
              No demo stays in {found.name} yet
            </p>
            <p className="mx-auto mt-1 max-w-md text-[0.875rem] text-zinc-500">
              Try another area, or ask us on WhatsApp. No inspection is claimed
              for any demo listing.
            </p>
          </div>
        )}
      </section>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link href="/jos" className={buttonClasses("secondary", "md")}>
          <ArrowLeft className="size-4" aria-hidden="true" />
          All neighbourhoods
        </Link>
        <Link href="/#stays" className={buttonClasses("primary", "md")}>
          Browse every stay
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}
