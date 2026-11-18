import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, FileText, ShieldCheck, Clock, Ban } from "lucide-react";

type LegalDoc = {
  title: string;
  short: string;
  updated: string;
  intro: string;
  sections: { heading: string; paragraphs?: string[]; bullets?: string[] }[];
};

const DOCS: Record<string, LegalDoc> = {
  terms: {
    title: "Terms of Service",
    short: "The contract between you and JosStay Hospitality Ltd.",
    updated: "1 November 2026",
    intro:
      "These terms govern every booking made on josstay.ng or through JosStay's WhatsApp booking line. JosStay Hospitality Ltd is the merchant of record: we contract with you directly, we take payment, and we are responsible for delivering the stay.",
    sections: [
      {
        heading: "1. Who you are contracting with",
        paragraphs: [
          "JosStay Hospitality Ltd (“JosStay”, “we”, “us”) is a company registered in Nigeria. Our registered address and RC number are available on request and on every receipt.",
          "Property owners and managers are suppliers to JosStay. They are not parties to your booking contract and their identities are not disclosed publicly. All communication, payment and dispute handling runs through JosStay.",
        ],
      },
      {
        heading: "2. Bookings and confirmation",
        paragraphs: [
          "A booking is confirmed only when (a) you have paid the full amount or the agreed deposit, and (b) you have received a confirmation message from JosStay containing your booking reference, the property area, and check-in instructions.",
          "A WhatsApp conversation, quote or availability check is not a confirmation. If you have not received a confirmation reference, you do not have a booking.",
        ],
      },
      {
        heading: "3. Prices, fees and payment",
        bullets: [
          "All prices are quoted in Nigerian Naira (₦) and include VAT where applicable.",
          "The total shown at checkout includes the nightly rate and cleaning fee (where applicable). Guests pay no separate service fee; JosStay's commission is paid by the hotel.",
          "Payments are processed by Paystack. JosStay never stores your full card number or CVV.",
          "Optional extras (late checkout, airport pickup, extra housekeeping) are quoted separately and must be paid before delivery.",
        ],
      },
      {
        heading: "4. Your responsibilities",
        bullets: [
          "Provide accurate guest names and a valid government-issued ID for the lead guest before check-in.",
          "Respect the maximum occupancy. Unregistered overnight guests are a breach of these terms.",
          "Follow the house rules for the property, including noise, smoking and party restrictions.",
          "Report damage or missing items before checkout. Accidental damage is handled fairly; concealment is not.",
        ],
      },
      {
        heading: "5. Changes and cancellation",
        paragraphs: [
          "Cancellation and refund terms are set out in the Cancellation & Refund Policy, which forms part of these terms. Where the two documents conflict, the Cancellation & Refund Policy prevails for cancellation matters.",
          "We may cancel a booking if the property becomes unsafe or uninhabitable. In that case you receive a full refund and, where possible, a comparable alternative.",
        ],
      },
      {
        heading: "6. Liability",
        paragraphs: [
          "JosStay is responsible for the accuracy of the listing, the condition of the property at check-in, and the conduct of the stay as described. We are not liable for loss caused by events outside our reasonable control, including civil unrest, natural disasters, or government action.",
          "Our total liability for any booking is limited to the amount you paid for that booking, except where Nigerian law provides otherwise.",
        ],
      },
      {
        heading: "7. Governing law",
        paragraphs: [
          "These terms are governed by the laws of the Federal Republic of Nigeria. Disputes are subject to the exclusive jurisdiction of the courts of Plateau State.",
        ],
      },
    ],
  },

  privacy: {
    title: "Privacy Policy",
    short: "What we collect, why, and how to get it deleted.",
    updated: "1 November 2026",
    intro:
      "This policy explains how JosStay handles personal data under the Nigeria Data Protection Regulation (NDPR) and the Nigeria Data Protection Act 2023. We collect the minimum needed to verify a guest, take payment and run a safe stay.",
    sections: [
      {
        heading: "1. What we collect",
        bullets: [
          "Identity: full name, phone number, email address, and government ID for the lead guest (verified before check-in, not published).",
          "Booking: property, dates, guest count, and any special requests you send us.",
          "Payment: transaction reference and amount. Card details are handled entirely by Paystack; JosStay does not receive or store them.",
          "Communications: WhatsApp and email messages relating to your booking.",
          "Technical: device type, browser and pages visited, collected in aggregate for security and product improvement.",
        ],
      },
      {
        heading: "2. Why we collect it",
        bullets: [
          "To confirm and deliver your booking, including sharing check-in instructions.",
          "To verify identity and protect the property and neighbourhood — a condition of many of our tenancy agreements.",
          "To process payment, refunds and chargebacks.",
          "To meet tax, accounting and anti-fraud obligations.",
          "To contact you about your stay. Marketing messages are opt-in only and can be stopped at any time.",
        ],
      },
      {
        heading: "3. What we never do",
        bullets: [
          "We do not publish property owner names or contact details. Property addresses and map pins are public on listings.",
          "We do not sell personal data.",
          "We do not share your ID, phone number or email address with the hotel. The hotel receives the guest name, dates, guest count and booking total by email.",
          "We do not add you to a marketing list because you made a booking.",
        ],
      },
      {
        heading: "4. Who we share data with",
        paragraphs: [
          "We share only what is necessary with: Paystack (payments), Brevo (transactional email), Meta/WhatsApp (messaging), our hosting and database providers, and, where legally required, law enforcement or a regulator.",
          "All processors are bound by contract to use the data only for the service they provide to JosStay.",
        ],
      },
      {
        heading: "5. How long we keep it",
        bullets: [
          "Booking and payment records: 7 years, for tax and accounting.",
          "Guest ID verification: 12 months after checkout, then deleted.",
          "Support conversations: 24 months.",
          "Marketing preferences: until you withdraw consent.",
        ],
      },
      {
        heading: "6. Your rights",
        paragraphs: [
          "Under the NDPR you may request access to your data, correction of inaccurate data, deletion where there is no legal obligation to retain it, and withdrawal of marketing consent. Email privacy@josstay.ng and we will respond within 30 days.",
          "If you are unsatisfied, you may complain to the Nigeria Data Protection Commission (NDPC).",
        ],
      },
      {
        heading: "7. Security",
        paragraphs: [
          "Data is encrypted in transit (TLS 1.2+) and at rest. Access is role-limited and logged. Payment data never touches JosStay servers.",
        ],
      },
    ],
  },

  cancellation: {
    title: "Cancellation & Refund Policy",
    short: "The tiers, the timing, and how Paystack refunds actually land.",
    updated: "1 November 2026",
    intro:
      "Shortlet inventory is finite and last-minute cancellations cost the property real money. This policy balances that against the fact that plans change. The clock runs from the property's local check-in time (2pm WAT).",
    sections: [
      {
        heading: "The tiers",
        bullets: [
          "Flexible — free cancellation until 24 hours before check-in. After that, the first night is non-refundable.",
          "Moderate — free until 72 hours before check-in; 50% between 72 and 24 hours; no refund inside 24 hours.",
          "Strict — free until 24 hours after booking; no refund after that.",
          "Each hotel chooses one template. The listing shows which one applies before you pay.",
          "No-show — no refund.",
        ],
      },
      {
        heading: "The JosStay Promise overrides the tiers",
        paragraphs: [
          "If the property is not as described, unsafe, or uninhabitable, contact the support line with your booking reference. Resolution is handled case by case under the final terms. No automatic re-housing or refund is promised here.",
        ],
      },
      {
        heading: "How to cancel",
        bullets: [
          "Message the JosStay booking line on WhatsApp, or email support@josstay.ng, from the number or address on the booking.",
          "Include your booking reference. We confirm receipt within 2 hours during working hours (8am–9pm WAT).",
          "The cancellation timestamp is the time we receive your message, not the time you intended to send it.",
        ],
      },
      {
        heading: "How refunds are paid",
        paragraphs: [
          "Refunds are returned to the original payment method via Paystack. We initiate the refund within 24 hours of approving it.",
          "Paystack processes refunds asynchronously. A refund marked “processed” can still take up to 10 business days to appear on your card or bank statement, depending on your bank. This is a Paystack and bank timeline, not a JosStay delay.",
          "If a refund has not landed after 10 business days, send us the refund reference and we will chase Paystack with you.",
        ],
      },
      {
        heading: "Changes instead of cancellation",
        paragraphs: [
          "One date change is free if requested 72 hours or more before check-in and the new dates are available. A price difference may apply. Inside 72 hours, a date change is treated as a cancellation and rebooking.",
        ],
      },
      {
        heading: "Force majeure",
        paragraphs: [
          "If travel is prevented by a government restriction, civil unrest or a natural disaster, we will offer a credit valid for 12 months or a refund of the unused nights, even inside the 24-hour window.",
        ],
      },
    ],
  },

  "house-rules": {
    title: "Guest House Rules & ID Policy",
    short: "What we expect, what gets you removed, and why we ask for ID.",
    updated: "1 November 2026",
    intro:
      "These rules exist to protect guests, neighbours and the property. They are standard across all JosStay properties unless the listing states a stricter rule. Breaking them can end your stay without refund.",
    sections: [
      {
        heading: "1. Check-in and ID",
        bullets: [
          "Check-in is from 2pm; check-out is by 11am unless agreed in writing.",
          "The lead guest must present a valid government-issued ID (NIN slip, driver's licence, passport or voter's card) before access is released.",
          "Every additional adult staying overnight must be registered with a name. We do not publish these names; they are used for safety and insurance only.",
          "Access codes and exact addresses are shared only with the confirmed lead guest.",
        ],
      },
      {
        heading: "2. Occupancy",
        bullets: [
          "Do not exceed the listed maximum occupancy. Extra overnight guests are a breach of the booking.",
          "Day visitors are allowed within reason, but they must leave by 10pm and must not use the beds.",
          "Sub-letting or re-selling the unit is prohibited.",
        ],
      },
      {
        heading: "3. Noise and neighbours",
        bullets: [
          "Quiet hours are 10pm–7am. Music must not be audible outside the unit during those hours.",
          "Parties, events, and commercial filming or photography are not permitted without written approval and an additional fee.",
          "Repeated noise complaints are grounds for removal without refund.",
        ],
      },
      {
        heading: "4. Smoking, pets and substances",
        bullets: [
          "Smoking and vaping are prohibited indoors. A cleaning surcharge applies if smoking is detected.",
          "Pets are not permitted unless the listing explicitly says otherwise.",
          "Illegal substances are prohibited. We will involve the police.",
        ],
      },
      {
        heading: "5. Property and power",
        bullets: [
          "Do not tamper with the inverter, solar system, generator or meters. Report faults instead — we fix them.",
          "Do not move furniture between rooms or remove linens and appliances.",
          "Accidental damage should be reported before checkout. We handle it fairly; concealed damage is treated as a breach.",
          "Cooking is permitted in the kitchen only. Do not use open flames indoors.",
        ],
      },
      {
        heading: "6. Safety",
        bullets: [
          "Keep the gate closed. Do not prop it open or admit strangers.",
          "Do not disable or cover CCTV cameras or smoke alarms.",
          "In an emergency, call the JosStay support line first, then emergency services.",
        ],
      },
      {
        heading: "7. Removal and charges",
        paragraphs: [
          "JosStay may end a stay immediately, without refund, for serious breaches: violence or threats, illegal activity, exceeding occupancy, damaging the property, or repeated noise complaints. Where the law requires, we will assist the property owner in pursuing damages separately from the booking contract.",
        ],
      },
    ],
  },
};

