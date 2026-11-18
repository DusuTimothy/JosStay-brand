# JosStay — Living Build Log

**Rule:** append after every build. Never overwrite earlier entries. This file is the pickup point — see `13-PUBLIC-BUILD-PLAN.md` §5.

---

## Status board

| Day | Date | Stage | Status | Post |
|---|---|---|---|---|
| 1 | 17 Nov | 0 — Docs locked | **Done** | #0 |
| 2 | 18 Nov | 1 — Foundation | **Done** | #1 |
| 2b | 18 Nov | 1b — Monorepo layout | **Done** | #2 |
| 3 | 19 Nov | 2 — Demo data | **Done** | #3 |
| 4 | 20 Nov | 3 — Truth on pages | **Done** | #4 |
| 5 | 21 Nov | 4 — Backend schema | **Done** | #5 |
| 5b | 21 Nov | 4b — ORM correction | **Done** | #5b |
| 6 | 22 Nov | 5 — Read API | **Done** | #6 |
| 7 | 23 Nov | 6 — Booking core | **Done** | #7 |
| 8 | 24 Nov | 7 — Paystack split | **Done** | #8 |
| 9 | 25 Nov | 8 — Guest flow | **Done** | #9 |
| 9b | 18 Nov | 8b — Partner dashboard (sample data) | **Done** | #10 |
| 10 | 26 Nov | 9 — Money edge cases | **Done** | #11 |
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

**Next pickup (superseded by the addendum below):** Day 3, Stage 2 — remodel `client/lib/data.ts` into the shared `Hotel` shape.

---

## Day 2 (addendum) — Wednesday 18 November 2026 · Stage 1b: Monorepo layout

**Status:** Done

**What we did**
- Restructured the repository into npm workspaces with the client and server as top-level siblings, as requested: `client/` (`@josstay/client`), `server/` (`@josstay/server`) and `packages/shared/` (`@josstay/shared`).
- Moved the entire Next.js app, its configs and its generated agent guidance into `client/` without changing any component, page, style or image.
- Moved the Express service into `server/`. Both apps now depend on `@josstay/shared` through the workspace link.
- Replaced the two separate installs and lockfiles with one root `npm install` and one root `package-lock.json`. Added root scripts that delegate to each workspace.
- Updated `README.md`, `docs/01`, `docs/06`, `docs/12` and `docs/13` so every path and command points at the new layout. `client/AGENTS.md` is now the Next.js guidance file.

**Files touched**
Moved: `app/`, `components/`, `lib/`, `public/`, `next.config.mjs`, `postcss.config.mjs`, `tsconfig.json`, `AGENTS.md` and `.env.example` → `client/`; `api/*` → `server/`.
Changed: `package.json`, `package-lock.json`, `client/package.json`, `server/package.json`, `README.md`, `docs/01-PRODUCT-PLAN.md`, `docs/06-LOGO-BRIEF.md`, `docs/12-ENVIRONMENT-KEYS.md`, `docs/13-PUBLIC-BUILD-PLAN.md`, `docs/14-BUILD-LOG.md`.

**Verification**
- `npm install` at the root → three workspaces linked, one lockfile; `npm ls --workspaces --depth=0` shows all three.
- `npm run typecheck` → clean in all three workspaces.
- `npm run build` → shared build clean; Next.js production build compiled all 27 pages; server TypeScript build clean.
- `npm run dev` → client home page returned HTTP 200 at `http://localhost:4300`.
- `npm run start:server` → `GET /health` returned HTTP 200 with the same payload as before the move.
- No UI or design-system files were edited; only their paths changed.

**Social post #2**
```text
[Day 2 / building JosStay in public until 30 Nov]

One small restructure, one big simplification.

What we shipped today:
• The repo is now a proper monorepo: client/ for the Next.js site, server/ for the Express API, packages/shared for the rules both sides use.
• One npm install, one lockfile, one set of root commands instead of separate projects drifting apart.
• The site and API still build, the home page still loads, and /health still answers 200.

Why it matters:
A marketplace has two halves that must agree on the same data. Keeping them in one workspace makes "the public hotel shape has no phone number" a rule enforced for both sides, not a convention somebody has to remember.

Still real / still demo:
No hotel is live. No booking or payment is connected. We changed where the code lives, not what the product does.

Tomorrow:
Demo hotel data in the shared shape, with areas and honest verification fields.
```

**Next pickup (superseded by the Day 3 entry below):** Day 3, Stage 2 — remodel `client/lib/data.ts` into the shared `Hotel` shape.

---

## Day 3 — Thursday 19 November 2026 · Stage 2: Demo data

**Status:** Done

**What we did**
- Rebuilt `client/lib/data.ts` around the shared `Hotel` schema from `@josstay/shared`. The four demo hotels are parsed with `HotelSchema.parse()` at module load, so a malformed record fails the build instead of leaking onto a page.
- Added four clearly labelled demo hotels — The Rayfield Garden Apartment, Lamingo Skyline Suite, Little Rayfield Courtyard and Bukuru Hillside Hotel — each with the agreed price, a policy template and a `demo: true` flag. Prices are held in kobo in the canonical record and converted once for the existing UI.
- Derived `AREAS` from the hotel records instead of hand-writing a list. Counts come from the data, so no area claims inventory that does not exist. The 24/7 Power chip is a feature filter over the same records, not a place.
- Added a policy view (Flexible, Moderate, Strict) and an honest verification view. Every demo hotel has `verificationStatus` unset, so the UI reads "Not inspected — demo" and claims no badge, no inspection date and no agent report.
- Kept the public shape clean: `PUBLIC_HOTELS` runs through `toPublicHotel()`, and `Stay` extends `PublicHotel`. A runtime check confirmed neither `PUBLIC_HOTELS` nor `STAYS` carries a `phone` or `phoneEncrypted` key.
- Removed invented trust signals from the rendered pages: star ratings, review counts and category scores, "JosStay Verified" and "Passed inspection" badges, a fixed "inspected 9 November 2026" date, the guest-facing service-fee line, and the "we re-house you or refund you" promise. These were demo placeholders that read as real claims.
- Updated page copy and metadata to say this is a demo preview with sample photos, no connected payments and no inspection. Cancellation now displays the hotel's actual template. The "Book by chat with JosStay" fallback remains in the booking widget.
- Component structure and the design system are unchanged; only the fields and copy that carried false claims were edited.

**Files touched**
`client/lib/data.ts`, `client/app/page.tsx`, `client/app/layout.tsx`, `client/app/stays/[slug]/page.tsx`, `client/app/jos/[area]/page.tsx`, `client/components/home/stay-card.tsx`, `client/components/stay/availability.tsx`, `client/components/stay/booking-widget.tsx` and this file.

**Verification**
- `npm run typecheck` → clean in all three workspaces.
- `npm run build` → shared build clean; Next.js production build compiled all 27 pages; server build clean.
- Data check via `tsx`: 4 stays, all `demo: true`; no `phone`/`phoneEncrypted` key in public or view data; no `rating`/`reviews`/`badge`/`serviceFeeRate` fields; areas derived as Rayfield 1, Lamingo 1, Little Rayfield 1, Bukuru 1, 24/7 Power 4; all three policy templates present; kobo-to-naira conversion consistent.
- Served the production build: home and all four stay pages returned HTTP 200. Rendered HTML contained "Demo listing" and "Not inspected — demo" and none of the forbidden strings (verified badge, fake ratings, service fee, old inspection date, re-house promise, passed-inspection pill).
- Confirmed all three policy summaries render as visible text in the built HTML (Flexible, Moderate and Strict).
- No `.env` files, secrets, AI-authorship remarks or build output staged.

