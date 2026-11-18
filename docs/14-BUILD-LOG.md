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

**Next pickup:** Day 7, Stage 6 — booking core. Implement `POST /api/bookings` with `draft` → `held` → `payment_pending`, 10-minute holds, row locking inside a transaction, the shared availability formula, and the cancellation policy deadline calculator. Then add a two-guest race test for the last room.
