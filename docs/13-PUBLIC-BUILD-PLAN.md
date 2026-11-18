# JosStay — Public Build Plan (17–30 November 2026)

**Status:** Active working schedule. Treat this as the build brief for every session.
**Start:** Tuesday 17 November 2026 · **End:** Monday 30 November 2026
**Companion:** `14-BUILD-LOG.md` — the living record. Always update it after a build.
**Related:** `01-PRODUCT-PLAN.md` through `12-ENVIRONMENT-KEYS.md`

---

## 1. What "building in public" means here

Every day we:
1. Take the next stage from the schedule below.
2. Write the code or content for that stage.
3. Verify it (`npm run typecheck`, `npm run build`, API health check, and the relevant rehearsal step).
4. Append an entry to `14-BUILD-LOG.md` with: what changed, files touched, verification result, what is next, and a ready-to-paste social post.
5. Send you that post in the chat.

**Nothing is published as live.** Until real hotels, Paystack live keys, Meta verification and counsel sign-off exist, everything we show is clearly labelled demo or staging. No fake ratings, no fake counts, no invented verification claims.

**Target for 30 Nov:** a complete, rehearsed **staging demo** covering search → checkout → confirmation → refund path, with admin verification. A production launch is **not** promised by 30 Nov because domain, Paystack live, Meta approval and the first signed hotel are external dependencies.

---

## 2. Where the work lives

| Path | Purpose |
|---|---|
| `/home/timothy-dusu/josstay-brandbook` | Monorepo root — docs, npm workspaces and one lockfile |
| `/home/timothy-dusu/josstay-brandbook/client` | Next.js frontend (`@josstay/client`) — keep the UI/design system unchanged |
| `/home/timothy-dusu/josstay-brandbook/server` | Express API (`@josstay/server`) |
| `/home/timothy-dusu/josstay-brandbook/packages/shared` | Zod schemas and types (`@josstay/shared`) shared by client and server |
| `docs/14-BUILD-LOG.md` | The pickup point after every stage |

Install once at the root with `npm install`. Root scripts: `npm run dev` (client), `npm run dev:server`, `npm run build`, `npm run typecheck`.

Before writing any code, re-read `client/AGENTS.md` and the relevant guide under `node_modules/next/dist/docs/`, as required.

---

## 3. Day-by-day schedule

| Day | Date | Weekday | Stage | Build focus | Exit condition |
|---|---|---|---|---|---|
| 1 | 17 Nov | Tue | **0 — Docs locked** | All ten+ decision docs, logo concept, env key guide, this plan and the build log | Docs complete, decisions locked, no code touched |
| 2 | 18 Nov | Wed | **1 — Foundation** | Done — see build log | Done — frontend/API typecheck clean, `GET /health` returned 200 |
| 3 | 19 Nov | Thu | **2 — Demo data** | Remodel `client/lib/data.ts` into `Hotel` shape; 3–5 clearly labelled demo hotels; derived areas; verification and policy fields | Home and search render with new data; no component redesign |
| 4 | 20 Nov | Fri | **3 — Truth on pages** | New home copy, trust strip, search box, verification panel, policy + deadline display, demo pills, AI question box UI. Confirm no phone in public data | Build clean; public-data test shows no hotel phone |
| 5 | 21 Nov | Sat | **4 — Backend schema** | PostgreSQL tables and migrations from `02-BACKEND-ARCHITECTURE.md` §3; Redis client; `refunds` recovery fields | Migrations run locally; tables match the doc |
| 6 | 22 Nov | Sun | **5 — Read API** | `GET /hotels`, `/hotels/:slug`, `/areas`, `/availability`; Zod-validated query params; public response test | Guest API never returns `phone_encrypted` |
| 7 | 23 Nov | Mon | **6 — Booking core** | Booking state machine, availability formula, holds with 10-min expiry, row locking, policy deadline calculator | Two guests racing for last room → second blocked |
| 8 | 24 Nov | Tue | **7 — Paystack split** | Checkout init, 10% `percentage_charge`, `bearer: subaccount`, signed webhook verification, idempotency, confirm booking | Test split shows correct commission; webhook replay ignored |
| 9 | 25 Nov | Wed | **8 — Guest flow** | Checkout page, confirmation page/email/WhatsApp adapters, address + pin + hotel phone after booking, Book-by-chat link | Demo booking completes end to end in test mode or with adapters logging payloads |
| 10 | 26 Nov | Thu | **9 — Money edge cases** | Refund API call, proportional commission reversal, `fee_lost_kobo`, recovery task when hotel already paid, admin recovery queue | Full + partial refund rehearsal passes with status "refund initiated" |
| 11 | 27 Nov | Fri | **10 — AI for ease** | JSON-LD on hotel pages; question box → typed Zod filters; plain-English policy explainer; human handoff; guardrails from `03-AI-FOR-EASE.md` | 30 test queries reviewed; no invented facts |
| 12 | 28 Nov | Sat | **11 — Admin & verification** | Agent report form, checklist, `Pass`/`Pass with notes`/`Fail`, publish gate incl. subaccount verification, audit log viewer | Only passed hotels can be published |
| 13 | 29 Nov | Sun | **12 — Rehearsal** | Run the 10-step rehearsal from `05-PRODUCTION-CHECKLIST.md` §7; privacy test, accessibility pass, bug fixes | All ten steps pass in staging |
| 14 | 30 Nov | Mon | **13 — Handover** | Final build log, production-readiness report, remaining external blockers, public recap post | Someone else can pick up from the log alone |