**Social post #3**
```text
[Day 3 / building JosStay in public until 30 Nov]

The demo data now obeys the same rules as the real thing.

What we shipped today:
• Demo listings moved into the shared Hotel schema, validated at build time — a bad record fails the build instead of reaching a page.
• Four clearly labelled demo hotels with real prices, cancellation templates and honest verification fields.
• Areas are derived from the hotels themselves. No neighbourhood claims inventory that isn't there.
• Removed the fake ratings, review counts and "verified" badges that came with the starter UI. Nothing in the demo now claims an inspection that never happened.
• Public data still has no phone number field — checked at runtime, not just by convention.

Why it matters:
A trust marketplace cannot ship with borrowed trust signals. If the demo says "verified" when nobody inspected the property, the badge means nothing on day one. We took the shortcuts out before they became habits.

Still real / still demo:
Four invented hotels, illustrative photos, sample availability and no connected payment. No hotel is live and no booking can be made.

Tomorrow:
Truth on pages — new home copy, a real verification panel, policy and deadline display, and a UI box for the AI booking question.
```

**Next pickup (superseded by the Day 4 entry below):** Day 4, Stage 3 — truth on pages. Rework home copy, trust strip and search box, add a verification panel with dated agent-report fields, show cancellation policy and booking deadline, add demo pills and the AI question box UI. Do not claim verification, rating or availability that no record supports; confirm again that no phone appears in public data.

---

## Day 4 — Friday 20 November 2026 · Stage 3: Truth on pages

**Status:** Done

**What we did**
- Added five small, reusable pieces instead of redesigning the UI: a `DemoPill`, a `VerificationPanel`, a `PolicyNote`, an `AskJosStay` preview box and a pure `cancellationView()` helper. They carry the honest states the data actually supports.
- The verification panel renders the dated agent-report fields — last inspected, report result, photos, power, security, cancellation template. Every demo hotel has no report and no date, so the panel reads "Not on file" and "None — no report exists". It never shows a pass badge.
- Cancellation now shows the hotel's template plus a deadline. With dates selected, Flexible resolves to 24 hours before check-in and Moderate to 72 hours before check-in; Strict explicitly says there is no fixed calendar date until a booking exists. No deadline is invented.
- Rebuilt the search pill as a working demo search: area comes from the derived `AREAS`, and dates and guest count are real inputs. Submitting navigates to `/search` with those filters in the URL; the server validates every value and `StayExplorer` applies them, including sample date blocks. The condensed pill now shows the guest's actual query, not a hardcoded example.
- Replaced the invented home area list with `AREAS` from the hotel data. Bodija and its made-up count of 9 are gone; the 24/7 Power count of 31 is gone. Home now says plainly that no hotel is live.
- Added the AI question box as a disclosed UI preview: a disabled input, "Not connected yet" label, a note that no answer is generated today, and an always-visible "Book by chat with JosStay" fallback. Search and checkout do not depend on it.
- Removed the remaining borrowed claims across the public pages: the re-house-or-refund guarantee on Promise, About, Help and the cancellation policy; the 42-point and "tested on inspection" copy; "verified stays" headings and buttons; and "shot by JosStay on inspection day". The partner page now states the locked model — 10% commission paid by the hotel, hotel pays the Paystack fee, no guest service fee — instead of the old 30% and guest fee.
- Kept the layout, tokens and component structure intact. These were field and copy changes, not a visual redesign.

**Files touched**
New: `client/components/ui/demo-pill.tsx`, `client/components/stay/verification-panel.tsx`, `client/components/stay/policy-note.tsx`, `client/components/home/ask-josstay.tsx`, `client/lib/policy.ts`.
Changed: `client/app/page.tsx`, `client/app/search/page.tsx`, `client/app/stays/[slug]/page.tsx`, `client/app/jos/page.tsx`, `client/app/jos/[area]/page.tsx`, `client/app/about/page.tsx`, `client/app/promise/page.tsx`, `client/app/help/page.tsx`, `client/app/legal/[slug]/page.tsx`, `client/app/list-your-property/page.tsx`, `client/app/not-found.tsx`, `client/app/styleguide/page.tsx`, `client/components/home/search-pill.tsx`, `client/components/home/stay-explorer.tsx`, `client/components/layout/site-footer.tsx`, `client/components/stay/bento-gallery.tsx`, `client/components/stay/booking-widget.tsx`, `client/components/stay/photo-tour.tsx`, `client/lib/data.ts` and this file.

**Verification**
- `npm run typecheck` → clean in all three workspaces; `npm run build` → clean. `/search` is now server-rendered on demand because it reads the query string; all other pages prerender as before.
- Served the production build and checked HTTP 200 on home, `/search`, two stay pages, `/jos`, `/jos/rayfield`, `/promise`, `/about`, `/help`, `/legal/cancellation` and `/list-your-property`.
- Rendered-page scan for borrowed claims (verified badge, fake ratings, service fee, old inspection date, re-house promise, passed inspection, 42-point, 30% split, guest service fee, "Tested with the mains off") → none.
- Confirmed "Ask JosStay", "Not connected yet", "Book by chat with JosStay", "Verification record", "Deadline:", "Demo stays to explore" and "No hotel is live" appear in the built HTML.
- Filter check: unfiltered search rendered 4 of 4 demo stays; `?area=Rayfield&guests=4` rendered 1 of 4 and only the Rayfield card; `?area=Lamingo&guests=3&from=2026-11-25&to=2026-11-27` correctly rendered 0 with the honest empty state.
- Deadline helper check: Flexible → 24 hours before check-in (Tue, 24 Nov for a 25 Nov check-in); Moderate → 72 hours (Sun, 22 Nov); Strict → no fixed calendar date until a booking exists.
- Public-data check repeated: no `phone` or `phoneEncrypted` key in `PUBLIC_HOTELS` or view data; every demo `verification.inspectedAt` is null.
- No `.env` files, secrets, AI-authorship remarks or build output staged.

**Social post #4**
```text
[Day 4 / building JosStay in public until 30 Nov]

The pages now say what is actually true.

What we shipped today:
• A verification panel with the dated agent-report fields. For demo listings every field reads "Not on file" — because no one inspected them.
• Cancellation shown as the hotel's real template, with a deadline that only becomes a date once dates are chosen. Strict says there is no fixed date until a booking exists.
• The search box now works: area, dates and guest count go into the URL and filter the demo stays. No more hardcoded "Rayfield · 14–17 Nov" pretending to be a query.
• The Ask JosStay box is in place — clearly labelled as a preview, with no generated answers and a working "Book by chat" fallback beside it.
• Removed the last borrowed claims: the re-house-or-refund promise, 42-point checklist, "verified stays" headings and the old 30% / guest-fee commercial model.

Why it matters:
Trust is a page-level property. A correct schema means nothing if the page above it still says "verified" when nobody inspected the place. Every claim now either points at a field or says plainly that the field is empty.

Still real / still demo:
Four invented hotels, illustrative photos and sample availability. The AI box does not answer anything yet. No payment, no booking, no hotel live.

Tomorrow:
Backend schema — the PostgreSQL tables, migrations and refund-recovery fields the rest of the build will sit on.
```

**Next pickup (superseded by the Day 5 entry below):** Day 5, Stage 4 — backend schema. Create the PostgreSQL tables and migrations from `docs/02-BACKEND-ARCHITECTURE.md` §3, add the Redis client and the refund recovery fields, and run migrations locally. Keep the public API shape free of phone data; next stage builds the read endpoints on top.

---

