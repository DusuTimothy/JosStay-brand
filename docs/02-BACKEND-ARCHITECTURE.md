# JosStay — Backend Architecture

**Status:** Design locked. Stages 4–7 implement §3–§6 and the public read, booking-create, payment and webhook paths of §8; refunds, messaging, AI and admin remain the build target.
**Date:** 17 November 2026

---

## 1. Topology

```
Guest browser / WhatsApp
        │
        ▼
Next.js 16 (Vercel)            ← SSR, SEO, JSON-LD, image optimisation, UI
        │  HTTPS / JSON
        ▼
Express API (Render)           ← all domain logic, payments, webhooks, jobs
   ├── PostgreSQL (Supabase)   ← source of truth
   ├── Redis                   ← short-lived holds, rate limits, cache
   ├── Cloudinary              ← hotel photography
   ├── Paystack                ← hosted checkout, 10% split, refunds, transfers
   ├── Brevo                   ← transactional email
   ├── WhatsApp Business API   ← confirmations, support, book-by-chat
   └── LLM provider            ← search, policy Q&A, report checks
```

Why two apps: Next.js owns fast, indexable pages; Express owns money, state and integrations. Webhooks and jobs never depend on a page render.

---

## 2. Core modules

| Module | Responsibility |
|---|---|
| `catalog` | Hotels, rooms, areas (derived), amenities, photography |
| `verification` | Agent assignments, checklist reports, badge status, audit trail |
| `search` | Filter parsing (including AI-generated filters), ranking, distance |
| `availability` | Room calculation, holds, blocks, walk-ins |
| `booking` | Booking lifecycle, state machine, totals, policy deadline |
| `payment` | Paystack checkout init, 10% split, webhook, refunds, reconciliation |
| `messaging` | Brevo email, WhatsApp templates, book-by-chat handoff |
| `admin` | Approve hotels, resolve disputes, view payouts and reports |
| `ai` | Natural-language search, policy Q&A, photo checks, report summaries |
| `audit` | Every money or status change gets an immutable log line |

---

## 3. Database tables (essential fields)

**hotels** — `id`, `slug`, `name`, `area_id`, `address`, `lat`, `lng`, `phone_encrypted` (never returned by public API), `contact_email` (internal only; used for hotel booking confirmations, never returned by public API), `nightly_kobo`, `policy_template`, `house_rules`, `status` (draft | pending | published), `demo`, `commission_bps` (default 1000 = 10%), `paystack_subaccount_code`.

**rooms** — `id`, `hotel_id`, `name`, `total_inventory`, `sleeps`, `bed`, `ensuite`.

**verifications** — `id`, `hotel_id`, `agent_ref`, `inspected_at`, `status`, `checks_json`, `report_url`, `notes`, `created_at`. Full reports are internal-only.

**areas** — `id`, `slug`, `name`, `centre_lat`, `centre_lng`. Created from hotel data.

**bookings** — `id`, `reference`, `hotel_id`, `room_id`, `guest_name`, `guest_email`, `guest_phone`, `check_in`, `check_out`, `guests`, `status`, `total_kobo`, `commission_kobo`, `hotel_share_kobo`, `policy_template_snapshot`, `policy_deadline_at`, `paystack_reference`, `expires_at`.

**holds** — `booking_id`, `room_id`, `nights`, `expires_at`. Redis first, PostgreSQL as the durable record.

**blocks** — `hotel_id`, `room_id`, `dates`, `reason`, `created_by`.

**refunds** — `booking_id`, `amount_kobo`, `commission_reversed_kobo`, `paystack_refund_id`, `status`, `initiated_by`, `recovery_status`, `recovered_kobo`, `fee_lost_kobo`. `recovery_status` is **open** when the hotel was already paid out and we must collect its share.

**audit_logs** — `actor`, `action`, `entity`, `entity_id`, `before`, `after`, `at`.

**Snapshots matter:** store the cancellation template and price on the booking. A hotel changing its policy later must not rewrite past bookings.

---

## 4. Availability

```
available(room, dates) =
    total_inventory
  − confirmed bookings overlapping dates
  − unexpired holds overlapping dates
  − hotel blocks overlapping dates
```

Never store an "available" boolean. Re-check inside a **single database transaction with row locking** at the moment payment is confirmed, so two guests cannot take the last room. Holds expire after 10 minutes via a scheduled job.

Front-desk blocks are a dashboard action for the hotel, with an audit line. JosStay does not change hotel rules; it gives the hotel a faster way to keep its own calendar honest.

---

## 5. Booking state machine

```
DRAFT → HELD → PAYMENT_PENDING → CONFIRMED → COMPLETED
                    │                 │
                    ├→ EXPIRED        ├→ CANCELLED → REFUND_PENDING → REFUNDED
                    └→ FAILED         └→ NO_SHOW
```

Transitions are server-side only. A browser redirect is **never** proof of payment.

---

## 6. Paystack integration (10% commission)

**Setup**
1. Register each approved hotel as a Paystack **subaccount** with a bank account in the hotel's business name.
2. Main account = JosStay. `percentage_charge: 10` (10%).
3. `bearer: "subaccount"` — the hotel carries the Paystack transaction fee, so the 10% stays clean.
4. Hosted checkout only. Card details never touch our servers. Card, bank transfer and USSD enabled.
5. Verify each subaccount in the Paystack dashboard **before publishing the hotel**. Payouts follow T+1/T+2; unverified or newly updated subaccounts may be delayed. Subaccounts cannot be manually held or released — only main accounts support that where enabled.

