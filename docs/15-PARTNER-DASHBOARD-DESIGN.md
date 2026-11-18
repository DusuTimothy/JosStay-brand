# JosStay — Partner Dashboard Design

**Status:** Built with sample data on 18 November 2026.
**Scope:** Hotel/partner workspace only. The admin verification console remains a separate stage.
**Route:** `/partner` (browser-visible, not linked from the public header, `noindex`).

This document is the design record for the partner dashboard. It exists so the workspace can be
completed now, with invented data, and later connected to verified data without redesigning a
screen.

---

## 1. What "complete" means here

The dashboard is complete as a **sample-data product surface**:

- Five working screens: overview, calendar, bookings, listing and payouts.
- A property switcher, local persistence, reset, filters, exports and sample mutations.
- Clearly labelled invented properties, guest names, dates, prices, bookings and payouts.
- One data boundary. No screen imports the sample snapshot directly.
- No real hotel, guest, payment, Paystack subaccount, email or WhatsApp message is involved.

It is **not** a production partner portal. There is no login, no server-backed write path and no
verified data yet. Those are listed in §7 as the explicit swap work.

---

## 2. Information architecture

```text
/partner                  Overview      — portfolio snapshot, arrivals, follow-ups
/partner/calendar         Calendar      — month grid, room filter, add/remove blocks
/partner/bookings         Bookings      — searchable ledger, detail panel, CSV export
/partner/listing          Listing       — public facts, rooms, policy, verification, subaccount
/partner/payouts          Payouts       — 10% split, Paystack fee, net, statement CSV
```

A shared layout owns:

- the sample-data banner and reset action;
- the property switcher;
- the five-item navigation with active state;
- the "Talk to JosStay" chat link;
- the privacy reminder that the workspace holds guest names only.

The public site header/footer stay as they are. The dashboard is not a redesign of the marketing
site; it is an added route group using the existing type scale, colours, buttons, badges and
surface rules.

---

## 3. Screen designs

### 3.1 Overview

Purpose: answer "what do I need to know about this property today?" in one screen.

- Four stats: upcoming confirmed bookings, room nights, all-in booked value and 10% commission.
- "Upcoming arrivals" list: guest name, reference, dates, nights and status. No contact details.
- "Next payout": scheduled sample amount and date, linked to the payout breakdown.
- "Needs attention": only concrete follow-ups (incomplete sample power test, paused rooms, blocks).
- Three next-action cards into calendar, listing and payouts.

"As at" comes from the snapshot's `generatedAt` value, not the browser clock. This keeps the sample
story stable and avoids rendering different dates on server and client.

### 3.2 Calendar

Purpose: keep the sample availability honest without touching a paid booking.

- Monday-start six-week grid; month navigation never changes grid height.
- Room filter: all rooms or one room.
- Each night is one of: **booked**, **blocked**, **open**, or **no active rooms**.
- Check-in is inclusive and check-out exclusive, matching the booking engine.
- Add block form: room, reason, from date, to date.
- Overlap rules: a new block is refused if it touches a live booking or an existing block on the
  same room. Cancelled and refunded sample bookings do not occupy nights.
- Current blocks can be removed. All changes are saved in browser storage while the source is
  sample data.

### 3.3 Bookings

Purpose: show what the hotel needs to prepare for, not what it must not know.

- Filters: search by reference or guest name, plus status.
- Table columns: reference, guest name, dates, nights, all-in total, commission and status.
- Detail panel: room, guest count, dates, all-in total, hotel share, policy template at booking and
  cancellation deadline.
- CSV export uses an explicit allow-list of columns. It contains no phone, email, address book,
  payment reference beyond the JosStay booking reference, or commission-bearing guest note.
- Bookings and statuses are **read-only**. In production they are written by the booking state
  machine and signed payment webhooks, not by a partner clicking a row.
- Changing a listing policy does not rewrite an existing booking's policy.

### 3.4 Listing

Purpose: let the hotel maintain the fields it owns while making the limits obvious.

- Public facts: property name, area, address, map pin and a map link. These remain public on
  guest-facing listings; nothing is unlocked by booking.
- Rooms: nightly price and active/paused state. Edits apply to future sample bookings only.
- Cancellation template: one of the three locked templates, with its plain-English summary.
- House rules: one per line, capped at eight.
- Sample inspection record: status, date, note and four concrete checks — listing exists, photos
  match, pin confirmed, power tested. Every record in the sample is visibly labelled as sample.
- Paystack subaccount: code, sample verification date and note. Marked internal only.

The hotel phone is absent from this screen by design. It is emailed only to the booked guest after
confirmation.

### 3.5 Payouts

Purpose: make the money arithmetic checkable at a glance.