## Day 5 — Saturday 21 November 2026 · Stage 4: Backend schema

**Status:** Done

**What we did**
- Added `server/migrations/0001_initial.sql`, covering all nine tables in `02-BACKEND-ARCHITECTURE.md` §3: `areas`, `hotels`, `rooms`, `verifications`, `bookings`, `holds`, `blocks`, `refunds` and `audit_logs`. Areas come first because hotel rows point at them.
- Built the table with the decisions already locked: `commission_bps` defaults to 1000 (10%); `paystack_subaccount_code` and `subaccount_verified_at` support the verified-before-publish gate; `phone_encrypted` is marked internal-only in a column comment; bookings snapshot both `policy_template_snapshot` and `policy_deadline_at`.
- Added every refund recovery field from `11-PAYSTACK-SPLIT-REFUND-CONFIRMATION.md`: `recovery_status`, `recovery_due_at`, `recovery_notified_at`, `recovered_kobo` and `fee_lost_kobo`, plus `hotel_share_kobo` so a partial refund can describe the portion owed by the hotel. `open` means the hotel share was already paid out and must be collected contractually.
- Added a checksummed migration runner. It prefers `DIRECT_URL` over the pooled `DATABASE_URL`, takes an advisory lock, records applied files in `schema_migrations`, skips files already applied, and refuses to run if an applied file's checksum changed. A new change needs a new migration, not a silent rewrite.
- Added a lazy PostgreSQL pool with a transaction helper, and a lazy Redis client that can be absent at boot but fails clearly when a caller uses it without `REDIS_URL`. Holds remain Redis-first with PostgreSQL as the durable mirror.
- Aligned the shared booking status vocabulary with the documented state machine: `draft`, `held`, `payment_pending`, `confirmed`, `completed`, `expired`, `failed`, `cancelled`, `refund_pending`, `refunded`, `no_show`. Added shared refund and recovery status schemas for later admin and reconciliation work.
- Added root commands `npm run migrate`, `npm run verify:db` and `npm run verify:cache`. The schema verifier checks required columns, enum values and the migration count so "tables match the doc" is a repeatable check.
- Updated the status lines in `02-BACKEND-ARCHITECTURE.md` and `03-AI-FOR-EASE.md`, which still claimed no code had changed, and documented the local migration commands in `12-ENVIRONMENT-KEYS.md`.

**Files touched**
New: `server/migrations/0001_initial.sql`, `server/src/db/client.ts`, `server/src/db/migrate.ts`, `server/src/db/verify-schema.ts`, `server/src/cache/redis.ts`, `server/src/cache/verify.ts`.
Changed: `package.json`, `package-lock.json`, `server/package.json`, `server/src/env.ts`, `packages/shared/src/index.ts`, `docs/02-BACKEND-ARCHITECTURE.md`, `docs/03-AI-FOR-EASE.md`, `docs/12-ENVIRONMENT-KEYS.md` and this file.

**Verification**
- `npm run typecheck` → clean in all three workspaces; `npm run build` → clean.
- Ran throwaway local containers from the already-present `postgres:15` and `redis:latest` images. No credentials were written to the repo; no `.env` file was created.
- First `npm run migrate` → `applied 0001_initial.sql`. Second run → `skipped 0001_initial.sql (already applied)`. Deliberate checksum drift against the applied filename → rejected with a clear instruction to create a new migration.
- `npm run verify:db` → all nine tables have the required columns; all five enum types have the required values; `schema_migrations` recorded one applied file.
- `npm run verify:cache` → Redis set/get/delete round-trip succeeded.
- Constraint smoke test in a rolled-back transaction: inserted a demo area, hotel, room, confirmed booking and an open refund with `fee_lost_kobo`; verified the 10/90 split and 7-day recovery due date. A deliberately wrong split was rejected by `bookings_split_adds_up`.
- API still boots without database or cache configured: `GET /health` returned 200 with `database: false`, `redis: false`, `paystack: false`. Env parsing confirmed literal `false` strings become false for the boolean flags.
- No secrets, `.env` files, build output or AI-authorship remarks staged.

**Social post #5**
```text
[Day 5 / building JosStay in public until 30 Nov]

The database now has a shape, and the shape carries the decisions.

What we shipped today:
• PostgreSQL tables for hotels, rooms, areas, agent reports, bookings, holds, blocks, refunds and audit logs.
• Migration tooling that records what ran, skips it next time, and refuses an edited migration that a database has already applied.
• The refund recovery fields: open or recovered status, the amount collected, a 7-day due date, and the non-refundable Paystack fee JosStay absorbs.
• Bookings snapshot the cancellation rule and its deadline, so a hotel changing its policy later cannot rewrite an old booking.
• A lazy Redis client for short-lived holds, with PostgreSQL as the durable record.
• Repeatable checks: `npm run migrate`, `npm run verify:db`, `npm run verify:cache`.

Why it matters:
A promise is only as strong as the field behind it. "Verified" needs an inspection date. "10% commission" needs a stored basis. "We recover the hotel's share" needs a queue and an amount. Those fields now exist before any endpoint or payment is wired.

Still real / still demo:
The tables ran locally and the constraints were tested. No hotel is onboarded. No real phone number, real photo, live key or guest booking exists. The site still shows four invented stays.

Tomorrow:
Read API — GET endpoints for hotels, a single hotel, areas and availability, with Zod-validated query parameters and no phone field in any public response.
```

**Next pickup (superseded by the Day 5b entry below):** Day 6, Stage 5 — read API. Build `GET /api/hotels`, `GET /api/hotels/:slug`, `GET /api/areas` and `GET /api/availability/:roomId` with Zod-validated query params. Use an explicit public column list so `phone_encrypted` can never leak; map rows to the shared `PublicHotel` shape.

---

## Day 5b — Saturday 21 November 2026 · Stage 4b: Sequelize ORM and CLI

**Status:** Done

**What we did**
- Replaced the Day 5 raw-SQL migration and custom checksum runner with Sequelize v6 and Sequelize CLI v6. The pushed Day 5 commit stays in history; this is an appended correction, not a rewrite.
- Added Sequelize models for all nine tables — `areas`, `hotels`, `rooms`, `verifications`, `bookings`, `holds`, `blocks`, `refunds`, `audit_logs` — with camelCase attributes mapped to the existing snake_case columns and associations for the hotel → room/booking/verification/block paths.
- Added `server/.sequelizerc`, `server/config/config.cjs` and `server/migrations/20261121000000-initial-schema.cjs`. The CLI config prefers `DIRECT_URL`, records applied migrations in `schema_migrations` with timestamps, and provides both `up` and `down`.
- Kept the same schema: five enum value sets, check constraints, partial indexes, comments and the `updated_at` trigger. A future schema change needs a new migration file; the CLI tracks filenames rather than checksums.
- Added an explicit public hotel allow-list in `server/src/db/public-fields.ts`. `PUBLIC_HOTEL_ATTRIBUTES` is the Sequelize attribute form; `INTERNAL_HOTEL_COLUMNS` names phone, payout and commission fields that public reads must never select.
- Reworked `server/src/db/client.ts` into a lazy Sequelize client with `getModels`, `query`, `withTransaction` and `closePool`. The API still boots without a database configured and fails clearly only when a data route is used.
- Added `verify:models`. It writes a demo area, hotel, room, booking and refund inside a transaction, checks the public allow-list, confirms the internal phone value is still readable, rejects a bad 10/90 split through `bookings_split_adds_up`, then rolls everything back.
- Added root commands `migrate:undo`, `migrate:status` and `verify:models` alongside the existing `migrate`, `verify:db` and `verify:cache`.

