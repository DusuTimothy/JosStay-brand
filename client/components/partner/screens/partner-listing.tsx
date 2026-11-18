"use client";

import { useEffect, useState } from "react";
import { ExternalLink, MapPin, PauseCircle, PlayCircle, ShieldCheck } from "lucide-react";
import type { PolicyTemplate } from "@josstay/shared";
import { usePartnerData, type MutationResult } from "@/components/partner/partner-data-provider";
import {
  EmptyState,
  Notice,
  PartnerCard,
  PartnerHeading,
  StatusBadge,
} from "@/components/partner/partner-ui";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { POLICY_VIEWS } from "@/lib/data";
import type { PartnerHotel, PartnerRoom, PartnerRoomStatus } from "@/lib/partner-contract";
import { formatDate } from "@/lib/partner-view";

function RoomEditor({
  room,
  onStatus,
  onPrice,
}: {
  room: PartnerRoom;
  onStatus: (status: PartnerRoomStatus) => Promise<MutationResult>;
  onPrice: (nightlyNaira: number) => Promise<MutationResult>;
}) {
  const [price, setPrice] = useState(String(room.nightlyKobo / 100));
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    setPrice(String(room.nightlyKobo / 100));
    setMessage(null);
  }, [room.nightlyKobo]);

  async function savePrice() {
    const result = await onPrice(Number(price));
    setMessage(result.ok ? "Sample price saved." : result.reason);
  }

  async function toggleStatus() {
    const next: PartnerRoomStatus = room.status === "active" ? "paused" : "active";
    const result = await onStatus(next);
    setMessage(result.ok ? `Room ${next} in the sample snapshot.` : result.reason);
  }

  return (
    <li className="rounded-xl border border-zinc-200 bg-white p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-display text-[0.9375rem] font-bold text-obsidian">{room.name}</p>
          <p className="mt-0.5 text-[0.75rem] text-zinc-500">
            Sleeps {room.sleeps} · {room.totalInventory} unit{room.totalInventory === 1 ? "" : "s"}
          </p>
        </div>
        <StatusBadge status={room.status} />
      </div>
      <div className="mt-4 flex flex-wrap items-end gap-2">
        <label className="text-[0.75rem] font-semibold text-zinc-600">
          Nightly price (₦)
          <input
            type="number"
            min="1"
            step="1"
            value={price}
            onChange={(event) => setPrice(event.target.value)}
            className="mt-1.5 w-36 rounded-md border border-zinc-300 bg-white px-3 py-2 text-[0.875rem] font-normal text-obsidian"
          />
        </label>
        <Button variant="primary" size="sm" onClick={savePrice}>
          Save price
        </Button>
        <Button variant="secondary" size="sm" onClick={toggleStatus}>
          {room.status === "active" ? (
            <PauseCircle className="size-3.5" aria-hidden="true" />
          ) : (
            <PlayCircle className="size-3.5" aria-hidden="true" />
          )}
          {room.status === "active" ? "Pause" : "Activate"}
        </Button>
      </div>
      {message ? <p className="mt-2 text-[0.75rem] text-zinc-600">{message}</p> : null}
      <p className="mt-2 text-[0.75rem] text-zinc-400">Price changes apply to future sample bookings only.</p>
    </li>
  );
}

