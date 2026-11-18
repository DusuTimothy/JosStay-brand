"use client";

import { useEffect, useMemo, useState } from "react";
import { Download, Search } from "lucide-react";
import { usePartnerData } from "@/components/partner/partner-data-provider";
import {
  EmptyState,
  Notice,
  PartnerCard,
  PartnerHeading,
  StatusBadge,
} from "@/components/partner/partner-ui";
import { Button } from "@/components/ui/button";
import { POLICY_VIEWS } from "@/lib/data";
import { naira } from "@/lib/format";
import { downloadCsv, formatDate, formatDateTime } from "@/lib/partner-view";

const STATUSES = [
  { value: "all", label: "All statuses" },
  { value: "confirmed", label: "Confirmed" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
  { value: "refund_pending", label: "Refund pending" },
  { value: "refunded", label: "Refunded" },
];

export function PartnerBookings() {
  const { selectedHotel } = usePartnerData();
  const [status, setStatus] = useState("all");
  const [query, setQuery] = useState("");
  const [selectedRef, setSelectedRef] = useState("");

  useEffect(() => {
    setStatus("all");
    setQuery("");
    setSelectedRef("");
  }, [selectedHotel?.id]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return (selectedHotel?.bookings ?? [])
      .filter((booking) => status === "all" || booking.status === status)
      .filter(
        (booking) =>
          !needle ||
          booking.reference.toLowerCase().includes(needle) ||
          booking.guestName.toLowerCase().includes(needle),
      )
      .sort((a, b) => a.checkIn.localeCompare(b.checkIn));
  }, [selectedHotel?.bookings, status, query]);

  const active = filtered.find((booking) => booking.reference === selectedRef) ?? filtered[0] ?? null;

  if (!selectedHotel) {
    return <EmptyState title="No property in this snapshot" body="Reset the sample data to continue." />;
  }

  function exportCsv() {
    downloadCsv(
      `josstay-sample-bookings-${selectedHotel!.slug}.csv`,
      [
        "Reference",
        "Guest name",
        "Room",
        "Check in",
        "Check out",
        "Guests",
        "Nights",
        "All-in (NGN)",
        "Commission (NGN)",
        "Hotel share (NGN)",
        "Status",
        "Policy",
      ],
      filtered.map((booking) => [
        booking.reference,
        booking.guestName,
        selectedHotel!.rooms.find((room) => room.id === booking.roomId)?.name ?? booking.roomId,
        booking.checkIn,
        booking.checkOut,
        String(booking.guests),
        String(booking.nights),
        String(booking.totalKobo / 100),
        String(booking.commissionKobo / 100),
        String(booking.hotelShareKobo / 100),
        booking.status,
        booking.policyTemplate,
      ]),
    );
  }

  return (
    <>
      <PartnerHeading
        eyebrow="Bookings"
        title="Guest bookings"
        description="A read-only ledger of the sample bookings. In production, confirmation and refund status come from signed payment events, not from this screen."
        actions={
          <Button variant="secondary" size="md" onClick={exportCsv} disabled={filtered.length === 0}>
            <Download className="size-4" aria-hidden="true" />
            Export CSV
          </Button>
        }
      />

      <Notice tone="info">
        Guest names only. No guest phone, guest email or hotel phone is present in the sample or the
        export. This is deliberate: those details travel through the locked confirmation messages,
        not the partner workspace.
      </Notice>

      <PartnerCard title="All bookings" description={`${filtered.length} of ${selectedHotel.bookings.length} sample bookings shown.`}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <label className="relative flex-1">
            <span className="sr-only">Search by reference or guest name</span>
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400" aria-hidden="true" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search reference or guest name"
              className="h-10 w-full rounded-md border border-zinc-300 bg-white pl-9 pr-3 text-[0.8125rem] text-obsidian"
            />
          </label>
          <label>
            <span className="sr-only">Filter by status</span>
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              className="h-10 rounded-md border border-zinc-300 bg-white px-3 text-[0.8125rem] text-obsidian"
            >
              {STATUSES.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        {filtered.length === 0 ? (
          <div className="mt-4">
            <EmptyState
              title="No bookings match these filters"
              body="Clear the search or choose another status to see the sample ledger."
            />
          </div>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[900px] border-collapse text-left text-[0.8125rem]">
              <thead>
                <tr className="border-b border-zinc-200 text-[0.6875rem] uppercase tracking-[0.06em] text-zinc-500">
                  <th className="py-2.5 pr-3 font-bold">Reference</th>
                  <th className="py-2.5 pr-3 font-bold">Guest</th>
                  <th className="py-2.5 pr-3 font-bold">Dates</th>
                  <th className="py-2.5 pr-3 font-bold">All-in</th>
                  <th className="py-2.5 pr-3 font-bold">Commission</th>
                  <th className="py-2.5 pr-3 font-bold">Status</th>
                  <th className="py-2.5 font-bold"><span className="sr-only">Open</span></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {filtered.map((booking) => (
                  <tr
                    key={booking.reference}
                    className={active?.reference === booking.reference ? "bg-pine-50/60" : undefined}
                  >
                    <td className="py-3 pr-3 font-mono text-[0.75rem] text-zinc-700">{booking.reference}</td>
                    <td className="py-3 pr-3 font-semibold text-obsidian">{booking.guestName}</td>
                    <td className="py-3 pr-3 text-zinc-600">
                      {formatDate(booking.checkIn)} – {formatDate(booking.checkOut)}
                      <span className="block text-[0.75rem] text-zinc-400">{booking.nights} night{booking.nights === 1 ? "" : "s"}</span>
                    </td>
                    <td className="py-3 pr-3 font-semibold text-obsidian">{naira(booking.totalKobo / 100)}</td>
                    <td className="py-3 pr-3 text-zinc-600">{naira(booking.commissionKobo / 100)}</td>
                    <td className="py-3 pr-3"><StatusBadge status={booking.status} /></td>
                    <td className="py-3 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedRef(booking.reference)}
                        className="text-[0.75rem] font-semibold text-pine-800 underline-offset-4 hover:underline"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </PartnerCard>

      {active ? (
        <PartnerCard title="Booking detail" description={`${active.reference} · sample record`}>
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.8fr)]">
            <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
              {[
                ["Guest", active.guestName],
                ["Room", selectedHotel.rooms.find((room) => room.id === active.roomId)?.name ?? active.roomId],
                ["Guests", String(active.guests)],
                ["Nights", String(active.nights)],
                ["Check-in", formatDate(active.checkIn)],
                ["Check-out", formatDate(active.checkOut)],
                ["All-in total", naira(active.totalKobo / 100)],
                ["Hotel share", naira(active.hotelShareKobo / 100)],
              ].map(([label, value]) => (
                <div key={label}>
                  <dt className="text-[0.6875rem] font-bold uppercase tracking-[0.06em] text-zinc-500">{label}</dt>
                  <dd className="mt-1 text-[0.875rem] font-semibold text-obsidian">{value}</dd>
                </div>
              ))}
            </dl>
            <div className="rounded-xl border border-pine-200 bg-pine-50 p-4">
              <p className="text-[0.6875rem] font-bold uppercase tracking-[0.08em] text-pine-700">
                Policy at booking
              </p>
              <p className="mt-2 font-display text-[0.9375rem] font-bold text-pine-900">
                {POLICY_VIEWS[active.policyTemplate].label}
              </p>
              <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-pine-900">
                {POLICY_VIEWS[active.policyTemplate].summary}
              </p>
              <p className="mt-3 text-[0.75rem] text-zinc-600">
                Cancellation deadline: {formatDateTime(active.policyDeadlineAt)}
              </p>
              <p className="mt-3 border-t border-pine-200 pt-3 text-[0.75rem] leading-relaxed text-pine-900">
                Existing bookings keep the policy they were booked under. Changing the listing policy
                later applies to future bookings only.
              </p>
            </div>
          </div>
        </PartnerCard>
      ) : null}
    </>
  );
}