**Files touched**
New: `server/.sequelizerc`, `server/config/config.cjs`, `server/migrations/20261121000000-initial-schema.cjs`, `server/src/db/models.ts`, `server/src/db/public-fields.ts`, `server/src/db/verify-models.ts`.
Changed: `package.json`, `package-lock.json`, `server/package.json`, `server/src/db/client.ts`, `server/src/db/verify-schema.ts`, `docs/12-ENVIRONMENT-KEYS.md` and this file.
Removed: `server/migrations/0001_initial.sql`, `server/src/db/migrate.ts`.

**Verification**
- `npm run typecheck` → clean in all three workspaces; `npm run build` → clean.
- Fresh throwaway PostgreSQL on port 55433 and Redis on port 6380 from the already-present `postgres:15` and `redis:latest` images. No credentials were written to the repo; no `.env` file was created.
- `npm run migrate` → applied `20261121000000-initial-schema.cjs`; `npm run migrate:status` → `up`; second `npm run migrate` → no migrations executed.
- `npm run migrate:undo` → reverted; status → `down`; `npm run migrate` → reapplied cleanly. This also caught and fixed a missing `audit_logs` table in the first `down` pass.
- `npm run verify:db` → all nine tables have the required columns; all five enum value sets match; `schema_migrations` recorded one applied migration.
- `npm run verify:models` → writes, internal phone read, public allow-list, bad-split constraint and rollback all passed.
- `npm run verify:cache` → Redis set/get/delete round-trip succeeded.
- API booted with database and Redis unset: `GET /health` returned 200 with `database: false`, `redis: false`, `paystack: false`.
- `npm audit` still reports seven moderate advisories in Sequelize CLI transitive dependencies. No non-major fix is identified; revisit before launch. No secrets, `.env` files or build output staged.

**Social post #5b**
```text
[Day 5b / building JosStay in public until 30 Nov]

A correction, in public: the database was built with raw SQL, but the intended stack is Sequelize.

We replaced it today. Day 5 stays in the history; Day 5b adds the fix.

What shipped:
• Sequelize v6 models for all nine tables, with camelCase fields mapped to the existing snake_case columns.
• Sequelize CLI migrations with up/down, applied-migration tracking in schema_migrations, and DIRECT_URL preferred over the pooled URL.
• The same schema constraints: 10% commission basis, cancellation snapshots, refund recovery fields, internal phone column and truthful verification fields.
• A public hotel allow-list. Phone, payout and commission fields are named as internal and excluded from public reads.
• A model check that writes demo data, proves no phone field leaks, rejects a bad commission split, then rolls back.
• migrate:status, migrate:undo and verify:models alongside the existing checks.

Why it matters:
The ORM is not decoration. It is the boundary that decides which fields can reach a guest response. Putting that boundary in code now makes the read API safer tomorrow.

Still real / still demo:
Migrations, rollback, constraints and Redis all ran locally. No hotel is onboarded. No real photo, real phone number, live key or guest booking exists. The listings remain invented and labelled demo.

Still open:
Seven moderate npm advisories from Sequelize CLI dependencies. No safe non-major fix yet; this gets reviewed before launch.

Tomorrow:
Read API — GET hotels, a single hotel, areas and availability, with Zod-validated query params and no phone field in any public response.
```

**Next pickup (superseded by the Day 6 entry below):** Day 6, Stage 5 — read API. Build `GET /api/hotels`, `GET /api/hotels/:slug`, `GET /api/areas` and `GET /api/availability/:roomId` with Zod-validated query params. Use `PUBLIC_HOTEL_ATTRIBUTES` on the Sequelize models so `phone_encrypted` can never leak; map results to the shared `PublicHotel` shape.

---

## Day 6 — Sunday 22 November 2026 · Stage 5: Public read API

**Status:** Done

**What we did**
- Mounted a read-only `/api` router with four routes: `GET /api/hotels`, `GET /api/hotels/:slug`, `GET /api/areas` and `GET /api/availability/:roomId`. Unknown `/api` paths return a JSON 404.
- Added shared Zod schemas for query strings and responses: calendar dates, `YYYY-MM-DD:YYYY-MM-DD` range syntax, lowercase slugs, room UUIDs, hotel filters, public rooms, area summaries and availability. Every query and path parameter is validated before it reaches a model or SQL string, and unknown query keys are rejected.
- Kept all reads on `status: "published"` hotels. Area, policy, guest count, date range and `power=24-7` filters intersect cleanly; a `24/7` badge only appears when the latest agent report has a passing status and `checks.power === true`.
- Used `PUBLIC_HOTEL_ATTRIBUTES` for every hotel read and mapped results through `PublicHotelSchema`. Phone, payout, commission, agent identity, checks and full report fields are not selected, so they cannot leak. Hotel detail adds only public room id, name, bed, sleeps and ensuite.
- Reused the documented availability formula from §4: half-open date ranges, confirmed/completed/no-show bookings consuming stock, unexpired holds counting until expiry, and front-desk blocks overlapping the range. The same SQL backs both the single-room endpoint and hotel date filtering.
- Added consistent errors: 400 with field-level details for invalid input, 404 for missing hotel or room, 503 when the database is not configured, and a generic 500 that does not echo internals.
- Added `npm run verify:api`. It writes throwaway area/hotel/room/verification/booking/hold/block rows, calls the real HTTP app, checks filters and private-field denial on every response, confirms available and sold-out date behaviour, then removes its rows.
- The verifier caught two mistakes before commit: a test that expected a sold-out hotel to appear in a date-filtered list, and a PostgreSQL rule that forbids a `WHERE` clause from using a select-list alias. Both were fixed in code and the verifier now passes.

**Files touched**
New: `server/src/api/errors.ts`, `server/src/api/availability.ts`, `server/src/api/availability-route.ts`, `server/src/api/catalog.ts`, `server/src/api/routes.ts`, `server/src/api/verify.ts`.
Changed: `package.json`, `server/package.json`, `packages/shared/src/index.ts`, `server/src/index.ts`, `docs/02-BACKEND-ARCHITECTURE.md` and this file.

**Verification**
- `npm run build:shared && npm run typecheck && npm run build` → clean in all three workspaces.
- Fresh throwaway PostgreSQL on port 55433 and Redis on port 6380 from the already-present `postgres:15` and `redis:latest` images. No credentials were written to the repo; no `.env` file was created.
- `npm run migrate` → applied `20261121000000-initial-schema.cjs`; `npm run migrate:status` → `up`; a second `npm run migrate` → no migrations executed.
- `npm run verify:db` → all nine tables, five enum sets and one applied migration. `npm run verify:models` → public allow-list, internal phone read, bad-split rejection and rollback. `npm run verify:cache` → Redis round-trip.
- `npm run verify:api` → filtered hotel list, sold-out exclusion, hotel detail rooms, area counts, availability counts, validation errors, 404s and no private keys or internal values in any public response.
- API booted with database, Redis and Paystack unset: `GET /health` returned 200 with all three integration flags false.
- No secrets, `.env` files, build output or attribution notes staged.