const ICONS: Record<string, React.ReactNode> = {
  terms: <FileText className="size-4" />,
  privacy: <ShieldCheck className="size-4" />,
  cancellation: <Clock className="size-4" />,
  "house-rules": <Ban className="size-4" />,
};

export function generateStaticParams() {
  return Object.keys(DOCS).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const doc = DOCS[slug];
  if (!doc) return { title: "Policy not found" };
  return { title: doc.title, description: doc.short };
}

export default async function LegalPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const doc = DOCS[slug];
  if (!doc) notFound();

  return (
    <div className="mx-auto max-w-[820px] px-4 pb-24 pt-10 sm:px-6 lg:px-8">
      <div className="flex flex-wrap gap-2">
        {Object.entries(DOCS).map(([key, value]) => (
          <Link
            key={key}
            href={`/legal/${key}`}
            className={
              key === slug
                ? "inline-flex items-center gap-1.5 rounded-full bg-pine-800 px-3 py-1.5 text-[0.75rem] font-semibold text-white"
                : "inline-flex items-center gap-1.5 rounded-full border border-zinc-300 bg-white px-3 py-1.5 text-[0.75rem] font-semibold text-zinc-600 transition-colors hover:border-pine-300 hover:text-pine-800"
            }
          >
            {ICONS[key]}
            {value.title}
          </Link>
        ))}
      </div>

      <header className="mt-8 border-b border-zinc-200 pb-6">
        <p className="text-[0.6875rem] font-bold uppercase tracking-[0.12em] text-pine-700">
          Legal · JosStay Hospitality Ltd
        </p>
        <h1 className="mt-2 text-display text-obsidian">{doc.title}</h1>
        <p className="mt-3 max-w-2xl text-body-sm text-zinc-600">{doc.intro}</p>
        <p className="mt-4 text-[0.75rem] text-zinc-500">Last updated: {doc.updated}</p>
      </header>

      <div className="mt-8 space-y-8">
        {doc.sections.map((section) => (
          <section key={section.heading}>
            <h2 className="font-display text-[1.125rem] font-bold text-obsidian">
              {section.heading}
            </h2>
            {section.paragraphs?.map((p) => (
              <p key={p} className="mt-2.5 text-body-sm leading-relaxed text-zinc-700">
                {p}
              </p>
            ))}
            {section.bullets ? (
              <ul className="mt-3 space-y-2">
                {section.bullets.map((b) => (
                  <li key={b} className="flex gap-2.5 text-[0.9375rem] leading-relaxed text-zinc-700">
                    <span
                      aria-hidden="true"
                      className="mt-2 size-1.5 shrink-0 rounded-full bg-pine-700"
                    />
                    {b}
                  </li>
                ))}
              </ul>
            ) : null}
          </section>
        ))}
      </div>

      <div className="mt-12 rounded-xl border border-zinc-200 bg-white p-5">
        <p className="text-[0.875rem] font-semibold text-obsidian">Questions about this policy?</p>
        <p className="mt-1 text-[0.8125rem] text-zinc-600">
          Email{" "}
          <a href="mailto:support@josstay.ng" className="font-medium text-pine-800 underline underline-offset-4">
            support@josstay.ng
          </a>{" "}
          or message the JosStay line on WhatsApp. We answer within 2 hours,
          8am–9pm WAT.
        </p>
      </div>

      <Link
        href="/"
        className="mt-8 inline-flex items-center gap-1.5 text-[0.875rem] font-semibold text-pine-800 underline-offset-4 hover:underline"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Back to JosStay
      </Link>
    </div>
  );
}
