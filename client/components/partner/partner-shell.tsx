"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BedDouble,
  CalendarDays,
  ExternalLink,
  LayoutDashboard,
  ReceiptText,
  RotateCcw,
  Wallet,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { chatHref } from "@/components/booking/chat-fallback";
import { usePartnerData } from "@/components/partner/partner-data-provider";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/partner", label: "Overview", icon: LayoutDashboard },
  { href: "/partner/calendar", label: "Calendar", icon: CalendarDays },
  { href: "/partner/bookings", label: "Bookings", icon: ReceiptText },
  { href: "/partner/listing", label: "Listing", icon: BedDouble },
  { href: "/partner/payouts", label: "Payouts", icon: Wallet },
];

export function PartnerShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const {
    snapshot,
    selectedHotelId,
    selectHotel,
    isSample,
    savedAt,
    resetSampleData,
  } = usePartnerData();
  const [notice, setNotice] = useState<string | null>(null);
  const [resetting, setResetting] = useState(false);

  async function handleReset() {
    setResetting(true);
    const result = await resetSampleData();
    setNotice(result.ok ? "Sample data restored." : result.reason);
    setResetting(false);
  }

  return (
    <div className="min-h-[calc(100dvh-8rem)] bg-[var(--color-canvas)]">
      <div className="border-b border-[#F5D9B0] bg-[#FEF3E2]">
        <div className="mx-auto flex max-w-[1280px] flex-col gap-2 px-4 py-2.5 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-2 text-[0.8125rem] text-warning">
            <Badge tone="warning" size="sm">
              {isSample ? "Sample data" : "Verified data"}
            </Badge>
            <span>
              {isSample
                ? "Every property, booking and figure here is invented. Nothing is connected to a real hotel or payment."
                : "Connected to the verified partner data source."}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {savedAt ? (
              <span className="text-[0.75rem] text-zinc-600">Saved in this browser</span>
            ) : null}
            <a
              href={chatHref("Hello JosStay — I need help with the partner dashboard.")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[0.8125rem] font-semibold text-whatsapp-ink underline-offset-4 hover:underline"
            >
              Talk to JosStay
              <ExternalLink className="size-3" aria-hidden="true" />
            </a>
            {isSample ? (
              <Button
                variant="secondary"
                size="sm"
                onClick={handleReset}
                disabled={resetting}
                className="h-8 px-3 text-[0.75rem]"
              >
                <RotateCcw className="size-3.5" aria-hidden="true" />
                {resetting ? "Resetting…" : "Reset sample"}
              </Button>
            ) : null}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1280px] px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[230px_minmax(0,1fr)]">
          <aside className="self-start lg:sticky lg:top-24">
            <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-soft">
              <p className="text-[0.6875rem] font-bold uppercase tracking-[0.1em] text-zinc-500">
                Partner workspace
              </p>
              <label
                htmlFor="partner-hotel"
                className="mt-3 block text-[0.75rem] font-semibold text-zinc-600"
              >
                Property
              </label>
              <select
                id="partner-hotel"
                value={selectedHotelId}
                onChange={(event) => selectHotel(event.target.value)}
                className="mt-1.5 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-[0.8125rem] text-obsidian focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
              >
                {snapshot.hotels.map((hotel) => (
                  <option key={hotel.id} value={hotel.id}>
                    {hotel.name}
                  </option>
                ))}
              </select>
              <p className="mt-2 text-[0.75rem] leading-relaxed text-zinc-500">
                {snapshot.hotels.length} sample propert
                {snapshot.hotels.length === 1 ? "y" : "ies"} · no owner identity shown to guests
              </p>

              <nav aria-label="Partner dashboard" className="mt-5">
                <ul className="space-y-1">
                  {NAV.map(({ href, label, icon: Icon }) => {
                    const active = href === "/partner" ? pathname === href : pathname.startsWith(href);
                    return (
                      <li key={href}>
                        <Link
                          href={href}
                          aria-current={active ? "page" : undefined}
                          className={cn(
                            "flex items-center gap-2.5 rounded-lg px-3 py-2 text-[0.875rem] font-semibold transition-colors",
                            active
                              ? "bg-pine-800 text-white"
                              : "text-zinc-600 hover:bg-zinc-100 hover:text-obsidian",
                          )}
                        >
                          <Icon className="size-4" aria-hidden="true" />
                          {label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </nav>

              <div className="mt-5 border-t border-zinc-100 pt-4">
                <p className="text-[0.75rem] font-semibold text-obsidian">Privacy in this workspace</p>
                <p className="mt-1 text-[0.75rem] leading-relaxed text-zinc-500">
                  Guests appear by first name and surname only. No guest phone, guest email or hotel
                  phone is stored in this sample.
                </p>
              </div>
            </div>
          </aside>

          <div className="min-w-0 space-y-5">
            {notice ? <p className="text-[0.8125rem] text-pine-800">{notice}</p> : null}
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
