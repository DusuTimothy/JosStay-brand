# JosStay — Living Build Log

**Rule:** append after every build. Never overwrite earlier entries. This file is the pickup point — see `13-PUBLIC-BUILD-PLAN.md` §5.

---

## Status board

| Day | Date | Stage | Status | Post |
|---|---|---|---|---|
| 1 | 17 Nov | 0 — Docs locked | **Done** | #0 |
| 2 | 18 Nov | 1 — Foundation | **Done** | #1 |
| 3 | 19 Nov | 2 — Demo data | Pending | — |
| 4 | 20 Nov | 3 — Truth on pages | Pending | — |
| 5 | 21 Nov | 4 — Backend schema | Pending | — |
| 6 | 22 Nov | 5 — Read API | Pending | — |
| 7 | 23 Nov | 6 — Booking core | Pending | — |
| 8 | 24 Nov | 7 — Paystack split | Pending | — |
| 9 | 25 Nov | 8 — Guest flow | Pending | — |
| 10 | 26 Nov | 9 — Money edge cases | Pending | — |
| 11 | 27 Nov | 10 — AI for ease | Pending | — |
| 12 | 28 Nov | 11 — Admin & verification | Pending | — |
| 13 | 29 Nov | 12 — Rehearsal | Pending | — |
| 14 | 30 Nov | 13 — Handover | Pending | — |

---

## Day 1 — Tuesday 17 November 2026 · Stage 0: Docs locked

**Status:** Done

**What we did**
- Wrote the full product/backend/AI/legal/production/logo documentation set.
- Added the hotel onboarding question packs: legal, non-legal, money, policy.
- Recorded Paystack's written answer on split refunds and locked the resulting decisions.
- Locked all product decisions: 10% commission, the three cancellation templates, private phone rule, refund wording and recovery terms.
- Documented every environment key and how to obtain its value.
- Created the public build plan and this log.

**Files touched (documentation only)**
`docs/01-PRODUCT-PLAN.md`, `02-BACKEND-ARCHITECTURE.md`, `03-AI-FOR-EASE.md`, `04-LEGAL-AND-POLICIES.md`, `05-PRODUCTION-CHECKLIST.md`, `06-LOGO-BRIEF.md`, `logo-concept.svg`, `07-LEGAL-QUESTIONS-FOR-HOTELS.md`, `08-NON-LEGAL-QUESTIONS-FOR-HOTELS.md`, `09-MONEY-QUESTIONS-FOR-HOTELS.md`, `10-POLICY-QUESTIONS-FOR-HOTELS.md`, `11-PAYSTACK-SPLIT-REFUND-CONFIRMATION.md`, `12-ENVIRONMENT-KEYS.md`, `13-PUBLIC-BUILD-PLAN.md`, `14-BUILD-LOG.md`.

**Verification**
- No stale "proposed" or "needs sign-off" language remains in the decision docs.
- `logo-concept.svg` parses as valid XML.
- `app/`, `components/` and `lib/` have zero files modified.

**Social post #0**
```text
[Day 1 / building JosStay in public until 30 Nov]

We shipped the blueprint before the buttons.

What we did:
• Wrote the product, backend, AI, legal and production docs.
• Wrote the exact questions to ask a hotel: legal, operations, money, policy.
• Locked the rules: 10% commission from the hotel, 3 cancellation templates, hotel phone private until a booking is confirmed.
• Settled the Paystack refund answer: automatic split reversal while funds are with Paystack; if the hotel is already paid, JosStay fronts the refund and recovers from the hotel under a signed 7-day clause.
• Wrote the 14-day build schedule and a living log so anyone can pick up where we stop.

Why it matters:
Trust is the product. We decided what every badge, price and promise means before writing a line of app code.

Still real / still demo:
No hotel is live. No ratings, no invented "verified" claims. The logo is a hand-built concept vector. This is documentation, not a launched marketplace.

Tomorrow:
Repo foundation — Zod schemas, shared types, API skeleton and the health check.
```

**Next pickup:** Day 2, Stage 1 — read `AGENTS.md` and the Next.js 16 docs, add Zod, scaffold `josstay-api`, create `.env.example` and shared types/schemas.

---

## Day 2 — Wednesday 18 November 2026 · Stage 1: Foundation

**Status:** Done

**What we did**
- Read the Next.js 16 guidance in `node_modules/next/dist/docs/` for environment variables and `loading.tsx`, as required by `AGENTS.md`.
- Added Zod 4.6.7 and a `@josstay/shared` file dependency to the frontend.
- Created a shared package with validated schemas for email, policy template, verification status, hotel, public hotel, guest checkout, booking status, booking and area. Added `toPublicHotel()` so private hotel phone data is stripped before any guest-facing response.
- Scaffolded the Express 5 API **inside this repo** at `api/` with ESM/NodeNext TypeScript, validated environment config, CORS, JSON parsing and `GET /health`.
- Added a start guard that refuses to run when a Paystack key prefix disagrees with `PAYSTACK_ENV`.
- Added empty `.env.example` files at the frontend root and in `api/`. No real secrets were created.
- Updated the build plan and env guide so the API path is `api/` (not a sibling repo), and recorded the agreed loading pattern.

**Files touched**
`package.json`, `package-lock.json`, `.env.example`, `packages/shared/package.json`, `packages/shared/tsconfig.json`, `packages/shared/src/index.ts`, `api/package.json`, `api/package-lock.json`, `api/tsconfig.json`, `api/.env.example`, `api/src/env.ts`, `api/src/index.ts`, `api/src/server.ts`, `docs/12-ENVIRONMENT-KEYS.md`, `docs/13-PUBLIC-BUILD-PLAN.md`, `docs/14-BUILD-LOG.md`.

**Verification**
- `npm run build:shared` → clean; emits `dist/index.js` and `dist/index.d.ts`.
- `npm run typecheck` (frontend) → clean.
- `cd api && npm install && npm run typecheck && npm run build` → clean.
- Started the built API and called `GET /health` → HTTP 200 with `{"status":"ok","service":"josstay-api",...}`; all `integrations` flags were `false` because no keys are configured.
- Schema check: `HotelSchema` has `phoneEncrypted`, `PublicHotelSchema` does not, and `toPublicHotel()` output has no `phoneEncrypted`.
- Guard check: `sk_live_...` with `PAYSTACK_ENV=test` was rejected with the expected message.
- No `.env` files, no secrets and no AI-authorship remarks in any added file.

**Social post #1**
```text
[Day 2 / building JosStay in public until 30 Nov]

The foundation is in place.

What we shipped today:
• Shared Zod schemas so the site and the API agree on what a hotel, a guest and a booking actually are.
• A hard rule in code: public hotel data structurally excludes the phone number. There is no lazy endpoint that can accidentally send it.
• An Express API in the same repo with a working /health check and config validation that refuses a test/live Paystack key mismatch.
• Empty .env.example files. No real keys, no secrets committed.

Why it matters:
Most marketplace trust problems start as data-shape problems. If the phone number is not in the public shape, it cannot leak through a careless response.

Still real / still demo:
This is plumbing. No hotel is live, no booking can be made yet, and no payment keys are connected. The health check only proves the service boots.

Tomorrow:
Move the demo listing data into the new hotel shape — areas, policy templates and honest verification fields, still clearly labelled demo.
```

**Next pickup:** Day 3, Stage 2 — remodel `lib/data.ts` into the shared `Hotel` shape, 3–5 clearly labelled demo hotels, areas derived from hotel data, verification and policy fields. Keep every component and the design system unchanged; home and search must still render.
