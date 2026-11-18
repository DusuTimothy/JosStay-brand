import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Camera,
  Check,
  ClipboardCheck,
  CalendarClock,
  ShieldCheck,
  Zap,
  X,
  MessageCircle,
  Lock,
} from "lucide-react";
import { buttonClasses } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "The JosStay Promise",
  description:
    "How JosStay verifies every property before it goes live: inspection, photography, power testing, security checks and the re-house-or-refund guarantee.",
};

const STEPS = [
  {
    icon: ClipboardCheck,
    title: "We apply the same checklist to every property",
    body: "Forty-two points across cleanliness, safety, power, water, security, bedding and kitchen equipment. A property either passes all mandatory points or it does not go live. There is no partial listing.",
  },
  {
    icon: Camera,
    title: "We photograph it ourselves",
    body: "A JosStay team member shoots every room in daylight. Owners never supply the photos. If the furniture changes, the photos are re-shot before the listing stays up.",
  },
  {
    icon: Zap,
    title: "We test the power with the mains off",
    body: "We switch off the public supply and record what actually stays on: lights, fans, Wi-Fi, fridge, air conditioning. “24/7 power” means tested, not promised.",
  },
  {
    icon: Lock,
    title: "We check the gate, the guard and the cameras",
    body: "Security is verified on the same visit. We record the gate type, guard hours, CCTV coverage and parking. The exact address is only released after a booking is confirmed.",
  },
  {
    icon: CalendarClock,
    title: "We date the record and keep it current",
    body: "Every listing shows its last inspection date and the inspector. Records older than 90 days trigger a re-inspection. Open issues are listed, not hidden.",
  },
];

