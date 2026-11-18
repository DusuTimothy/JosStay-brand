import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Bath,
  BedDouble,
  Camera,
  Check,
  ChevronRight,
  Clock,
  DoorClosed,
  Lock,
  MapPin,
  ShieldCheck,
  Sparkles,
  Users,
  Zap,
  Ban,
  MessageCircle,
} from "lucide-react";
import { STAYS, getStay } from "@/lib/data";
import { naira } from "@/lib/format";
import { BookingProvider } from "@/components/booking/booking-provider";
import { GallerySection } from "@/components/stay/gallery-section";
import { BookingWidget } from "@/components/stay/booking-widget";
import { Amenities } from "@/components/stay/amenities";
import { Availability } from "@/components/stay/availability";
import { VerificationPanel } from "@/components/stay/verification-panel";
import { PolicyNote } from "@/components/stay/policy-note";
import { AskJosStay } from "@/components/home/ask-josstay";
import { Badge } from "@/components/ui/badge";

export function generateStaticParams() {
  return STAYS.map((stay) => ({ slug: stay.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const stay = getStay(slug);
  if (!stay) return { title: "Stay not found" };

  return {
    title: `${stay.name} — ${stay.area}, Jos (demo)`,
    description: `${stay.tagline}. ${stay.bedrooms} bedroom${stay.bedrooms > 1 ? "s" : ""}, sleeps ${stay.guests}. Demo listing — no inspection has taken place.`,
    openGraph: {
      title: `${stay.name} — JosStay`,
      description: stay.tagline,
      images: [{ url: stay.photos[0]?.src ?? "/images/hero/hero-jos.jpg" }],
    },
  };
}

export default async function StayPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const stay = getStay(slug);
  if (!stay) notFound();

  const facts = [
    { icon: Users, label: `${stay.guests} guests` },
    {
      icon: DoorClosed,
      label: `${stay.bedrooms} bedroom${stay.bedrooms > 1 ? "s" : ""}`,
    },
    { icon: BedDouble, label: `${stay.beds} bed${stay.beds > 1 ? "s" : ""}` },
    { icon: Bath, label: `${stay.baths} bath${stay.baths > 1 ? "s" : ""}` },
  ];

  return (
    <BookingProvider>
      <div className="mx-auto max-w-[1280px] px-4 pb-28 pt-5 sm:px-6 md:pb-16 lg:px-8">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[0.75rem] text-zinc-500">
          <Link href="/" className="hover:text-obsidian hover:underline underline-offset-4">
            JosStay
          </Link>
          <ChevronRight className="size-3" aria-hidden="true" />
          <Link
            href={`/jos/${stay.area.toLowerCase().replace(/\s+/g, "-")}`}
            className="hover:text-obsidian hover:underline underline-offset-4"
          >
            {stay.area}
          </Link>
          <ChevronRight className="size-3" aria-hidden="true" />
          <span className="truncate text-zinc-700">{stay.name}</span>
        </nav>

        {/* Title */}
        <div className="mt-3 flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-title text-obsidian">{stay.name}</h1>
            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[0.8125rem] text-zinc-600">
              <span className="inline-flex items-center gap-1">
                <MapPin className="size-3.5 text-pine-700" aria-hidden="true" />
                {stay.area}, Jos
              </span>
              <span aria-hidden="true" className="size-1 rounded-full bg-zinc-300" />
              <Badge tone="warning" size="sm">
                <Check className="size-3" aria-hidden="true" />
                Demo listing
              </Badge>
            </div>
          </div>

          <p className="text-right text-[0.8125rem] text-zinc-500">
            Managed and billed by JosStay
            <span className="mt-0.5 block text-[0.75rem] text-zinc-400">
              You never deal with the property owner
            </span>
          </p>
        </div>

        {/* Gallery */}
        <div className="relative mt-5">
          <GallerySection stay={stay} />
        </div>

        {/* Body: 65 / 35 */}
        <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1.65fr)_minmax(320px,1fr)] lg:gap-14">
          <div className="min-w-0 space-y-8">
            {/* Manager */}
            <section className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-200 pb-6">
              <div className="flex items-center gap-3">
                <span className="inline-flex size-11 items-center justify-center rounded-full bg-pine-800 text-white">
                  <ShieldCheck className="size-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="font-display text-[0.9375rem] font-bold text-obsidian">
                    Hosted by the JosStay team
                  </p>
                  <p className="mt-0.5 text-[0.8125rem] text-zinc-500">
                    {stay.verification.note}
                  </p>
                </div>
              </div>
              <p className="inline-flex items-center gap-1.5 text-[0.75rem] font-semibold text-pine-800">
                <Sparkles className="size-3.5 text-emerald-600" aria-hidden="true" />
                Illustrative sample photos
              </p>
            </section>

            {/* Facts */}
            <section aria-label="Stay size" className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {facts.map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-2.5 rounded-xl border border-zinc-200 bg-white px-3.5 py-3"
                >
                  <Icon className="size-4 shrink-0 text-pine-700" aria-hidden="true" />
                  <span className="text-[0.8125rem] font-semibold text-obsidian">{label}</span>
                </div>
              ))}
            </section>

            {/* The take */}
            <section className="rounded-2xl border border-pine-200 bg-pine-50 p-5">
              <p className="text-[0.6875rem] font-bold uppercase tracking-[0.1em] text-pine-700">
                The JosStay take
              </p>
              <p className="mt-2 text-[0.9375rem] leading-relaxed text-pine-900">
                This is a demo listing used to show how a JosStay page reads.
                {stay.tagline} No inspection has taken place, so nothing here is
                a verified claim about a real property.
              </p>
            </section>

            {/* Three trust rows */}
            <section aria-label="Verification details" className="divide-y divide-zinc-200">
              <TrustRow
                icon={<ShieldCheck className="size-5" />}
                title="Inspection pending"
                body={stay.verification.note}
              />
              <TrustRow
                icon={<Zap className="size-5" />}
                title={stay.power}
                body="This is a sample power note. A real listing only carries a 24/7 claim after an agent has tested the backup with the mains off."
              />
              <TrustRow
                icon={<Lock className="size-5" />}
                title={stay.security}
                body="Sample security note. On a real listing, gate, guards and CCTV are checked on the inspection visit. The exact address is shared only after a confirmed booking."
              />
            </section>

            {/* Description */}
            <section aria-labelledby="about-heading" className="border-t border-zinc-200 pt-7">
              <h2 id="about-heading" className="text-section text-obsidian">
                About this stay
              </h2>
              <p className="mt-3 text-body text-zinc-700">{stay.description}</p>
              <p className="mt-3 text-body text-zinc-700">
                JosStay is the merchant of record: you pay us, we hold the
                booking, and we handle anything that goes wrong during your stay.
                There is no separate “host” to chase.
              </p>
            </section>

            {/* Rooms */}
            <section aria-labelledby="rooms-heading" className="border-t border-zinc-200 pt-7">
              <h2 id="rooms-heading" className="text-section text-obsidian">
                Where you'll sleep
              </h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {stay.rooms.map((room) => (
                  <article
                    key={room.name}
                    className="rounded-xl border border-zinc-200 bg-white p-4"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-display text-[0.9375rem] font-bold text-obsidian">
                        {room.name}
                      </h3>
                      <BedDouble className="size-4 shrink-0 text-pine-700" aria-hidden="true" />
                    </div>
                    <p className="mt-1.5 text-[0.8125rem] text-zinc-600">{room.mattress}</p>
                    <div className="mt-2.5 flex flex-wrap gap-1.5">
                      <Badge tone="neutral" size="sm">
                        Sleeps {room.sleeps}
                      </Badge>
                      <Badge tone={room.ensuite ? "verified" : "outline"} size="sm">
                        {room.ensuite ? "Ensuite" : "Shared bath"}
                      </Badge>
                    </div>
                    {room.note ? (
                      <p className="mt-2.5 text-[0.8125rem] leading-snug text-zinc-500">
                        {room.note}
                      </p>
                    ) : null}
                  </article>
                ))}
              </div>
            </section>

            {/* Amenities */}
            <div className="border-t border-zinc-200 pt-7">
              <Amenities stay={stay} />
            </div>

            {/* Availability */}
            <div className="border-t border-zinc-200 pt-7">
              <Availability stay={stay} />
            </div>

            {/* Verification record */}
            <div className="border-t border-zinc-200 pt-7">
              <VerificationPanel stay={stay} />
            </div>

            {/* Rules */}
            <section aria-labelledby="rules-heading" className="border-t border-zinc-200 pt-7">
              <h2 id="rules-heading" className="text-section text-obsidian">
                House rules & safety
              </h2>
              <div className="mt-4 grid gap-6 sm:grid-cols-2">
                <div>
                  <h3 className="text-[0.8125rem] font-bold uppercase tracking-[0.06em] text-zinc-500">
                    House rules
                  </h3>
                  <ul className="mt-2 space-y-2 text-[0.875rem] text-zinc-700">
                    <li className="flex items-start gap-2">
                      <Clock className="mt-0.5 size-4 shrink-0 text-pine-700" aria-hidden="true" />
                      Check-in from 2pm, check-out by 11am
                    </li>
                    <li className="flex items-start gap-2">
                      <Ban className="mt-0.5 size-4 shrink-0 text-pine-700" aria-hidden="true" />
                      No parties, no commercial filming
                    </li>
                    <li className="flex items-start gap-2">
                      <Users className="mt-0.5 size-4 shrink-0 text-pine-700" aria-hidden="true" />
                      Only registered guests may stay overnight
                    </li>
                    <li className="flex items-start gap-2">
                      <Camera className="mt-0.5 size-4 shrink-0 text-pine-700" aria-hidden="true" />
                      No photography of other units or guests
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-[0.8125rem] font-bold uppercase tracking-[0.06em] text-zinc-500">
                    Safety & cancellation
                  </h3>
                  <div className="mt-2">
                    <PolicyNote policy={stay.policy} />
                  </div>
                  <ul className="mt-3 space-y-2 text-[0.875rem] text-zinc-700">
                    <li className="flex items-start gap-2">
                      <Check className="mt-0.5 size-4 shrink-0 text-pine-700" aria-hidden="true" />
                      Prices are all-in for the guest — no separate service fee.
                    </li>
                    <li className="flex items-start gap-2">
                      <MessageCircle className="mt-0.5 size-4 shrink-0 text-pine-700" aria-hidden="true" />
                      One support line for the whole stay
                    </li>
                  </ul>
                </div>
              </div>
              <Link
                href="/legal/house-rules"
                className="mt-4 inline-flex items-center gap-1 text-[0.8125rem] font-semibold text-pine-800 underline-offset-4 hover:underline"
              >
                Read the full house rules
                <ChevronRight className="size-3.5" aria-hidden="true" />
              </Link>
            </section>

            {/* Ask JosStay */}
            <div className="border-t border-zinc-200 pt-7">
              <AskJosStay />
            </div>

            {/* Location */}
            <section aria-labelledby="location-heading" className="border-t border-zinc-200 pt-7">
              <h2 id="location-heading" className="text-section text-obsidian">
                The neighbourhood
              </h2>
              <div className="relative mt-4 overflow-hidden rounded-2xl border border-zinc-200 bg-pine-900 p-6 text-white">
                <div
                  aria-hidden="true"
                  className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_20%_30%,#00D97E_0,transparent_45%),radial-gradient(circle_at_80%_70%,#4A9E85_0,transparent_50%)]"
                />
                <div className="relative">
                  <p className="inline-flex items-center gap-1.5 text-[0.75rem] font-bold uppercase tracking-[0.1em] text-emerald-400">
                    <MapPin className="size-3.5" aria-hidden="true" />
                    {stay.area}, Jos
                  </p>
                  <p className="mt-2 max-w-lg text-[0.9375rem] leading-relaxed text-white/85">
                    This demo shows the area only. On a real booking, the exact
                    address, map pin, gate code and the hotel phone are sent with
                    your confirmation.
                  </p>
                  <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[0.75rem] font-semibold text-white backdrop-blur-sm">
                    <Lock className="size-3" aria-hidden="true" />
                    Address shared after booking — a JosStay rule, not a host's
                  </p>
                </div>
              </div>
            </section>

            {/* Reviews summary */}
            <section aria-labelledby="reviews-heading" className="border-t border-zinc-200 pt-7">
              <h2 id="reviews-heading" className="text-section text-obsidian">
                Reviews
              </h2>
              <p className="mt-1.5 text-[0.875rem] text-zinc-600">
                No reviews yet. This is demo content, so no rating or review count
                is shown. Real reviews are collected after checkout and are never
                invented.
              </p>
            </section>

            <Link
              href="/#stays"
              className="inline-flex items-center gap-1.5 border-t border-zinc-200 pt-6 text-[0.875rem] font-semibold text-pine-800 underline-offset-4 hover:underline"
            >
              <ArrowLeft className="size-4" aria-hidden="true" />
              Back to all stays
            </Link>
          </div>

          {/* Booking column */}
          <aside className="min-w-0">
            <BookingWidget stay={stay} />
            <p className="mt-3 px-2 text-center text-[0.75rem] leading-snug text-zinc-500">
              From {naira(stay.nightly)} per night · demo price in NGN · no
              payment is connected in this preview.
            </p>
          </aside>
        </div>
      </div>
    </BookingProvider>
  );
}

function TrustRow({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="flex gap-3.5 py-4 first:pt-0 last:pb-0">
      <span className="mt-0.5 inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-pine-50 text-pine-800">
        {icon}
      </span>
      <div>
        <h3 className="text-[0.9375rem] font-bold text-obsidian">{title}</h3>
        <p className="mt-1 text-[0.875rem] leading-relaxed text-zinc-600">{body}</p>
      </div>
    </div>
  );
}