Weekends are lighter (review, docs, adversarial testing) but still produce a log entry and a post.

---

## 4. Stage gates — do not skip

A stage is **finished** only when:
- its exit condition is met;
- `14-BUILD-LOG.md` has an entry with files touched and verification output;
- a social post has been written for it.

If a stage is blocked (e.g. no Paystack key), build the adapter with a safe stub, log the exact blocker, and keep the next stage moving. Never fake a green check.

---

## 5. Pickup protocol

When resuming after any break:

1. Open `docs/14-BUILD-LOG.md` and read the **last entry**.
2. Open this plan and confirm the next Day/Stage number.
3. Check the working tree (`git status` if a repo exists, otherwise list modified files) so you don't overwrite work.
4. Continue from the "Next pickup" field of the last log entry.
5. After the build, append a new entry — never rewrite history.

---

## 6. Social post format

Each log entry carries a post with this shape. Keep it honest, short and specific.

```text
[Day X / 30 Nov build-in-public]

What we shipped today:
• ...
• ...

Why it matters:
...

Still real / still demo:
"..." (say plainly what is not live yet)

Tomorrow:
...
```

Rules: no "launched", no "live in Jos", no fake counts, no invented ratings, no "verified hotels" until real inspection reports exist. Say "demo", "staging", "test mode" whenever true.

---

## 7. Decision baseline (already locked — do not reopen)

- Commission: **10%**, hotel bears Paystack fee.
- Cancellation: **Flexible 24h / Moderate 72h + 50% / Strict 24h after booking**.
- Phone: **private until confirmed booking**.
- Refund: **"initiated" until Paystack confirms**; **3–10 business days** guest expectation; **JosStay absorbs non-refundable fee**; **7-day hotel repayment + offset**.
- Verification: listing real, photos match, pin confirmed, power tested; badge expires after 12 months.
- Subaccount **verified before publish**.
- Logo direction: 3D house inside Plateau map; `logo-concept.svg` is a concept, not a production master.
- AI: grounded, typed output, human handoff, never touches money or policy.
- Loading: skeleton-first streaming with route `loading.tsx`, Suspense for slow panels, inline action states and honest empty/error states.

---

## 8. GitHub policy — confirmed 17 November 2026

**Scope:** commit application code plus a **curated set of core docs**. Working notes and transient files stay local.

**Will be committed**
- Application source: `client/`, `server/`, `packages/`, root `package.json` and `.gitignore`.
- Core docs: `BRAND-BOOK.md`, `README.md`, `client/AGENTS.md`, `docs/01` through `docs/14`, and `docs/logo-concept.svg` (the referenced design concept).
- Empty `.env.example` placeholders in `client/` and `server/`.
- No secrets: `.env.example` with empty placeholders is committed; real `.env` files never are.

**Will NOT be committed**
- `.env`, `.env.local`, `.env.*.local`, Paystack/WhatsApp/Brevo/LLM keys, database URLs, generated secrets.
- `node_modules/`, `.next/`, build output, logs, caches, OS files.
- The original pitch deck binaries in `Documents/Downloads/` and any personal notes.
- Any doc that is not on the core list above.
- **Any AI-contribution remark.** No "generated by AI", no "written by an assistant", no AI `Co-authored-by:` trailers, no model/provider names as author, and no first-person assistant voice in docs, code comments or commit messages. References to AI as a **product feature** (e.g. `03-AI-FOR-EASE.md`, AI search, policy explainer) are allowed — only authorship claims are excluded.

**Commit rules for me**
1. Stage **explicit paths only** — never `git add .` or `git add -A`.
2. Check the staged list before committing; abort if a secret or excluded path appears.
3. Commit message format: `Day N — Stage name: short description`.
4. Push only after you have supplied the repository URL and authentication is available.
5. I do not create the GitHub account or grant permissions — you provide the remote.

**Current blocker:** repository URL from you. Until then, no `git init`, commit or push will happen.