function PolicyEditor({
  hotel,
  onPolicy,
  onRules,
}: {
  hotel: PartnerHotel;
  onPolicy: (template: PolicyTemplate) => Promise<MutationResult>;
  onRules: (rules: string[]) => Promise<MutationResult>;
}) {
  const [template, setTemplate] = useState<PolicyTemplate>(hotel.policyTemplate);
  const [rules, setRules] = useState(hotel.houseRules.join("\n"));
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    setTemplate(hotel.policyTemplate);
    setRules(hotel.houseRules.join("\n"));
    setMessage(null);
  }, [hotel.id, hotel.policyTemplate, hotel.houseRules]);

  async function save() {
    const policyResult = await onPolicy(template);
    if (!policyResult.ok) {
      setMessage(policyResult.reason);
      return;
    }
    const rulesResult = await onRules(rules.split("\n"));
    setMessage(rulesResult.ok ? "Sample policy and rules saved." : rulesResult.reason);
  }

  return (
    <div className="space-y-3">
      {message ? <Notice tone="info">{message}</Notice> : null}
      <label className="block text-[0.75rem] font-semibold text-zinc-600">
        Cancellation template
        <select
          value={template}
          onChange={(event) => setTemplate(event.target.value as PolicyTemplate)}
          className="mt-1.5 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-[0.8125rem] font-normal text-obsidian"
        >
          {(Object.keys(POLICY_VIEWS) as PolicyTemplate[]).map((key) => (
            <option key={key} value={key}>
              {POLICY_VIEWS[key].label}
            </option>
          ))}
        </select>
      </label>
      <p className="rounded-lg bg-zinc-50 px-3 py-2 text-[0.75rem] leading-relaxed text-zinc-600">
        {POLICY_VIEWS[template].summary}
      </p>
      <label className="block text-[0.75rem] font-semibold text-zinc-600">
        House rules (one per line)
        <textarea
          value={rules}
          onChange={(event) => setRules(event.target.value)}
          rows={4}
          className="mt-1.5 w-full resize-y rounded-md border border-zinc-300 bg-white px-3 py-2 text-[0.8125rem] font-normal leading-relaxed text-obsidian"
        />
      </label>
      <Button variant="primary" size="sm" onClick={save}>
        Save policy and rules
      </Button>
      <p className="text-[0.75rem] text-zinc-400">
        Existing bookings keep the template they were booked under.
      </p>
    </div>
  );
}