export default function PromisePage() {
  return (
    <div className="mx-auto max-w-[1080px] px-4 pb-24 pt-10 sm:px-6 lg:px-8">
      <header className="max-w-3xl">
        <p className="text-[0.6875rem] font-bold uppercase tracking-[0.12em] text-pine-700">
          The JosStay Promise
        </p>
        <h1 className="mt-3 text-display-hero text-obsidian">
          If it isn't as described, we fix it or refund it.
        </h1>
        <p className="mt-4 text-body text-zinc-600">
          Most shortlet bookings in Nigeria end with a phone number and a hope.
          JosStay replaces that with a record you can read before you pay, and a
          guarantee you can use after you arrive.
        </p>
      </header>

      {/* Guarantee box */}
      <section className="mt-8 overflow-hidden rounded-2xl border border-pine-200 bg-white shadow-raised">
        <div className="grid lg:grid-cols-[1.4fr_1fr]">
          <div className="p-6 sm:p-8">
            <p className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[0.6875rem] font-bold uppercase tracking-[0.08em] text-pine-800 ring-1 ring-inset ring-emerald-200">
              <ShieldCheck className="size-3.5" aria-hidden="true" />
              The guarantee
            </p>
            <h2 className="mt-3 text-section text-obsidian">
              Re-housed or refunded. Your choice.
            </h2>
            <p className="mt-2 text-[0.9375rem] leading-relaxed text-zinc-700">
              If the property is materially different from the listing, unsafe,
              or uninhabitable — no power, no water, a broken lock, a different
              unit — contact us within two hours of check-in. We will move you to
              a comparable JosStay at no extra cost, or refund the unused nights
              in full. We do not apply the normal cancellation tiers to this.
            </p>
            <div className="mt-5 flex flex-wrap gap-2.5">
              <a
                href="https://wa.me/2348000000000?text=Hi%20JosStay%20%E2%80%94%20I%20need%20help%20with%20a%20stay."
                target="_blank"
                rel="noopener noreferrer"
                className={buttonClasses("whatsapp", "md")}
              >
                <MessageCircle className="size-4" aria-hidden="true" />
                Message the support line
              </a>
              <Link href="/legal/cancellation" className={buttonClasses("secondary", "md")}>
                Read the refund policy
              </Link>
            </div>
          </div>
          <div className="border-t border-zinc-200 bg-pine-900 p-6 text-white sm:p-8 lg:border-l lg:border-t-0">
            <p className="text-[0.6875rem] font-bold uppercase tracking-[0.1em] text-emerald-400">
              What's covered
            </p>
            <ul className="mt-3 space-y-2.5 text-[0.875rem] text-white/85">
              {[
                "Listing accuracy (rooms, beds, bathrooms, amenities)",
                "Power and water as described",
                "Safety and access (locks, gate, security)",
                "Cleanliness below the inspection standard",
                "Double-booking or unit substitution",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <Check className="mt-0.5 size-4 shrink-0 text-emerald-400" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Steps */}
      <section id="verification" className="mt-14 scroll-mt-24">
        <p className="text-[0.6875rem] font-bold uppercase tracking-[0.12em] text-pine-700">
          How verification works
        </p>
        <h2 className="mt-2 text-display text-obsidian">Five steps, no shortcuts</h2>

        <ol className="mt-6 space-y-3">
          {STEPS.map((step, i) => (
            <li
              key={step.title}
              className="grid gap-4 rounded-xl border border-zinc-200 bg-white p-5 sm:grid-cols-[auto_1fr_auto] sm:items-start"
            >
              <span className="inline-flex size-11 items-center justify-center rounded-full bg-pine-50 text-pine-800">
                <step.icon className="size-5" aria-hidden="true" />
              </span>
              <div>
                <h3 className="font-display text-[1rem] font-bold text-obsidian">{step.title}</h3>
                <p className="mt-1 text-[0.875rem] leading-relaxed text-zinc-600">{step.body}</p>
              </div>
              <span className="hidden font-display text-[2rem] font-extrabold leading-none text-zinc-200 tabular sm:block">
                0{i + 1}
              </span>
            </li>
          ))}
        </ol>
      </section>

      {/* Not covered */}
      <section className="mt-14">
        <h2 className="text-section text-obsidian">What the promise is not</h2>
        <p className="mt-1.5 max-w-2xl text-[0.875rem] text-zinc-600">
          A guarantee is only credible if it has edges. These are ours.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {[
            "A change of mind after check-in. Use the cancellation tiers instead.",
            "Noise from the neighbourhood, traffic, or weather. We will help you move, but this is not a defect.",
            "A guest's own damage or loss of personal items.",
            "Requests for services the listing never offered (airport pickup, daily chef, extra beds).",
          ].map((item) => (
            <p
              key={item}
              className="flex items-start gap-2.5 rounded-xl border border-zinc-200 bg-white p-4 text-[0.875rem] leading-relaxed text-zinc-700"
            >
              <X className="mt-0.5 size-4 shrink-0 text-zinc-400" aria-hidden="true" />
              {item}
            </p>
          ))}
        </div>
      </section>

      {/* Why hosts are hidden */}
      <section className="mt-14 rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8">
        <h2 className="text-section text-obsidian">Why you never see the owner's name</h2>
        <div className="mt-3 grid gap-5 sm:grid-cols-2">
          <p className="text-[0.9375rem] leading-relaxed text-zinc-700">
            JosStay is not a directory. We hold the contract, take the payment and
            answer the phone when something breaks. Hiding the owner is not about
            secrecy — it is about removing the middleman from your stay.
          </p>
          <p className="text-[0.9375rem] leading-relaxed text-zinc-700">
            It also protects owners from being poached off-platform after a single
            booking, which is what makes it possible to keep inspecting and
            improving the inventory. You get one accountable company; they get a
            predictable channel.
          </p>
        </div>
      </section>

      <div className="mt-12 flex flex-wrap items-center gap-3">
        <Link href="/#stays" className={buttonClasses("primary", "lg")}>
          Browse verified stays
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-[0.875rem] font-semibold text-pine-800 underline-offset-4 hover:underline"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back to JosStay
        </Link>
      </div>
    </div>
  );
}