**Social post #6**
```text
[Day 6 / building JosStay in public until 30 Nov]

The guest API can now read the marketplace — and it cannot read the parts guests should never see.

What shipped:
• GET endpoints for hotel lists, one hotel, areas and room availability.
• Zod-checked query strings: dates, area, guests, power, policy and room IDs. Unknown keys and bad dates get a clean 400.
• Only published hotels appear. Every response uses an explicit public field allow-list.
• Phone numbers, payout codes, commission fields, agent identity and full inspection reports are not selected at all — not hidden in the UI, absent from the response.
• The 24/7 power badge is backed by the latest passing agent report. A claim without evidence does not publish as a badge.
• Availability uses the documented formula: confirmed bookings, live holds and front-desk blocks all reduce stock.
• A repeatable check writes throwaway data, calls the real HTTP routes, scans every response for private fields, then cleans up.

Why it matters:
A trust marketplace is mostly a boundary problem. Today that boundary is code, not a promise in a design file.

Still real / still demo:
The API ran against local throwaway services. No hotel is onboarded. No real phone number, photo, live key or guest booking exists. The four stays on the site are still invented and labelled demo.

Caught in public:
The verifier caught two mistakes today — a wrong expectation about a sold-out date range, and a PostgreSQL rule about select aliases. Both are fixed and the check passes.

Tomorrow:
Booking core — state machine, availability formula, 10-minute holds, row locking and cancellation deadline calculation. Two guests racing for the last room: the second must be blocked.
```

**Next pickup (superseded by the Day 7 entry below):** Day 7, Stage 6 — booking core. Implement `POST /api/bookings` with `draft` → `held` → `payment_pending`, 10-minute holds, row locking inside a transaction, the shared availability formula, and the cancellation policy deadline calculator. Then add a two-guest race test for the last room.

---

## Day 7 — Monday 23 November 2026 · Stage 6: Booking core

**Status:** Done

**What we did**
- Added `POST /api/bookings`. It creates a `draft` booking, moves it to `held` in the same transaction, writes a durable hold row, and returns a guest-only receipt. Required guest data stays name, email, phone, dates, room and accepted terms — no account and no card fields on our site.
- Put the room row under `SELECT ... FOR UPDATE` before the availability re-check, so two guests racing for the last room are serialised. The loser gets a clean 409, not a second confirmed reservation.
- Added an explicit server-side state machine covering `draft` → `held` → `payment_pending` → `confirmed` → `completed`, plus the documented expired, failed, cancelled, no-show and refund paths. Invalid transitions are rejected with 409; a browser redirect never advances a booking.
- Added shared pure functions for nights, all-in money split and the three locked cancellation deadlines. Flexible and moderate are anchored to the check-in date in WAT; strict is anchored to the moment of booking. The template and deadline are snapshotted on the booking, so a later hotel policy change cannot rewrite it.
- Holds last `HOLD_TTL_MINUTES` (10 by default). `expireStaleHolds()` is safe to run repeatedly: it locks stale booking and hold rows, transitions them to `expired`, removes the holds and writes audit lines.
- Added `beginPayment()` and `confirmBooking()` service functions for the Paystack work. Confirmation locks the room again, re-checks availability while excluding the booking's own hold, then stores the Paystack reference, clears expiry and deletes the hold. This is the "re-check inside one transaction" rule from §4.
- Added audit lines for booking creation, hold creation, status changes, payment pending and confirmation. Every money or status change has a row with actor, before and after state.
- The guest response uses a dedicated schema. It includes the reference, dates, nights, all-in total, policy deadline and hold expiry, but no hotel phone, payout code, commission amount, agent data or inspection internals.
- Added `npm run verify:booking`. It races two guests for one room, checks the 201/409 split, verifies the 10-minute hold and WAT deadline, walks the booking through payment-pending and confirmation, proves a third request is blocked, tests expiry idempotence, checks all three deadline templates, audits and validation failures, then removes its own rows.

**Files touched**
New: `server/src/booking/state-machine.ts`, `server/src/booking/audit.ts`, `server/src/booking/service.ts`, `server/src/booking/verify.ts`, `server/src/api/booking-route.ts`.
Changed: `package.json`, `server/package.json`, `packages/shared/src/index.ts`, `server/src/db/client.ts`, `server/src/api/availability.ts`, `server/src/api/routes.ts`, `server/src/index.ts`, `docs/02-BACKEND-ARCHITECTURE.md`, `docs/12-ENVIRONMENT-KEYS.md` and this file.

**Verification**
- `npm run build:shared && npm run typecheck && npm run build` → clean in all three workspaces.
- Fresh throwaway PostgreSQL on port 55433 and Redis on port 6380 from the already-present `postgres:15` and `redis:latest` images. No credentials were written to the repo; no `.env` file was created.
- `npm run migrate` → applied the schema; `npm run migrate:status` → up; a second migrate → no migrations executed.
- `npm run verify:db`, `verify:models`, `verify:cache` and `verify:api` → all passed after one fix.
- `npm run verify:booking` → race lock, hold, confirmation, expiry, deadline math, audit trail, private-field denial and validation all passed. Repeated three more times with no flaky result.
- The first full run caught a missing `null` replacement binding in the shared availability query after the "exclude own hold" parameter was added. Fixed in `server/src/api/availability.ts`; the read API suite passed again.
- API booted with database, Redis and Paystack unset: `GET /health` returned 200 with all integration flags false.
- No secrets, `.env` files, build output or attribution notes staged.

**Social post #7**
```text
[Day 7 / building JosStay in public until 30 Nov]

Two guests, one room. The second one now gets a clean "no".

What shipped:
• POST /api/bookings creates a held booking with just the guest's name, email, phone, dates, room and accepted terms. No account. No card fields on our site.
• The room row is locked before the availability check. Two guests racing for the last room cannot both win; the loser gets a 409.
• A 10-minute hold is written as a durable row and can be expired by a repeatable job.
• A server-side state machine controls draft → held → payment pending → confirmed. A browser redirect never confirms anything.
• Cancellation deadlines are calculated from the locked templates and snapshotted on the booking. Flexible and moderate use the check-in date in WAT; strict uses the booking time.
• Confirmation re-checks availability inside the same transaction, excluding the booking's own hold. The Paystack work can plug into that without weakening the rule.
• Every status and money change writes an audit line.
• A repeatable check races two guests, walks the winner through payment and confirmation, tests expiry and deadlines, then cleans up.

Why it matters:
Availability is not a number on a page. It is a promise backed by a lock, a hold and a transaction. That is the difference between "looks booked" and "is booked".

Still real / still demo:
Ran against local throwaway Postgres and Redis. No hotel is onboarded. No real guest, real phone number, live key or payment exists. The four stays on the site remain invented and labelled demo.

Caught in public:
The first full run caught a missing null binding in the shared availability query. Fixed, and both the read API and booking suites pass again.

Tomorrow:
Paystack split — hosted checkout, signed webhook, idempotency, 10% commission stored, and confirmation through the lock we just built. Card, bank transfer and USSD stay on Paystack.
```

**Next pickup (superseded by the Day 8 entry below):** Day 8, Stage 7 — Paystack split. Add `POST /api/payments/initialize` using hosted checkout with card, bank transfer and USSD; verify the webhook signature and reject replays by `paystack_reference`; call `confirmBooking()` inside the webhook transaction; store the 10% commission and hotel share from the locked split. Use test keys only — no live key or real hotel yet.

---

## Day 8 — Tuesday 24 November 2026 · Stage 7: Paystack split checkout

**Status:** Done

