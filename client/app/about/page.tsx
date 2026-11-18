import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Briefcase, FileText, Mail, MapPin } from "lucide-react";
import { buttonClasses } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "About JosStay",
  description:
    "JosStay is a hotel marketplace in build for Jos, Plateau State. The plan is to inspect and photograph every property before it goes live, and never publish the owner.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-[900px] px-4 pb-24 pt-10 sm:px-6 lg:px-8">
      <p className="text-[0.6875rem] font-bold uppercase tracking-[0.12em] text-pine-700">
        About
      </p>
      <h1 className="mt-3 text-display-hero text-obsidian">
        Booking a stay should not be a gamble.
      </h1>
      <p className="mt-4 max-w-2xl text-body text-zinc-600">
        JosStay exists because finding a reliable shortlet in Nigeria usually
        means trusting a stranger's photos, a phone number and a prayer. The
        plan is to be the accountable party: inspect the property, take the
        payment, and answer when something breaks. None of that is live yet.
      </p>

      <section className="mt-10 grid gap-3 sm:grid-cols-3">
        {[
          ["Agent reports", "A dated inspection report before a listing goes live, then re-checked on a schedule."],
          ["Accountable", "One company from search to checkout. No hidden host, no middleman."],
          ["Local", "Jos only. The plateau is the product, not a launch pad."],
        ].map(([title, body]) => (
          <div key={title} className="rounded-xl border border-zinc-200 bg-white p-5">
            <p className="font-display text-[0.9375rem] font-bold text-obsidian">{title}</p>
            <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-zinc-600">{body}</p>
          </div>
        ))}
      </section>

      <section className="mt-12">
        <h2 className="text-section text-obsidian">How we operate</h2>
        <div className="mt-3 space-y-3 text-[0.9375rem] leading-relaxed text-zinc-700">
          <p>
            Property owners are suppliers; guests would contract with JosStay
            Hospitality Ltd. The intent is one accountable party controlling
            the listing, the price, the access and the resolution. Owner
            identity stays private — there is no host to display.
          </p>
          <p>
            We intend to keep the inventory small on purpose. Every real property
            will be walked through by an agent, photographed in daylight, and
            tested for power, water and security. If it fails, it does not go
            live. Today the site shows demo listings only.
          </p>
          <p>
            The name locks us to Jos, and that is deliberate. Local knowledge is
            the moat: which street floods, which estate keeps the lights on, which
            compound has a guard who actually checks the gate. The model can
            travel later; the trust has to be earned here first.
          </p>
        </div>
      </section>

      <section className="mt-10 rounded-2xl border border-pine-200 bg-pine-50 p-6">
        <h2 className="font-display text-lg font-bold text-pine-900">The standard we hold</h2>
        <p className="mt-2 text-[0.9375rem] leading-relaxed text-pine-900/85">
          The standard is a dated report, a stated power result and a cancellation
          rule the guest can read before paying. No hotel is live in the demo, so
          no resolution claim is made yet.
        </p>
        <Link
          href="/promise"
          className="mt-4 inline-flex items-center gap-1.5 text-[0.875rem] font-semibold text-pine-800 underline-offset-4 hover:underline"
        >
          Read the JosStay Promise
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </section>

      <section className="mt-12">
        <h2 className="text-section text-obsidian">Company</h2>
        <dl className="mt-3 overflow-hidden rounded-xl border border-zinc-200 bg-white">
          {[
            ["Legal name", "JosStay Hospitality Ltd"],
            ["Base", "Jos, Plateau State, Nigeria"],
            ["Model", "Hotel marketplace in build; merchant of record planned"],
            ["Payments", "Paystack (card, transfer, USSD)"],
            ["Support hours", "8am–9pm WAT, daily"],
          ].map(([k, v], i) => (
            <div
              key={k}
              className={`flex flex-col gap-0.5 px-4 py-3 sm:flex-row sm:items-baseline sm:justify-between ${
                i > 0 ? "border-t border-zinc-100" : ""
              }`}
            >
              <dt className="text-[0.8125rem] text-zinc-500">{k}</dt>
              <dd className="text-[0.875rem] font-semibold text-obsidian sm:text-right">{v}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-2 inline-flex items-center gap-1.5 text-[0.75rem] text-zinc-500">
          <MapPin className="size-3.5" aria-hidden="true" />
          Registered address and RC number available on request and on receipts.
        </p>
      </section>

      {/* Careers */}
      <section id="careers" className="mt-12 scroll-mt-24">
        <h2 className="flex items-center gap-2 text-section text-obsidian">
          <Briefcase className="size-5 text-pine-700" aria-hidden="true" />
          Work with us
        </h2>
        <p className="mt-2 text-[0.9375rem] leading-relaxed text-zinc-700">
          We hire slowly and locally. The roles that matter most are the ones
          guests never see: inspectors who are willing to fail a property, and
          support staff who answer the phone at 9pm.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {[
            ["Property inspector", "Jos · Full-time", "Walk properties, run the inspection checklist, shoot the photo set. Must be willing to reject a paying partner."],
            ["Guest experience associate", "Jos · Full-time", "Own the support line, check-ins and Promise cases. Calm under pressure, fluent in WhatsApp."],
          ].map(([role, meta, body]) => (
            <div key={role} className="rounded-xl border border-zinc-200 bg-white p-4">
              <p className="font-display text-[0.9375rem] font-bold text-obsidian">{role}</p>
              <p className="mt-0.5 text-[0.75rem] font-medium text-pine-700">{meta}</p>
              <p className="mt-2 text-[0.8125rem] leading-relaxed text-zinc-600">{body}</p>
              <a
                href={`mailto:careers@josstay.ng?subject=${encodeURIComponent(role)}`}
                className="mt-3 inline-flex items-center gap-1 text-[0.8125rem] font-semibold text-pine-800 underline-offset-4 hover:underline"
              >
                Apply by email
                <ArrowRight className="size-3.5" aria-hidden="true" />
              </a>
            </div>
          ))}
        </div>
        <p className="mt-3 text-[0.75rem] text-zinc-500">
          No open role that fits? Send a short note anyway —{" "}
          <a href="mailto:careers@josstay.ng" className="font-medium text-pine-800 underline underline-offset-4">
            careers@josstay.ng
          </a>
          .
        </p>
      </section>

      {/* Press */}
      <section id="press" className="mt-12 scroll-mt-24">
        <h2 className="flex items-center gap-2 text-section text-obsidian">
          <FileText className="size-5 text-pine-700" aria-hidden="true" />
          Press
        </h2>
        <p className="mt-2 text-[0.9375rem] leading-relaxed text-zinc-700">
          For interviews, data on the Jos shortlet market, or the brand assets,
          contact us directly. We can usually provide inspection data and
          occupancy commentary within a day.
        </p>
        <a
          href="mailto:press@josstay.ng"
          className={buttonClasses("secondary", "md", "mt-4")}
        >
          <Mail className="size-4" aria-hidden="true" />
          press@josstay.ng
        </a>
      </section>

      <div className="mt-12 flex flex-wrap items-center gap-4 border-t border-zinc-200 pt-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-[0.875rem] font-semibold text-pine-800 underline-offset-4 hover:underline"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back to JosStay
        </Link>
        <Link
          href="/styleguide"
          className="text-[0.875rem] font-semibold text-pine-800 underline-offset-4 hover:underline"
        >
          Design system
        </Link>
      </div>
    </div>
  );
}
