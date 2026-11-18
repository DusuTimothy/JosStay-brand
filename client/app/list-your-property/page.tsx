import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  Camera,
  ClipboardCheck,
  Megaphone,
  Wallet,
  Headphones,
  ShieldCheck,
  Check,
  X,
} from "lucide-react";
import { PartnerForm } from "@/components/partner/partner-form";

export const metadata: Metadata = {
  title: "List your property",
  description:
    "Planned partnership model: JosStay handles photography, inspection, pricing, payments and guest support. Owner identity is never published.",
};

const HANDLED = [
  { icon: Camera, title: "Photography", body: "A daylight shoot of every room, re-shot when the property changes." },
  { icon: ClipboardCheck, title: "Inspection", body: "A dated agent report against the published checklist, before a listing goes live." },
  { icon: Megaphone, title: "Marketing", body: "Listing copy, neighbourhood SEO and paid social. The AI question box is a preview." },
  { icon: Wallet, title: "Payments", body: "Paystack collection, refunds and settlement, with a 10% commission split." },
  { icon: Headphones, title: "Guest support", body: "One line for check-in, faults, noise and emergencies — not you." },
  { icon: ShieldCheck, title: "Resolution", body: "One accountable team handles a problem. No re-housing promise is made." },
];

export default function ListPropertyPage() {
  return (
    <div className="mx-auto max-w-[1080px] px-4 pb-24 pt-10 sm:px-6 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
        <div>
          <p className="text-[0.6875rem] font-bold uppercase tracking-[0.12em] text-pine-700">
            For property owners
          </p>
          <h1 className="mt-3 text-display-hero text-obsidian">
            Your property, professionally run.
          </h1>
          <p className="mt-4 max-w-xl text-body text-zinc-600">
            The planned model: JosStay handles the photos, the inspection, the
            pricing, the guests and the problems. You keep 90% of the nightly
            rate, and your identity never appears on a public listing.
          </p>

          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-[0.8125rem] text-zinc-600">
            {["No listing fee", "No exclusivity lock-in after 90 days", "Settlement every 7 days"].map(
              (item) => (
                <span key={item} className="inline-flex items-center gap-1.5">
                  <Check className="size-4 text-emerald-600" aria-hidden="true" />
                  {item}
                </span>
              ),
            )}
          </div>

          <div className="mt-10">
            <h2 className="text-section text-obsidian">What we take on</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {HANDLED.map(({ icon: Icon, title, body }) => (
                <div key={title} className="rounded-xl border border-zinc-200 bg-white p-4">
                  <Icon className="size-4 text-pine-700" aria-hidden="true" />
                  <h3 className="mt-2 text-[0.875rem] font-bold text-obsidian">{title}</h3>
                  <p className="mt-1 text-[0.8125rem] leading-relaxed text-zinc-600">{body}</p>
                </div>
              ))}
            </div>
          </div>

          <div id="model" className="mt-10 scroll-mt-24">
            <h2 className="text-section text-obsidian">The commercial model</h2>
            <div className="mt-4 overflow-hidden rounded-xl border border-zinc-200 bg-white">
              {[
                ["You receive", "90% of the nightly rate"],
                ["JosStay commission", "10% of the nightly rate"],
                ["Paystack fee", "Paid by the hotel, not the guest"],
                ["Guest-facing price", "All-in — no separate service fee"],
                ["Cleaning fee", "Passed to you in full"],
                ["Settlement", "Every 7 days, to your Nigerian bank account"],
              ].map(([k, v], i) => (
                <div
                  key={k}
                  className={`flex flex-col gap-0.5 px-4 py-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6 ${
                    i > 0 ? "border-t border-zinc-100" : ""
                  }`}
                >
                  <span className="text-[0.8125rem] text-zinc-500">{k}</span>
                  <span className="text-[0.875rem] font-semibold text-obsidian sm:text-right">{v}</span>
                </div>
              ))}
            </div>
            <p className="mt-2 text-[0.75rem] text-zinc-500">
              Rates are indicative for the 2026 season and confirmed in your
              partner agreement after inspection.
            </p>
          </div>

          <div className="mt-10">
            <h2 className="text-section text-obsidian">What we ask of you</h2>
            <ul className="mt-3 space-y-2 text-[0.9375rem] text-zinc-700">
              {[
                "Exclusive availability on the dates you block. No double-selling on other platforms.",
                "A working lock, running water and a tested power backup.",
                "Furnishing and linen that match the inspection photos.",
                "Permission for JosStay to photograph and re-inspect every 90 days.",
                "A named local contact for emergencies who can be on site within 30 minutes.",
              ].map((item) => (
                <li key={item} className="flex gap-2.5">
                  <Check className="mt-0.5 size-4 shrink-0 text-pine-700" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-10 rounded-xl border border-zinc-200 bg-white p-5">
            <h2 className="font-display text-[1rem] font-bold text-obsidian">
              What we won't do
            </h2>
            <ul className="mt-2 space-y-1.5 text-[0.875rem] text-zinc-600">
              {[
                "Publish your name or phone number.",
                "Take a listing fee before the first booking.",
                "Keep you locked in if the partnership isn't working.",
              ].map((item) => (
                <li key={item} className="flex gap-2">
                  <X className="mt-0.5 size-3.5 shrink-0 text-zinc-400" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="lg:sticky lg:top-24">
          <h2 className="text-section text-obsidian">Apply for an inspection</h2>
          <p className="mt-1.5 text-[0.875rem] text-zinc-600">
            Two minutes now. We call within one business day.
          </p>
          <div className="mt-4">
            <PartnerForm />
          </div>
        </div>
      </div>

      <Link
        href="/"
        className="mt-14 inline-flex items-center gap-1.5 text-[0.875rem] font-semibold text-pine-800 underline-offset-4 hover:underline"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Back to JosStay
      </Link>
    </div>
  );
}