**What we did**
- Added `POST /api/payments/initialize`. It takes only a JosStay booking reference, creates a hosted Paystack checkout session and returns the authorization URL, amount, channel list and provider reference. Card data never touches our API — card, bank transfer and USSD stay on Paystack.
- The split is configured from the locked 17 November decision: `subaccount` is the hotel's code, `bearer: "subaccount"` makes the hotel carry the Paystack fee, and `percentage_charge` is derived from `COMMISSION_BPS / 100` (10 at the fixed 1000 bps). No guest-facing service fee; the all-in amount is unchanged.
- Added a publish gate: initialization refuses a hotel with no Paystack subaccount, or one whose subaccount has not been verified when `SUBACCOUNT_VERIFICATION_REQUIRED=true`. Verification status is an internal field, never returned to guests.
- Added `POST /api/webhooks/paystack`. It verifies the `x-paystack-signature` header as HMAC-SHA512 of the exact raw request bytes using `PAYSTACK_SECRET_KEY`, compared with `timingSafeEqual`. Raw bytes are captured by `express.raw` before the JSON parser runs, so the signature covers the untouched payload. Invalid or missing signatures get 401; non-successful events are acknowledged and ignored.
- A signed `charge.success` is the only proof of payment. The webhook checks the currency (NGN), the exact kobo amount against the booking, and that the provider reference matches the stored one before confirming.
- Idempotency is enforced on `paystack_reference`: a duplicate delivery is acknowledged with `idempotent: true` and writes no second audit line or confirmation. The booking row is locked with `FOR UPDATE` and re-read after the lock, so two concurrent webhook deliveries cannot both confirm.
- Confirmation goes through the Day 7 lock: `confirmBookingInTransaction()` re-checks availability inside the same transaction, excluding the booking's own hold, then confirms, clears expiry and deletes the hold. The payment and confirmation status changes share one transaction and audit trail.
- Added shared schemas for payment init, the guest-facing payment response and the signed webhook envelope. The payment response contains no secret, subaccount code, commission figure, hotel phone or guest PII.
- Made the payment provider injectable via `createApp({ paymentClient })`, so verification uses a fake client and never calls Paystack. Added `npm run verify:payments`.
- Live Paystack documentation could not be fetched during this build (the docs endpoint returned 403). The request shape follows the locked 17 November decision and must be rechecked against current Paystack docs and the dashboard before launch.

**Files touched**
New: `server/src/payment/client.ts`, `server/src/payment/signature.ts`, `server/src/payment/service.ts`, `server/src/payment/routes.ts`, `server/src/payment/verify.ts`.
Changed: `package.json`, `server/package.json`, `packages/shared/src/index.ts`, `server/src/env.ts`, `server/src/index.ts`, `server/src/api/routes.ts`, `server/src/api/errors.ts`, `server/src/booking/service.ts`, `docs/02-BACKEND-ARCHITECTURE.md`, `docs/12-ENVIRONMENT-KEYS.md` and this file.

**Verification**
- `npm run build:shared && npm run typecheck && npm run build` → clean in all three workspaces after two typecheck fixes.
- Fresh throwaway PostgreSQL on port 55434 and Redis on port 6381. No credentials written to the repo; no `.env` file created.
- `npm run migrate` → applied the schema; a second migrate → no migrations executed.
- `npm run verify:db`, `verify:models`, `verify:cache`, `verify:api`, `verify:booking` → all passed.
- `npm run verify:payments` with a throwaway `sk_test_` key → hosted init inputs, split fields, subaccount gate, signature rejection (bad + missing), ignored events, amount/currency checks, idempotent replay and field safety all passed. Repeated three times total with no flaky result.
- API booted with database, Redis and Paystack unset: `GET /health` returned 200 with all integration flags false.
- Verification rows removed; no secrets, `.env` files, build output or attribution notes staged.

**Social post #8**
```text
[Day 8 / building JosStay in public until 30 Nov]

A redirect is not a receipt. Now only a signed webhook confirms a booking.

What shipped:
• POST /api/payments/initialize returns a hosted Paystack checkout URL. Card, bank transfer and USSD stay on Paystack — no card data touches our API.
• The 10% split is configured on the transaction: hotel subaccount, hotel bears the Paystack fee, our commission is a clean 10%. No guest-facing service fee.
• A publish gate refuses any hotel whose Paystack subaccount is missing or unverified.
• POST /api/webhooks/paystack verifies the HMAC-SHA512 signature over the exact raw bytes using timing-safe comparison. Bad or missing signature gets a 401.
• Only a signed charge.success for the right reference, currency and exact amount confirms a booking.
• Replays are acknowledged once and write no second confirmation or audit line. The booking row is locked so two deliveries cannot both confirm.
• Confirmation runs through the same transaction and availability lock from Day 7 — payment does not bypass the hold rules.
• A repeatable check covers the whole flow with a fake provider. No live key, no network call.

Why it matters:
Split payments are easy to demo and easy to get wrong. The important part is that money and status move together, exactly once, and only when the provider says so. That is what we built today.

Still real / still demo:
Ran against local throwaway Postgres, Redis and a throwaway test key. No live Paystack call. No hotel is onboarded. No real guest, real phone number or real payment exists. The four stays on the site remain invented and labelled demo.

Caught in public:
The verifier's own "missing signature" test passed a valid signature by mistake. Fixed — an unsigned webhook is now genuinely tested and rejected with a 401.

Tomorrow:
Guest flow — wire checkout and the booking receipt into the client, keep Book by chat visible, and show the confirmed address, map pin and hotel phone only after payment.
```

**Decision update (logged after Day 8):** Timothy confirmed there is no useful reason to hide a hotel's location. The **address and map pin stay public**, exactly as they are in the current API and UI. Only the **hotel phone number** is gated on a confirmed booking. This supersedes the "show the address and pin only after payment" wording in post #8 and the earlier Day 9 pickup. Locked in `01-PRODUCT-PLAN.md` §2.

**Decision update (logged after Day 8, second note):** Timothy confirmed two messaging details. (1) The hotel phone is **emailed only to the booked customer** — the receipt page and WhatsApp message show the address and map pin but omit the phone. This supersedes the earlier "receipt, email and WhatsApp" wording. (2) JosStay **does email the hotel after a confirmed booking**, with booking details only: reference, guest name, dates, room, guest count and total — no guest phone or email. This needs a new internal `contact_email` column on hotels and a Sequelize migration; the column is excluded from public API reads. Locked in `01-PRODUCT-PLAN.md` §2/§5.5 and `02-BACKEND-ARCHITECTURE.md` §3/§6.

**Next pickup:** Day 9, Stage 8 — Guest flow. Add the internal hotel contact email (Sequelize CLI migration + model + internal-column allow-list, never public). Wire the client to `POST /api/bookings` and `POST /api/payments/initialize`: dates and guests, all-in total, cancellation deadline, hosted Paystack redirect, and a booking receipt page that polls confirmation by reference. The address and map pin stay public everywhere. The **hotel phone is emailed only to the booked guest** — receipt page and WhatsApp omit it. Send the hotel a confirmation email with booking details only on `charge.success`. Keep **Book by chat with JosStay** visible at every step. No card fields on our site.

---

## Day 9 — Wednesday 25 November 2026 · Stage 8: Guest flow and confirmations

**Status:** Done