**Flow**
1. `POST /bookings` creates a hold and a DRAFT booking.
2. `POST /payments/initialize` returns a Paystack checkout URL.
3. Guest pays on Paystack.
4. Paystack calls `POST /webhooks/paystack` with a signature; verify the hash, then check idempotency on `paystack_reference`.
5. Inside one transaction: re-check availability, mark CONFIRMED, store `total_kobo`, `commission_kobo`, `hotel_share_kobo`.
6. Send the guest confirmation: email with address, map pin and **hotel phone number**; WhatsApp with address and map pin only — **never the phone**. The receipt page also omits the phone.
7. Email the hotel a confirmation with booking details only — reference, guest name, dates, room, guest count and total — using its internal `contact_email`. No guest phone or email is included; the hotel escalates via JosStay.

**Refunds — confirmed with Paystack, 17 Nov 2026 (see `11-PAYSTACK-SPLIT-REFUND-CONFIRMATION.md`)**
- Follow the hotel's chosen template snapshot; store the refund amount and reason.
- Call Paystack Refund API. While funds remain in Paystack balances or subaccounts, Paystack automatically reverses each party's share; record `commission_reversed_kobo`.
- If the hotel's share has already been transferred to its bank, Paystack cannot reverse it. JosStay's **main account** funds the guest refund and a **recovery task** is raised to collect the hotel's portion contractually. Paystack does not do this for us.
- Paystack processing and transaction fees are **non-refundable**. **Decision: JosStay absorbs them** on refunded bookings and records the amount as `fee_lost_kobo`. Do not promise the guest a fee refund.
- Guest-facing status is **"refund initiated"** until Paystack confirms. Paystack emails both JosStay and the guest; tell guests banks usually show the amount in **3–10 business days**.
- Test full and partial refunds in test mode before launch, including the recovery-task path.

**Reconciliation** — daily job comparing Paystack settlements to `bookings`, flagging open and aged refund-recovery tasks, and producing a payout report per hotel.

---

## 7. Verification workflow

Agent app / admin console:
1. Admin assigns a hotel to an agent reference (never a public name).
2. Agent completes the checklist: registration seen, physical visit, photos matched, pin confirmed, power tested, water/security/parking noted, report written.
3. Status set to `Pass`, `Pass with notes` or `Fail`. Only the first two publish.
4. Public page shows only `inspectedAt` + `status` + the check labels. The full report and agent identity stay internal.
5. Re-inspection due every 12 months or on a material complaint; badge expires if overdue.

---

## 8. API surface (representative)

```
GET    /api/hotels?area=&dates=&guests=&power=&policy=
GET    /api/hotels/:slug
GET    /api/areas
GET    /api/availability/:roomId?from=&to=
POST   /api/bookings                      → hold + draft
POST   /api/bookings/:id/pay              → Paystack URL
POST   /api/webhooks/paystack             → verify + confirm
POST   /api/bookings/:id/cancel
POST   /api/ai/search                     → natural language → validated filters
POST   /api/ai/ask                        → grounded policy/booking Q&A
POST   /api/chat-handoff                  → WhatsApp book-by-chat
GET    /api/admin/verifications
POST   /api/admin/hotels/:id/publish
```

The four `GET` routes, `POST /api/bookings`, `POST /api/payments/initialize` and `POST /api/webhooks/paystack` are live; the refund, messaging, AI and admin routes remain the build target. Bookings lock the room row and re-check availability inside one transaction. The webhook verifies the raw-body HMAC-SHA512 signature, rejects replays by `paystack_reference`, and confirms through that same lock. All inputs validated with **Zod**. All list queries parameterised — LLM output is never interpolated into SQL.

---

## 9. Security

- Helmet, strict CORS to josstay.ng origins, rate limiting per IP and per phone.
- Passwords hashed with bcrypt/argon2; admin and hotel roles checked on every route.
- Webhook signature verification, idempotency keys, constant-time comparison.
- Secrets in environment variables, never in the repo. Rotate Paystack and WhatsApp keys.
- PII minimisation: the hotel phone is emailed only to the guest who made the confirmed booking; it never appears in public responses, the receipt page or WhatsApp. The hotel's internal contact email is never returned publicly, and hotel confirmation emails contain no guest phone or email.
- Audit log for every money, status and verification change.
- Annual dependency audit and a pre-launch penetration test.

---

## 10. Jobs and observability

- Every 1 min: expire stale holds.
- Nightly: send "complete your booking" WhatsApp for abandoned checkouts (opt-in only), reconciliation, badge-expiry check.
- Structured logs with booking reference; alerts on webhook failure, split mismatch and hold-lock contention.
- Uptime and Core Web Vitals monitoring; target 90+ performance score.

---

## 11. Environments

| Env | Purpose | Data |
|---|---|---|
| `local` | Development | Seeded demo hotels, Paystack test keys |
| `staging` | Full rehearsal | Demo hotels, test keys, real integration wiring |
| `production` | Live | Real hotels, live keys, all demo labels removed |

Never point staging at production Paystack or WhatsApp.
