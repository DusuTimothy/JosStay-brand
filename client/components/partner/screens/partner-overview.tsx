"use client";

import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  ClipboardCheck,
  ShieldCheck,
  Users,
  Wallet,
} from "lucide-react";
import { usePartnerData } from "@/components/partner/partner-data-provider";
import {
  EmptyState,
  Notice,
  PartnerCard,
  PartnerHeading,
  PartnerStat,
  StatusBadge,
} from "@/components/partner/partner-ui";
import { buttonClasses } from "@/components/ui/button";
import { naira } from "@/lib/format";
import { formatShortDate, parseDateOnly } from "@/lib/partner-view";

export function PartnerOverview() {
  const { snapshot, selectedHotel } = usePartnerData();

  if (!selectedHotel) {
    return <EmptyState title="No property in this snapshot" body="Reset the sample data to continue." />;
  }

  const asAt = parseDateOnly(snapshot.generatedAt.slice(0, 10));
  const counted = selectedHotel.bookings.filter(
    (booking) => booking.status === "confirmed" || booking.status === "completed",
  );
  const upcoming = selectedHotel.bookings
    .filter(
      (booking) =>
        booking.status === "confirmed" && parseDateOnly(booking.checkIn) >= asAt,
    )
    .sort((a, b) => a.checkIn.localeCompare(b.checkIn));
  const roomNights = counted.reduce((sum, booking) => sum + booking.nights, 0);
  const bookedValue = counted.reduce((sum, booking) => sum + booking.totalKobo, 0);
  const commission = counted.reduce((sum, booking) => sum + booking.commissionKobo, 0);
  const nextPayout = selectedHotel.payouts.find((payout) => payout.status === "scheduled");
  const attention: string[] = [];
  if (!selectedHotel.verification.powerTested) {
    attention.push("Sample power test is marked incomplete — review before any real publish.");
  }
  const pausedRooms = selectedHotel.rooms.filter((room) => room.status === "paused").length;
  if (pausedRooms > 0) {
    attention.push(`${pausedRooms} room ${pausedRooms === 1 ? "is" : "are"} paused in this sample.`);
  }
  if (selectedHotel.blocks.length > 0) {
    attention.push(`${selectedHotel.blocks.length} owner-use block in the sample calendar.`);
  }

  return (
    <>
      <PartnerHeading
        eyebrow="Overview"
        title={`${selectedHotel.name}`}
        description={`Sample portfolio view as at ${formatShortDate(snapshot.generatedAt.slice(0, 10))}. Bookings and money are read-only here; the signed payment webhook is the source of truth in production.`}
        actions={
          <Link href="/partner/bookings" className={buttonClasses("primary", "md")}>
            View bookings
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        }
      />

      <Notice tone="info">
        Sample data only. Property names, guest names, dates, prices and payouts are invented. No
        real hotel, guest, payment or Paystack account is connected.
      </Notice>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <PartnerStat
          label="Confirmed bookings"
          value={String(upcoming.length)}
          note="Upcoming in this sample"
          tint="pine"
        />
        <PartnerStat
          label="Room nights"
          value={String(roomNights)}
          note="Confirmed and completed sample nights"
        />
        <PartnerStat
          label="All-in booked value"
          value={naira(bookedValue / 100)}
          note="Guests pay one all-in price"
        />
        <PartnerStat
          label="Commission at 10%"
          value={naira(commission / 100)}
          note="Paid by the hotel, never a guest fee"
        />
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.5fr)_minmax(300px,1fr)]">
        <PartnerCard
          title="Upcoming arrivals"
          description="Guest name, dates and room only — no contact details are held in this workspace."
          action={
            <Link
              href="/partner/bookings"
              className="text-[0.75rem] font-semibold text-pine-800 underline-offset-4 hover:underline"
            >
              All bookings
            </Link>
          }
        >
          {upcoming.length === 0 ? (
            <EmptyState
              title="No upcoming sample arrivals"
              body="Switch property or open the calendar to see the sample booking dates."
            />
          ) : (
            <ul className="divide-y divide-zinc-100">
              {upcoming.slice(0, 5).map((booking) => (
                <li key={booking.reference} className="flex flex-wrap items-center gap-3 py-3 first:pt-0 last:pb-0">
                  <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-pine-50 text-pine-800">
                    <Users className="size-4" aria-hidden="true" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[0.875rem] font-semibold text-obsidian">{booking.guestName}</p>
                    <p className="mt-0.5 text-[0.75rem] text-zinc-500">
                      {booking.reference} · {formatShortDate(booking.checkIn)} –{" "}
                      {formatShortDate(booking.checkOut)} · {booking.nights} night
                      {booking.nights === 1 ? "" : "s"}
                    </p>
                  </div>
                  <StatusBadge status={booking.status} />
                </li>
              ))}
            </ul>
          )}
        </PartnerCard>

        <div className="space-y-5">
          <PartnerCard title="Next payout" description="Sample schedule, not a payment instruction.">
            {nextPayout ? (
              <div>
                <p className="font-display text-[1.5rem] font-bold text-obsidian">
                  {naira(nextPayout.netKobo / 100)}
                </p>
                <p className="mt-1 text-[0.8125rem] text-zinc-500">
                  {nextPayout.period} · {formatShortDate(nextPayout.date)}
                </p>
                <Link
                  href="/partner/payouts"
                  className="mt-4 inline-flex items-center gap-1.5 text-[0.8125rem] font-semibold text-pine-800 underline-offset-4 hover:underline"
                >
                  See the breakdown
                  <ArrowRight className="size-3.5" aria-hidden="true" />
                </Link>
              </div>
            ) : (
              <p className="text-[0.8125rem] text-zinc-500">No scheduled sample payout.</p>
            )}
          </PartnerCard>

          <PartnerCard
            title="Needs attention"
            description="Small, actionable list — no decorative trust scores."
          >
            {attention.length === 0 ? (
              <p className="inline-flex items-center gap-2 text-[0.8125rem] text-pine-900">
                <ShieldCheck className="size-4" aria-hidden="true" />
                No sample follow-ups.
              </p>
            ) : (
              <ul className="space-y-2.5">
                {attention.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-[0.8125rem] leading-relaxed text-zinc-700">
                    <ClipboardCheck className="mt-0.5 size-4 shrink-0 text-warning" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </PartnerCard>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {[
          {
            href: "/partner/calendar",
            icon: CalendarDays,
            title: "Block a date",
            body: "Keep the sample calendar honest without touching a paid booking.",
          },
          {
            href: "/partner/listing",
            icon: ShieldCheck,
            title: "Review listing",
            body: "Price, house rules and the sample inspection record in one place.",
          },
          {
            href: "/partner/payouts",
            icon: Wallet,
            title: "Read payouts",
            body: "See the 10% commission and Paystack fee separated, never guessed.",
          },
        ].map(({ href, icon: Icon, title, body }) => (
          <Link
            key={href}
            href={href}
            className="group rounded-xl border border-zinc-200 bg-white p-4 shadow-soft transition-[border-color,box-shadow] hover:border-pine-200 hover:shadow-raised"
          >
            <Icon className="size-4 text-pine-700" aria-hidden="true" />
            <p className="mt-2 font-display text-[0.9375rem] font-bold text-obsidian">{title}</p>
            <p className="mt-1 text-[0.75rem] leading-relaxed text-zinc-500">{body}</p>
            <span className="mt-2 inline-flex items-center gap-1 text-[0.75rem] font-semibold text-pine-800">
              Open
              <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" aria-hidden="true" />
            </span>
          </Link>
        ))}
      </div>
    </>
  );
}