- Stat cards: gross sample bookings, JosStay commission at 10%, Paystack fee, net to hotel.
- Table: period, date, gross, commission, fee, net and status.
- Paid and scheduled summary, plus the next sample payout date.
- A four-step explanation of the split: all-in guest price, fixed 10% commission, hotel bears the
  Paystack fee, remainder to hotel.
- Statement CSV with an explicit column allow-list.

Payout dates and amounts are invented. No transfer claim is made.

---

## 4. Sample-data contract

The canonical shape lives in `client/lib/partner-contract.ts` as Zod schemas and inferred types:

```text
PartnerSnapshot
  source: "sample" | "verified"
  generatedAt: string
  hotels: PartnerHotel[]
    rooms, blocks, bookings, payouts, verification, subaccount
```

`client/lib/partner-sample-data.ts` is the single drop point for invented records. It currently
contains two sample properties with different templates, one incomplete sample power test, one
owner-use block, completed and confirmed bookings, and paid and scheduled payouts.

Money is stored in kobo. Guest totals are all-in. The repeatable check enforces:

- commission is exactly 10% of gross for both bookings and payouts;
- hotel share and payout net reconcile;
- no block overlaps a live booking or another block;
- no contact field exists anywhere in the snapshot.

`source` is part of the contract so the banner can disappear automatically when verified data
arrives. Screens never branch on property identity or sample IDs.

---

## 5. Privacy limits

| Field | Where it appears | Rule |
|---|---|---|
| Guest name | Dashboard booking list and detail | Allowed. No phone or email exists in the snapshot. |
| Guest phone / guest email | Nowhere in the dashboard | Excluded from the contract and the CSV allow-lists. |
| Hotel phone | Guest confirmation email only | Not stored in the partner snapshot, receipt, WhatsApp or dashboard. |
| Address and map pin | Public listing, receipt, WhatsApp and dashboard | Public by locked decision. No booking gate. |
| Hotel contact email | Internal API column only | Not in the dashboard, public API or any guest message. |
| Subaccount code | Listing screen, internal panel only | Never shown to guests; not in any export. |

The workspace is `noindex`. It is not linked from the public header. That is a visibility measure,
not an access-control claim: authentication is part of the verified-data swap in §7.

---

## 6. States and feedback

- **Loading:** shared provider starts from the untouched sample snapshot, then hydrates browser
  storage. The shell shows the sample banner the whole time.
- **Saved:** local mutations show "Saved in this browser" once storage accepts the write.
- **Storage failure:** the mutation still updates the current tab and reports that persistence
  failed; it never claims a server write.
- **Corrupt stored snapshot:** invalid JSON or a schema mismatch is discarded and the original
  sample is restored.
- **Validation:** invalid price, dates, reasons, blocks or rule counts return a visible reason.
  Overlapping blocks are refused before any state change.
- **Empty:** every list has an explicit empty state; no number is invented to fill a gap.
- **Verified source:** banner and reset disappear; screens keep the same components and labels.

---

## 7. Swap to verified data

The screens depend on `PartnerDataProvider`, which depends on `partnerDataSource` in
`client/lib/partner-data.ts`. That export is the single swap point.

1. Implement `PartnerDataSource` with authenticated reads from the partner API:
   `load()` returns a `PartnerSnapshot` with `source: "verified"`.
2. Map server records into the existing `PartnerSnapshot` shape. Keep kobo amounts, ISO date-only
   strings and the locked status vocabulary. Do not add guest contact fields.
3. Replace `export const partnerDataSource = createLocalPartnerDataSource()` with the new
   implementation. No component under `client/components/partner/` changes.
4. Add real authorization and property-level ownership checks on the server. The dashboard is not
   safe to expose until this exists.
5. Move room price, room status, blocks, policy and house-rule mutations behind authenticated API
   endpoints with audit lines. The provider's mutation methods become calls to those endpoints.
6. Keep bookings and payouts read-only; their source of truth stays in the booking and payment
   services.
7. Remove `client/lib/partner-sample-data.ts` and the `verify:partner` sample check only after a
   verified snapshot has been exercised end to end. Until then, keep both for rehearsal.
8. Re-run the privacy review from §5 before the first real partner sees the workspace.

---

## 8. Files

- `client/lib/partner-contract.ts` — schema and shared types.
- `client/lib/partner-sample-data.ts` — invented records; single drop point.
- `client/lib/partner-data.ts` — data source boundary, validation and browser persistence.
- `client/lib/partner-view.ts` — date, overlap and CSV helpers.
- `client/scripts/verify-partner.ts` — repeatable sample, privacy and adapter check.
- `client/components/partner/partner-data-provider.tsx` — shared state and mutations.
- `client/components/partner/partner-shell.tsx` — navigation, banner, property switcher.
- `client/components/partner/partner-ui.tsx` — shared heading, card, stat, badge and notice pieces.
- `client/components/partner/screens/*` — the five screens.
- `client/app/partner/**` — routes and `noindex` metadata.
