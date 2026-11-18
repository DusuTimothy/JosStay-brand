import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  MessageCircle,
  Mail,
  ShieldAlert,
  ChevronDown,
  Phone,
} from "lucide-react";
import { buttonClasses } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Help centre",
  description:
    "Answers on booking, payment, check-in, power, cancellation and reporting a problem during a JosStay.",
};

const GROUPS: { title: string; items: { q: string; a: string }[] }[] = [
  {
    title: "Booking",
    items: [
      {
        q: "Do I need an account to book?",
        a: "No. You can book as a guest with a name, phone number and email. The lead guest must show a government-issued ID before access is released — that is a condition of every property, not a JosStay account requirement.",
      },
      {
        q: "Why can't I see the host or the exact address?",
        a: "JosStay is the merchant and the manager, not a directory. The owner is our supplier; your contract is with us. The exact address, gate code and driver directions are sent after your booking is confirmed. This protects both you and the owner.",
      },
      {
        q: "Can I book for someone else?",
        a: "Yes, as long as the lead guest's name and ID match the person checking in. Message us with the details before check-in so we release access to the right person.",
      },
      {
        q: "What is the minimum stay?",
        a: "Two nights on most properties. A few accept one night with a short-notice surcharge — ask on WhatsApp. The listing always states the minimum before you pay.",
      },
    ],
  },
  {
    title: "Payment & refunds",
    items: [
      {
        q: "What payment methods do you accept?",
        a: "Card, bank transfer and USSD through Paystack. Prices are in Nigerian Naira. We do not accept cash on arrival for new bookings, because the booking must be held before access is released.",
      },
      {
        q: "When is my card charged?",
        a: "At the moment you confirm the booking. You will receive a Paystack receipt and a JosStay booking reference by email and WhatsApp.",
      },
      {
        q: "How long do refunds take?",
        a: "We approve and initiate refunds within 24 hours. Paystack processes them asynchronously; a refund marked “processed” can still take up to 10 business days to appear, depending on your bank. That timeline belongs to Paystack and your bank, not to JosStay.",
      },
      {
        q: "Do I pay a service fee?",
        a: "No. The price you see is all-in. JosStay's commission is paid by the hotel. Your cancellation rights follow the template shown on the listing.",
      },
    ],
  },
  {
    title: "During your stay",
    items: [
      {
        q: "The power has gone off and the inverter isn't holding.",
        a: "Message the support line immediately with your booking reference. An agent reviews it against the listing record and the final terms. Do not wait until checkout.",
      },
      {
        q: "Something is broken or missing.",
        a: "Tell us before checkout. Accidental damage is handled fairly and usually settled from the security deposit. Concealed damage is treated as a breach of the house rules, which is worse for everyone.",
      },
      {
        q: "Can I check in early or leave late?",
        a: "Sometimes. Message us at least 24 hours ahead. Early check-in and late checkout depend on the cleaning schedule and may carry a fee.",
      },
      {
        q: "Can I extend my stay?",
        a: "Yes, if the dates are free. Pay the extension before the original checkout time so we can hold the unit. We will send a new confirmation for the extended nights.",
      },
    ],
  },
];

