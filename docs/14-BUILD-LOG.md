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

**Next pickup:** Day 5, Stage 4 — backend schema. Create the PostgreSQL tables and migrations from `docs/02-BACKEND-ARCHITECTURE.md` §3, add the Redis client and the refund recovery fields, and run migrations locally. Keep the public API shape free of phone data; next stage builds the read endpoints on top.