**What we did**
- Added a Sequelize CLI migration for `hotels.contact_email` and `bookings.whatsapp_opt_in`. Both are internal. `contact_email` was added to the internal-column list and is absent from every public hotel read; the guest-facing receipt uses the public allow-list, so neither phone nor contact email can be selected by accident.
- Added a strict shared `BookingReceipt` contract and `GET /api/bookings/:reference/receipt`. It repeats the public address and map pin, dates, guests, all-in total and cancellation deadline. It structurally has no hotel phone, guest contact details or commission data.
- Built the confirmation layer. The guest email contains the hotel phone; WhatsApp and the receipt page contain the address and map pin but no phone; the hotel email contains the reference, guest name, room, dates, guest count and total, with no guest phone or email. Payload builders throw if the phone leaks into WhatsApp or guest contact details leak into the hotel email.
- Notifications fire only once a signed `charge.success` has committed the booking. Replays are acknowledged without resending. A provider failure is audited as failed and isolated: a paid booking never turns into a failed webhook. With no Brevo or WhatsApp credentials configured, the adapter logs a redacted suppression line and throws, so the audit says "failed" rather than claiming a message was sent.
- Added `npm run verify:guest`. It writes throwaway rows, uses injected fake payment and notification clients, and checks receipt fields, email-only phone, hotel confirmation, WhatsApp opt-in, audit rows, replay no-resend and provider-failure isolation.
- Wired the client guest flow: a typed API client that parses every response with the shared Zod schema; a checkout panel that asks only for name, email and phone plus opt-in and terms; a live room lookup by public hotel slug; `POST /api/bookings` → `POST /api/payments/initialize` → hosted Paystack redirect; and a receipt page at `/booking/confirmed` that polls by reference until the signed webhook lands. A held reference can resume payment without creating a second hold.
- Kept **Book by chat with JosStay** visible on the listing card, inside checkout, on the receipt page and in the mobile action bar. No card field is rendered anywhere in the app.
- Corrected copy that had stopped being true: the address and map pin are public, the hotel phone is emailed only to the booked guest, and hosted checkout is wired in Paystack test mode. Demo cleaning fees were set to zero so the displayed total matches the backend's all-in total.

**Files touched**
New: `server/migrations/20261122000000-hotel-confirmation-contacts.cjs`, `server/src/notifications/types.ts`, `server/src/notifications/client.ts`, `server/src/notifications/service.ts`, `server/src/booking/receipt.ts`, `server/src/booking/verify-guest.ts`, `client/lib/api.ts`, `client/components/booking/chat-fallback.tsx`, `client/components/booking/guest-checkout.tsx`, `client/components/booking/receipt-poller.tsx`, `client/app/booking/confirmed/page.tsx`.
Changed: root and server `package.json`, `packages/shared/src/index.ts`, `server/src/env.ts`, `server/src/index.ts`, `server/src/api/routes.ts`, `server/src/api/booking-route.ts`, `server/src/payment/service.ts`, `server/src/payment/routes.ts`, `server/src/payment/verify.ts`, `server/src/booking/service.ts`, `server/src/db/models.ts`, `server/src/db/public-fields.ts`, `server/src/db/verify-schema.ts`, client booking widget, stay page, layout, help, legal, partner and styleguide copy, `client/lib/data.ts`, `client/lib/format.ts`, `docs/01-PRODUCT-PLAN.md`, `docs/02-BACKEND-ARCHITECTURE.md`, `docs/05-PRODUCTION-CHECKLIST.md`, `docs/12-ENVIRONMENT-KEYS.md`, `docs/13-PUBLIC-BUILD-PLAN.md` and this file.

**Verification**
- `npm run build:shared && npm run typecheck && npm run build` → clean in all three workspaces.
- Fresh throwaway PostgreSQL on port 55433 and Redis on port 6380. No credentials written to the repo; no `.env` file created.
- `npm run migrate` applied both migrations; a second run reported no migrations executed and `migrate:status` showed both up.
- `npm run verify:db`, `verify:models`, `verify:cache`, `verify:api`, `verify:booking`, `verify:payments`, `verify:guest` → all passed with a throwaway `sk_test_` key and fake providers.
- API booted with database, Redis and Paystack unset: `GET /health` returned 200 with all integration flags false.
- No live Paystack call, no real email or WhatsApp message, no secrets or build output staged.

**Social post #9**
```text
[Day 9 / building JosStay in public until 30 Nov]

A booking is not finished when the redirect happens. It is finished when the guest knows where to go — and the hotel knows who is coming.

What shipped:
• Guest checkout now creates a held booking, starts a hosted Paystack checkout and returns to a receipt page that polls by reference until the signed webhook confirms it.
• The receipt shows the address and map pin, dates, all-in total and cancellation deadline. It never shows the hotel phone.
• The phone is emailed only to the booked guest. WhatsApp gets the same details without the phone.
• The hotel gets its own confirmation email after charge.success: reference, guest name, room, dates, guest count and total. No guest phone, no guest email.
• The hotel contact email is an internal column behind a Sequelize migration and is excluded from every public read.
• Confirmations fire after the payment transaction commits. Replays do not resend. A broken email provider is audited as failed, but never turns a paid booking into a failed webhook.
• Book by chat with JosStay is visible at every step. No card field lives on our site.

Why it matters:
The fastest path from "I like this place" to "I know exactly where I'm going" should not require three human conversations. It should require three fields and one hosted payment — with the private details going only to the people who need them.

Still real / still demo:
Ran against throwaway Postgres, Redis, a throwaway test key and fake notification clients. No live Paystack call, no real email, no WhatsApp message. No hotel is onboarded; the four stays remain invented and labelled demo.

Caught in public:
The site still said the exact address was shared only after booking, and the demo total included a cleaning fee the backend never charges. Both are now corrected: address and pin are public, and the guest total is all-in.

Tomorrow:
Harden the operational edges — inspect the first real hotel, wire true decryption for stored hotel phones, consent timestamps, email retries and the live-key checklist before anything goes public.
```

---

## Day 9b — Wednesday 18 November 2026 · Stage 8b: Partner dashboard with sample data

**Status:** Done

**What we did**
- Built the hotel/partner dashboard now, with no dependency on a real hotel. Five working screens are live at `/partner`: overview, calendar, bookings, listing and payouts.
- Added a one-file data boundary. `client/lib/partner-data.ts` owns a `PartnerDataSource` contract, schema-validated browser persistence and a reset action. `partnerDataSource` is the single swap point for verified data; no screen imports the sample snapshot.
- Moved all invented records into `client/lib/partner-sample-data.ts` and defined the shared shape in `client/lib/partner-contract.ts`. Every screen sees the same `PartnerSnapshot` type whether the source is sample or verified.
- Added a property switcher, sample-data banner, reset action and chat link in a shared partner shell. Local edits to room price, room status, blocks, policy template and house rules persist in this browser. Bookings and payouts stay read-only because their production source of truth is the booking engine and signed payment events.
- Kept the privacy rules visible in the UI and in the data contract. The workspace holds guest names only: no guest phone, guest email or hotel phone. The public address and map pin remain public. CSV exports use explicit column allow-lists.
- Wrote `docs/15-PARTNER-DASHBOARD-DESIGN.md` with the information architecture, screen designs, sample-data contract, privacy limits, states and the exact verified-data swap steps.
- Added `npm run verify:partner`, a repeatable check for sample labelling, absent contact fields, exact 10% commission maths, payout reconciliation, block safety and adapter save/reset.
- Added a direct preview link from the property-intake page. The dashboard is `noindex` and is not in the public header.

**Files touched**
New: `client/lib/partner-contract.ts`, `client/lib/partner-data.ts`, `client/lib/partner-view.ts`, `client/lib/partner-sample-data.ts`, `client/scripts/verify-partner.ts`, `client/components/partner/partner-data-provider.tsx`, `client/components/partner/partner-shell.tsx`, `client/components/partner/partner-ui.tsx`, `client/components/partner/screens/partner-overview.tsx`, `partner-calendar.tsx`, `partner-bookings.tsx`, `partner-listing.tsx`, `partner-payouts.tsx`, `client/app/partner/layout.tsx`, `client/app/partner/page.tsx`, `client/app/partner/calendar/page.tsx`, `client/app/partner/bookings/page.tsx`, `client/app/partner/listing/page.tsx`, `client/app/partner/payouts/page.tsx`, `docs/15-PARTNER-DASHBOARD-DESIGN.md`.
Changed: root and client `package.json`, `package-lock.json`, `client/app/list-your-property/page.tsx`, `docs/13-PUBLIC-BUILD-PLAN.md` and this file.