export default function HelpPage() {
  return (
    <div className="mx-auto max-w-[900px] px-4 pb-24 pt-10 sm:px-6 lg:px-8">
      <p className="text-[0.6875rem] font-bold uppercase tracking-[0.12em] text-pine-700">
        Help centre
      </p>
      <h1 className="mt-3 text-display text-obsidian">How can we help?</h1>
      <p className="mt-3 max-w-2xl text-body text-zinc-600">
        Most answers are below. If yours isn't, the support line is staffed
        8am–9pm WAT, every day — including during your stay.
      </p>

      <div className="mt-6 flex flex-wrap gap-2.5">
        <a
          href="https://wa.me/2348000000000?text=Hi%20JosStay%20%E2%80%94%20I%20need%20help."
          target="_blank"
          rel="noopener noreferrer"
          className={buttonClasses("whatsapp", "md")}
        >
          <MessageCircle className="size-4" aria-hidden="true" />
          WhatsApp support
        </a>
        <a href="tel:+2348000000000" className={buttonClasses("secondary", "md")}>
          <Phone className="size-4" aria-hidden="true" />
          Call the support line
        </a>
      </div>

      <div className="mt-10 space-y-8">
        {GROUPS.map((group) => (
          <section key={group.title}>
            <h2 className="text-section text-obsidian">{group.title}</h2>
            <div className="mt-3 overflow-hidden rounded-xl border border-zinc-200 bg-white">
              {group.items.map((item, i) => (
                <details
                  key={item.q}
                  className={`group ${i > 0 ? "border-t border-zinc-100" : ""}`}
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-3.5 text-[0.9375rem] font-semibold text-obsidian hover:bg-zinc-50 [&::-webkit-details-marker]:hidden">
                    {item.q}
                    <ChevronDown
                      className="size-4 shrink-0 text-zinc-400 transition-transform duration-200 group-open:rotate-180"
                      aria-hidden="true"
                    />
                  </summary>
                  <p className="px-4 pb-4 text-[0.875rem] leading-relaxed text-zinc-600">{item.a}</p>
                </details>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Report */}
      <section id="report" className="mt-12 scroll-mt-24 rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8">
        <p className="inline-flex items-center gap-1.5 rounded-full bg-[#FDF3F2] px-2.5 py-1 text-[0.6875rem] font-bold uppercase tracking-[0.08em] text-danger ring-1 ring-inset ring-[#F3C9C5]">
          <ShieldAlert className="size-3.5" aria-hidden="true" />
          Report a problem
        </p>
        <h2 className="mt-3 text-section text-obsidian">Something is wrong with the stay.</h2>
        <p className="mt-2 max-w-2xl text-[0.9375rem] leading-relaxed text-zinc-600">
          Contact us immediately — not at checkout. Send your booking reference, a
          short description and photos or a video if you can. If the property is
          unsafe or materially different from the listing, say so plainly: the
          Promise applies from the moment you tell us.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <a
            href="https://wa.me/2348000000000?text=PROBLEM%20%E2%80%94%20booking%20reference%3A%20"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-3 rounded-xl border border-zinc-200 p-4 transition-colors hover:border-pine-300 hover:bg-pine-50"
          >
            <MessageCircle className="mt-0.5 size-4 shrink-0 text-whatsapp-ink" aria-hidden="true" />
            <span>
              <span className="block text-[0.875rem] font-semibold text-obsidian">WhatsApp (fastest)</span>
              <span className="mt-0.5 block text-[0.8125rem] text-zinc-500">Message marked PROBLEM, with your reference.</span>
            </span>
          </a>
          <a
            href="mailto:support@josstay.ng?subject=Problem%20with%20my%20stay"
            className="flex items-start gap-3 rounded-xl border border-zinc-200 p-4 transition-colors hover:border-pine-300 hover:bg-pine-50"
          >
            <Mail className="mt-0.5 size-4 shrink-0 text-pine-700" aria-hidden="true" />
            <span>
              <span className="block text-[0.875rem] font-semibold text-obsidian">Email</span>
              <span className="mt-0.5 block text-[0.8125rem] text-zinc-500">support@josstay.ng — responses within 2 hours.</span>
            </span>
          </a>
        </div>
      </section>

      <div className="mt-10 flex flex-wrap items-center gap-4">
        <Link href="/" className="inline-flex items-center gap-1.5 text-[0.875rem] font-semibold text-pine-800 underline-offset-4 hover:underline">
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back to JosStay
        </Link>
        <Link href="/promise" className="text-[0.875rem] font-semibold text-pine-800 underline-offset-4 hover:underline">
          Read the JosStay Promise
        </Link>
        <Link href="/legal/cancellation" className="text-[0.875rem] font-semibold text-pine-800 underline-offset-4 hover:underline">
          Cancellation & refunds
        </Link>
      </div>
    </div>
  );
}
