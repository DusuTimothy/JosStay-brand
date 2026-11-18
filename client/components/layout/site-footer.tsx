import Link from "next/link";
import { Instagram, Twitter, Facebook, ShieldCheck, Lock } from "lucide-react";
import { Logo } from "@/components/brand/logo";

const COLUMNS: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Support & trust",
    links: [
      { label: "Help centre", href: "/help" },
      { label: "The JosStay Promise", href: "/promise" },
      { label: "How we verify stays", href: "/promise#verification" },
      { label: "Report a problem", href: "/help#report" },
      { label: "Cancellation & refunds", href: "/legal/cancellation" },
      { label: "Contact us on WhatsApp", href: "https://wa.me/2348000000000" },
    ],
  },
  {
    title: "Explore Jos",
    links: [
      { label: "Rayfield shortlets", href: "/jos/rayfield" },
      { label: "Lamingo apartments", href: "/jos/lamingo" },
      { label: "Little Rayfield stays", href: "/jos/little-rayfield" },
      { label: "Bukuru hotels", href: "/jos/bukuru" },
      { label: "24/7 power stays", href: "/jos/24-7-power" },
      { label: "All Jos neighbourhoods", href: "/jos" },
    ],
  },
  {
    title: "Partner & company",
    links: [
      { label: "List your property", href: "/list-your-property" },
      { label: "Partner enquiries", href: "/list-your-property" },
      { label: "About JosStay", href: "/about" },
      { label: "Careers", href: "/about#careers" },
      { label: "Press", href: "/about#press" },
      { label: "josstay.ng", href: "/" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-zinc-200 bg-zinc-50">
      <div className="mx-auto max-w-[1280px] px-4 pb-10 pt-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_2fr]">
          <div className="max-w-sm">
            <Logo />
            <p className="mt-4 text-[0.875rem] leading-relaxed text-zinc-600">
              Verified shortlets and hotel rooms across Jos, Plateau State. Every
              stay checked before it goes live — so you can book without the
              guesswork.
            </p>
            <div className="mt-5 flex items-center gap-2">
              <a
                href="https://instagram.com/josstay"
                aria-label="JosStay on Instagram"
                className="inline-flex size-9 items-center justify-center rounded-full border border-zinc-300 bg-white text-zinc-600 transition-colors hover:border-pine-800 hover:text-pine-800"
              >
                <Instagram className="size-4" />
              </a>
              <a
                href="https://x.com/josstay"
                aria-label="JosStay on X"
                className="inline-flex size-9 items-center justify-center rounded-full border border-zinc-300 bg-white text-zinc-600 transition-colors hover:border-pine-800 hover:text-pine-800"
              >
                <Twitter className="size-4" />
              </a>
              <a
                href="https://facebook.com/josstay"
                aria-label="JosStay on Facebook"
                className="inline-flex size-9 items-center justify-center rounded-full border border-zinc-300 bg-white text-zinc-600 transition-colors hover:border-pine-800 hover:text-pine-800"
              >
                <Facebook className="size-4" />
              </a>
              <a
                href="https://wa.me/2348000000000"
                aria-label="Chat with JosStay on WhatsApp"
                className="inline-flex h-9 items-center gap-1.5 rounded-full bg-whatsapp-soft px-3 text-[0.75rem] font-semibold text-whatsapp-ink transition-colors hover:bg-[#d7f3e4]"
              >
                WhatsApp
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {COLUMNS.map((col) => (
              <div key={col.title}>
                <h2 className="font-display text-[0.8125rem] font-bold uppercase tracking-[0.08em] text-zinc-500">
                  {col.title}
                </h2>
                <ul className="mt-4 space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-[0.875rem] text-zinc-600 underline-offset-4 transition-colors hover:text-obsidian hover:underline"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Merchant + legal bar: everything Paystack review and NDPR expect to see. */}
        <div className="mt-12 flex flex-col gap-6 border-t border-zinc-200 pt-8">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <span className="inline-flex items-center gap-1.5 text-[0.8125rem] font-medium text-zinc-600">
              <ShieldCheck className="size-4 text-pine-700" aria-hidden="true" />
              Secured by Paystack
            </span>
            <span className="inline-flex items-center gap-1.5 text-[0.8125rem] font-medium text-zinc-600">
              <Lock className="size-4 text-pine-700" aria-hidden="true" />
              NDPR-compliant data handling
            </span>
            <span
              className="inline-flex items-center rounded-md border border-zinc-300 bg-white px-2 py-1 text-[0.75rem] font-semibold text-zinc-700"
              aria-label="Prices in Nigerian Naira"
            >
              ₦ NGN
            </span>
          </div>

          <div className="flex flex-col gap-3 text-[0.8125rem] text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} JosStay Hospitality Ltd. All rights reserved.</p>
            <nav aria-label="Legal" className="flex flex-wrap gap-x-5 gap-y-2">
              <Link href="/legal/terms" className="hover:text-obsidian hover:underline underline-offset-4">
                Terms of Service
              </Link>
              <Link href="/legal/privacy" className="hover:text-obsidian hover:underline underline-offset-4">
                Privacy Policy
              </Link>
              <Link href="/legal/cancellation" className="hover:text-obsidian hover:underline underline-offset-4">
                Cancellation & Refund Policy
              </Link>
              <Link href="/legal/house-rules" className="hover:text-obsidian hover:underline underline-offset-4">
                Guest House Rules
              </Link>
            </nav>
          </div>

          <p className="max-w-3xl text-[0.75rem] leading-relaxed text-zinc-500">
            JosStay is the merchant of record for every booking made on josstay.ng.
            Payments are processed by Paystack. Property owners are not displayed
            publicly; all bookings, payments and support are handled by JosStay.
          </p>
        </div>
      </div>
    </footer>
  );
}