**Verification**
- `npm run verify:partner` → "Partner dashboard verified (2 sample hotels, no contact fields, 10% maths, adapter save/reset)."
- `npm run typecheck` → clean in shared, client and server after removing stale generated route types and re-exporting the snapshot type from the adapter.
- `npm run build` → clean in all three workspaces. Next.js compiled 32 pages, including all five `/partner` routes.
- Production server smoke test: `/partner`, `/partner/calendar`, `/partner/bookings`, `/partner/listing` and `/partner/payouts` each returned HTTP 200 with the sample-data banner present and no forbidden contact-field markers in the rendered HTML.
- No real hotel, guest, payment, Paystack call, email or WhatsApp message was used. No secrets or build output staged.

**Social post #10**
```text
[Day 9b / building JosStay in public until 30 Nov]

The partner dashboard is built — with sample data, not promises.

What shipped:
• Five working screens: overview, calendar, bookings, listing and payouts.
• Property switcher, sample banner, reset, month grid, blocks, filters, detail panel and CSV exports.
• One data boundary. Every screen reads the same snapshot contract, so verified data later does not mean a redesign.
• Room price, status, blocks, policy and house rules save in this browser. Bookings and payouts stay read-only because signed payment events own them.
• No guest phone, guest email or hotel phone in the workspace or the exports. Address and map pin stay public, as locked.
• A repeatable check covers the sample labels, 10% maths, payout reconciliation, block safety and adapter save/reset.

Why it matters:
A hotel should be able to see tomorrow, know what it needs to prepare, and check its money without a phone call. That workflow can be finished before the first real property exists — as long as every invented field is labelled and isolated.

Still real / still demo:
Two invented properties, invented guest names and dates, invented payouts, browser storage only. No real hotel, no real booking, no Paystack payout, no login yet. The verified-data swap is documented, not performed.

Caught in public:
The verifier first failed on top-level await in a CommonJS script. It is now wrapped in an explicit async entry point and passes on every run.

Tomorrow:
Stage 9 — refund edge cases: proportional commission reversal, lost Paystack fees, recovery when the hotel is already paid, and the admin recovery queue.
```

**Next pickup:** Day 10, Stage 9 — money edge cases. Add the refund API call, proportional commission reversal, `fee_lost_kobo`, the recovery task when the hotel has already been paid, and the admin recovery queue. Keep the partner dashboard on sample data until verified API reads and property-level authorization exist.

---

## Day 10 — Thursday 26 November 2026 · Stage 9: Money edge cases

**Status:** Done

**What we did**
- Added shared refund contracts and a policy quote calculator. Guest cancellation follows the locked template snapshot; hotel and admin cancellations are full refunds. Partial refunds reverse the commission in the same proportion as the guest's money.
- Added `POST /api/refunds`. It locks the booking row, writes the refund and audit rows inside one transaction, calls the payment provider only after commit, and updates the booking through the existing `confirmed → refund_pending → refunded` state machine.
- Added a unique internal idempotency key on `refunds` via a Sequelize CLI migration. Repeating the same request returns the stored refund without a second provider call; a failed attempt can be retried with the same key.
- Recorded `fee_lost_kobo`, `commission_reversed_kobo` and `hotel_share_kobo` on the refund row. Guest responses expose only the amount, status, reference and the approved wording; splits, provider IDs, fees and recovery state stay internal.
- When `hotelPayoutState` is `paid_out`, JosStay fronts the guest refund and opens a recovery task due after `REFUND_RECOVERY_DAYS`. The state is an internal operations input until settlement reconciliation exists.
- Added `GET /api/admin/refund-recovery` with `open`, `aged` and `all` views, plus `POST /api/admin/refund-recovery/:id/actions` for notify, recovering, recovered and write-off. Role checks and property scoping remain part of the Day 12 console.
- Extended notification adapters with the approved guest refund message: “Refund initiated. Banks usually show the amount within 3–10 business days.” Email and opted-in WhatsApp payloads contain no hotel phone.
- Added `npm run verify:refund` with throwaway Postgres, Redis and fake payment/notification clients. It covers full and partial refunds, flexible and moderate templates, proportional reversal, lost fees, recovery creation and aging, admin actions, idempotency, provider failure/retry and field safety.
- Made the payment verifier's audit comparison explicitly ordered; its previous no-`ORDER BY` query was a latent flake.

**Files touched**
New: `server/src/refund/service.ts`, `server/src/refund/routes.ts`, `server/src/refund/verify.ts`, `server/migrations/20261126000000-refund-idempotency.cjs`.
Changed: `packages/shared/src/index.ts`, `server/src/payment/client.ts`, `server/src/payment/verify.ts`, `server/src/booking/verify-guest.ts`, `server/src/booking/audit.ts`, `server/src/db/models.ts`, `server/src/db/verify-schema.ts`, `server/src/notifications/types.ts`, `server/src/notifications/client.ts`, `server/src/notifications/service.ts`, `server/src/api/routes.ts`, root `package.json`, `server/package.json`, `docs/02-BACKEND-ARCHITECTURE.md`, `docs/12-ENVIRONMENT-KEYS.md`, `docs/13-PUBLIC-BUILD-PLAN.md` and this file.

**Verification**
- Fresh throwaway PostgreSQL on port 55435 and Redis on port 6382 from the already-present `postgres:15` and `redis:latest` images. No credentials were written to the repo; no `.env` file was created.
- `npm run migrate` → three migrations applied, including the new refund idempotency migration.
- `npm run verify:refund` → passed on four consecutive runs with a throwaway `sk_test_` key and fake providers: “Refunds verified (policy amounts, proportional reversal, fee loss, recovery queue, retry, privacy).”
- `npm run verify:db`, `verify:models`, `verify:cache`, `verify:api`, `verify:booking`, `verify:payments`, `verify:guest` and `verify:partner` → all passed after the changes.
- `npm run typecheck` and `npm run build` → clean in shared, client and server; Next.js compiled 32 pages.
- No live Paystack call, real refund, real email or WhatsApp message was used. Where the provider does not report a non-refundable fee, the adapter records zero and reconciliation must fill the gap before launch.

**Social post #11**
```text
[Day 10 / 30 Nov build-in-public]

What we shipped today:
• A refund path that follows the booking's locked cancellation template, not a guess made at refund time.
• Full and partial refund maths with proportional commission reversal.
• `fee_lost_kobo` recorded, plus a recovery task when the hotel's share has already been paid out.
• An admin recovery queue with notify, recovering, recovered and write-off actions.
• A repeatable fake-provider check covering policy amounts, idempotency, provider failure, retry and privacy.

Why it matters:
The hard part of a split payment is not taking the money. It is unwinding it honestly when plans change — especially when one side has already been paid. Now the money, the guest wording and the recovery work all have a recorded path.

Still real / still demo:
"Refund initiated. Banks usually show the amount within 3–10 business days." That wording is locked, but no real refund was sent. Ran on throwaway Postgres, Redis, a throwaway test key and fake providers. No hotel, guest, payout or recovery case is live. Hotel payout state is still entered internally, and admin login arrives with the Day 12 console.

Tomorrow:
Stage 10 — AI for ease: structured search filters, grounded policy answers and a human handoff, with no invented facts.
```

**Next pickup:** Day 11, Stage 10 — AI for ease. Add typed Zod filters from natural-language search, a grounded policy explainer and human handoff. Keep every answer inside locked policy and demo data; no admin auth or live money path yet.