export function PartnerListing() {
  const {
    selectedHotel,
    setRoomStatus,
    updateRoomPrice,
    updatePolicy,
    updateHouseRules,
  } = usePartnerData();

  if (!selectedHotel) {
    return <EmptyState title="No property in this snapshot" body="Reset the sample data to continue." />;
  }

  const checks = [
    { label: "Listing exists", ok: true },
    { label: "Photos match sample record", ok: selectedHotel.verification.photosMatch },
    { label: "Map pin confirmed", ok: selectedHotel.verification.pinConfirmed },
    { label: "Power tested", ok: selectedHotel.verification.powerTested },
  ];

  return (
    <>
      <PartnerHeading
        eyebrow="Listing"
        title="Property details"
        description="What the hotel can maintain in the sample workspace. Public address and map pin stay public; the hotel phone is not stored here at all."
      />

      <Notice tone="info">
        The inspection record below is a sample record. It is not a claim about a real property. A
        verification badge only means listing real, photos match, pin confirmed and power tested —
        never a guarantee of hotel service.
      </Notice>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.25fr)_minmax(300px,0.8fr)]">
        <div className="space-y-5">
          <PartnerCard title="Public listing facts" description="These fields stay visible to guests.">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-[0.6875rem] font-bold uppercase tracking-[0.06em] text-zinc-500">Property</p>
                <p className="mt-1 text-[0.875rem] font-semibold text-obsidian">{selectedHotel.name}</p>
              </div>
              <div>
                <p className="text-[0.6875rem] font-bold uppercase tracking-[0.06em] text-zinc-500">Area</p>
                <p className="mt-1 text-[0.875rem] font-semibold text-obsidian">{selectedHotel.area}, Jos</p>
              </div>
              <div>
                <p className="text-[0.6875rem] font-bold uppercase tracking-[0.06em] text-zinc-500">Address</p>
                <p className="mt-1 text-[0.875rem] text-obsidian">{selectedHotel.address}</p>
              </div>
              <div>
                <p className="text-[0.6875rem] font-bold uppercase tracking-[0.06em] text-zinc-500">Map pin</p>
                <p className="mt-1 font-mono text-[0.8125rem] text-obsidian">
                  {selectedHotel.lat.toFixed(4)}, {selectedHotel.lng.toFixed(4)}
                </p>
                <a
                  href={`https://www.google.com/maps?q=${selectedHotel.lat},${selectedHotel.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-flex items-center gap-1 text-[0.75rem] font-semibold text-pine-800 underline-offset-4 hover:underline"
                >
                  Open map
                  <ExternalLink className="size-3" aria-hidden="true" />
                </a>
              </div>
            </div>
          </PartnerCard>

          <PartnerCard title="Rooms" description="Price and availability are local sample edits.">
            <ul className="space-y-3">
              {selectedHotel.rooms.map((room) => (
                <RoomEditor
                  key={room.id}
                  room={room}
                  onStatus={(status) => setRoomStatus(selectedHotel.id, room.id, status)}
                  onPrice={(price) => updateRoomPrice(selectedHotel.id, room.id, price)}
                />
              ))}
            </ul>
          </PartnerCard>

          <PartnerCard title="Cancellation policy and house rules" description="Templates are locked; copy is not invented per booking.">
            <PolicyEditor
              hotel={selectedHotel}
              onPolicy={(template) => updatePolicy(selectedHotel.id, template)}
              onRules={(rules) => updateHouseRules(selectedHotel.id, rules)}
            />
          </PartnerCard>
        </div>

        <div className="space-y-5">
          <PartnerCard title="Sample verification record" description={`Inspected ${formatDate(selectedHotel.verification.inspectedAt)} in the sample data.`}>
            <Badge
              tone={
                selectedHotel.verification.status === "Pass"
                  ? "verified"
                  : selectedHotel.verification.status === "Fail"
                    ? "danger"
                    : "warning"
              }
            >
              <ShieldCheck className="size-3" aria-hidden="true" />
              {selectedHotel.verification.status}
            </Badge>
            <ul className="mt-4 space-y-2.5">
              {checks.map((check) => (
                <li key={check.label} className="flex items-start gap-2 text-[0.8125rem] text-zinc-700">
                  <span
                    className={`mt-1 size-2 shrink-0 rounded-full ${check.ok ? "bg-pine-800" : "bg-[#F5D9B0]"}`}
                    aria-hidden="true"
                  />
                  {check.label}
                  <span className="ml-auto text-[0.75rem] font-semibold text-zinc-500">
                    {check.ok ? "Yes" : "Follow up"}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-4 rounded-lg bg-zinc-50 p-3 text-[0.75rem] leading-relaxed text-zinc-600">
              {selectedHotel.verification.note}
            </p>
          </PartnerCard>

          <PartnerCard title="Paystack subaccount" description="Internal only — never shown to guests.">
            <dl className="space-y-3 text-[0.8125rem]">
              <div>
                <dt className="text-[0.6875rem] font-bold uppercase tracking-[0.06em] text-zinc-500">Code</dt>
                <dd className="mt-1 font-mono text-obsidian">{selectedHotel.subaccount.code}</dd>
              </div>
              <div>
                <dt className="text-[0.6875rem] font-bold uppercase tracking-[0.06em] text-zinc-500">Verified in sample</dt>
                <dd className="mt-1 text-obsidian">
                  {selectedHotel.subaccount.verifiedAt ? formatDate(selectedHotel.subaccount.verifiedAt) : "Not recorded"}
                </dd>
              </div>
              <div>
                <dt className="text-[0.6875rem] font-bold uppercase tracking-[0.06em] text-zinc-500">Note</dt>
                <dd className="mt-1 leading-relaxed text-zinc-600">{selectedHotel.subaccount.note}</dd>
              </div>
            </dl>
          </PartnerCard>

          <div className="rounded-xl border border-zinc-200 bg-white p-4 text-[0.75rem] leading-relaxed text-zinc-600">
            <MapPin className="size-4 text-pine-700" aria-hidden="true" />
            <p className="mt-2 font-semibold text-obsidian">Why the phone is absent</p>
            <p className="mt-1">
              The address and pin are public. The hotel phone is emailed only to the booked guest
              after confirmation, so this workspace never needs to store or display it.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
