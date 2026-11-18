# JosStay — Environment Keys and How to Get Each Value

**Status:** No real `.env` files are present or committed. Empty `.env.example` files exist in `client/` and `server/`.
**Date:** 17 November 2026
**Related:** `02-BACKEND-ARCHITECTURE.md`, `05-PRODUCTION-CHECKLIST.md`, `11-PAYSTACK-SPLIT-REFUND-CONFIRMATION.md`

---

## 0. Ground rules before you start

1. **Only `NEXT_PUBLIC_` variables reach the browser.** If a key does not have that prefix, it stays on the server.
2. **Never commit real values.** Add `.env`, `.env.local`, `.env.*.local` to `.gitignore`. Keep only a `.env.example` with empty placeholders.
3. **Store production values in the hosting dashboards**, not in files:
   - Frontend: Vercel → your project → **Settings → Environment Variables**.
   - Backend: Render → your service → **Environment** (or an Environment Group).
4. **Test and live must be separate.** Paystack `test` keys in local/Preview/staging; `live` keys only in Production. Never point staging at live Paystack.
5. **`NEXT_PUBLIC_` values are baked into the build.** After changing one in Vercel, redeploy.
6. **Per-hotel values are not environment keys.** `paystack_subaccount_code`, hotel phone numbers, agent references and inspection reports live in the database, not in `.env`.

**Status labels used below:**
- **[we choose]** — you and I decide the value; no external account needed.
- **[needs account]** — you must create/sign up for a service first.
- **[blocked]** — waiting on an external approval or a decision not yet made.

---

# Part A — Frontend keys (Next.js / Vercel)

Local file: `client/.env.local`. Production: Vercel dashboard, project rooted at `client/`.

## `NEXT_PUBLIC_SITE_URL` — [needs account]
**Used for:** canonical links, JSON-LD, Open Graph tags, links inside emails.
**Public. Value now:** `http://localhost:4300` locally; `https://josstay.ng` in production.

1. Register the domain `josstay.ng` with a registrar.
2. In Vercel → your project → **Domains**, add `josstay.ng` and `www.josstay.ng`.
3. Vercel shows DNS records (A / CNAME). Add them at your registrar.
4. Wait for Vercel to issue SSL; confirm HTTPS resolves.
5. Set this key to the **apex URL without a trailing slash**.

## `NEXT_PUBLIC_API_URL` — [needs account]
**Used for:** all browser → API calls.
**Public. Value now:** `http://localhost:10000` locally; `https://api.josstay.ng` in production.

1. Deploy the Express API to Render; Render gives a `*.onrender.com` URL.
2. In Render → your service → **Custom Domains**, add `api.josstay.ng`.
3. At your registrar add the CNAME Render shows.
4. Confirm `https://api.josstay.ng/health` returns 200.
5. Set this key to that URL.

## `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY` — [needs account]
**Used for:** Paystack hosted checkout.
**Public — safe.** Card details never touch our site.

1. Complete Paystack business KYC (CAC certificate, TIN, director ID, corporate bank details).
2. Log in to Paystack Dashboard → **Settings → API Keys & Webhooks**.
3. Select the **Test** tab and copy the **Public Key** (`pk_test_...`) for local and Preview.
4. Select **Live** and copy `pk_live_...` only for the Production environment in Vercel.
5. Never put an `sk_` key here.

## `NEXT_PUBLIC_WHATSAPP_NUMBER` — [blocked]
**Used for:** the "Book by chat with JosStay" `wa.me` link.
**Public.**

1. Complete Meta Business verification and get the WhatsApp Business number approved.
2. In **Meta Business Suite → WhatsApp → API Setup** (or WhatsApp Manager), note the approved display number.
3. Convert to E.164 digits with no `+`: `+234 801 234 5678` → `2348012345678`.
4. Set that digit string here.

## `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` — [needs account]
**Used for:** map pins and place search in the browser.
**Public by design — restrict it.**

1. Go to Google Cloud Console → create/select a project.
2. **APIs & Services → Library** → enable **Maps JavaScript API** and **Places API** if using autocomplete.
3. **Billing** → link a billing account; Maps requires billing even on the free tier.
4. **Credentials → Create Credentials → API key**.
5. Edit the key → **Application restrictions → HTTP referrers** → add `https://josstay.ng/*` and `https://www.josstay.ng/*`.
6. **API restrictions** → limit to the APIs you enabled.
7. Set quotas and a billing alert. Embed map loads are unlimited free; Dynamic Maps and Autocomplete each have 10,000/month free events — verify current pricing before launch.

## `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` — [needs account]
**Used for:** building Cloudinary image URLs.
**Public.**

1. Create a Cloudinary account.
2. Open the dashboard; the **Product name / Cloud name** is shown at the top.
3. Copy that string (e.g. `josstay`).
4. Use the same value in the backend `CLOUDINARY_CLOUD_NAME`.

## `NEXT_PUBLIC_DEMO_MODE` — [we choose]
**Used for:** the site-wide "Demo content" banner.

1. Set `true` now — no real hotels are onboarded.
2. Set `false` in Production only when demo listings are removed.
3. Per-listing demo pills come from the API's `demo` field, not this flag.

## `NEXT_PUBLIC_SENTRY_DSN` — [needs account]
**Used for:** frontend error monitoring.
**Public — a DSN cannot write data without project keys.**

1. Create an account on Sentry and add a **Next.js/JavaScript** project.
2. Open **Project Settings → Client Keys (DSN)**.
3. Copy the DSN (`https://...@o...ingest.sentry.io/...`).
4. Use a separate Sentry project or environment tag for frontend and backend.

---

# Part B — Backend keys (Express / Render)

Local file: `server/.env`. Production: Render dashboard, service rooted at `server/`. **All of these are secret unless stated otherwise.**

## 1. Application

### `NODE_ENV` — [we choose]
1. Set `development` locally, `staging` on the rehearsal service, `production` only on the live service.

### `PORT` — [we choose]
1. Use `10000` locally and in Render (Render sets `$PORT`; read that value in code).

### `API_BASE_URL` — [needs account]
1. Same value as `NEXT_PUBLIC_API_URL`: `https://api.josstay.ng`.
2. Used in payment callbacks and signed links.

### `FRONTEND_URL` — [needs account]
1. Same value as `NEXT_PUBLIC_SITE_URL`: `https://josstay.ng`.
2. Used for CORS and redirect-after-payment.

### `ALLOWED_ORIGINS` — [we choose]
1. Comma-separated: `https://josstay.ng,https://www.josstay.ng`.
2. For local dev add `http://localhost:4300`.

### `LOG_LEVEL` — [we choose]
1. `debug` locally, `info` in staging/production.

## 2. Database and cache

### `DATABASE_URL` — [needs account]
**Source of truth. Secret.**

1. Create a Supabase project.
2. Go to **Project Settings → Database → Connection string**.
3. Choose **Transaction mode** (pooled, usually port `6543`).
4. Copy the URI and replace `[YOUR-PASSWORD]` with the database password you set.
5. Use this for the running application.

### `DIRECT_URL` — [needs account]
**Migrations only. Secret.**

1. In the same Supabase **Connection string** panel choose **Session mode** (direct, usually port `5432`).
2. Copy that URI with the same password.
3. Needed if we use Prisma/Drizzle migrations; otherwise omit.

### `REDIS_URL` — [needs account]
**Holds (10 min) and rate limits. Secret.**

1. Provision Redis — Upstash or Render Key Value are suitable.
2. Copy the connection string; prefer `rediss://` (TLS).
3. Confirm the API can connect before enabling holds.

## 3. Payments

### `PAYSTACK_SECRET_KEY` — [needs account]
**Most sensitive key. Also used to verify webhook HMAC-SHA512.**

1. Paystack Dashboard → **Settings → API Keys & Webhooks**.
2. Copy **Secret Key** from the **Test** tab for local/staging (`sk_test_...`).
3. Copy the **Live** secret only for production (`sk_live_...`).
4. Paystack signs webhooks with this key — there is no separate webhook secret in this design. Confirm against Paystack's current docs before launch.
5. Rotate immediately if exposed.

### `PAYSTACK_API_BASE` — [we choose]
1. `https://api.paystack.co`.

### `PAYSTACK_ENV` — [we choose]
1. `test` locally/staging, `live` in production.
2. Code should refuse to start if this disagrees with the key prefix.

### `COMMISSION_BPS` — [we choose]
1. `1000` = 10%, from your confirmed decision.
2. Per-hotel overrides still live in the `hotels` table.

### `HOLD_TTL_MINUTES` — [we choose]
1. `10` — matches `02-BACKEND-ARCHITECTURE.md`.

### `REFUND_RECOVERY_DAYS` — [we choose]
1. `7` — the repayment window you approved in `11-PAYSTACK-SPLIT-REFUND-CONFIRMATION.md`.

### `SUBACCOUNT_VERIFICATION_REQUIRED` — [we choose]
1. `true` — the publish gate you approved.
2. Verification status is checked in Paystack Dashboard → **Subaccounts** → select hotel → status.

## 4. Email and WhatsApp

### `BREVO_API_KEY` — [needs account]
1. Create a Brevo account.
2. **SMTP & API → API Keys → Generate a new API key** (v3).
3. Copy it once; Brevo will not show it again.
4. Verify your sender domain under **Domains** by adding the SPF, DKIM and DMARC records Brevo gives you.

### `BREVO_SENDER_EMAIL` — [needs account]
1. Use a verified address on that domain: `bookings@josstay.ng`.

### `BREVO_SENDER_NAME` — [we choose]
1. `JosStay`.

### `WHATSAPP_ACCESS_TOKEN` — [blocked]
1. Complete Meta Business verification and approve the WhatsApp number.
2. For development, Graph API Explorer can issue a temporary token.
3. For production: **Business Settings → System Users** → create a user with `whatsapp_business_messaging` and `whatsapp_business_management` permissions → **Generate Token**.
4. Store only the permanent token in production.

### `WHATSAPP_PHONE_NUMBER_ID` — [blocked]
1. Meta Business Suite → **WhatsApp → API Setup**.
2. Copy **Phone number ID**.

### `WHATSAPP_BUSINESS_ACCOUNT_ID` — [blocked]
1. Same screen; copy **Business Account ID** (WABA ID).

### `WHATSAPP_VERIFY_TOKEN` — [we choose, then enter in Meta]
1. Invent a long random string yourself, e.g. `openssl rand -hex 24`.
2. Put it here **and** paste the same string into Meta's webhook configuration.
3. Meta uses it only to verify our endpoint when the webhook is registered.

### `WHATSAPP_API_VERSION` — [we choose]
1. Use the latest stable Graph API version from Meta's docs, e.g. `v21.0`.
2. Review at each upgrade; Meta retires old versions.

## 5. Media, maps and AI

### `CLOUDINARY_CLOUD_NAME` — [needs account]
1. Same cloud name as the frontend key.

### `CLOUDINARY_API_KEY` — [needs account]
1. Cloudinary dashboard → **API Keys** → copy **API Key**.

### `CLOUDINARY_API_SECRET` — [needs account]
1. Same panel → copy **API Secret** (or regenerate if never shown).
2. Used for signed uploads only; keep it server-side.

### `GOOGLE_MAPS_SERVER_KEY` — [needs account]
1. In the same Google Cloud project, enable **Geocoding API**.
2. **Credentials → Create API key** — make a **second** key, separate from the browser key.
3. Restrict by **IP address** if Render gives a static outbound IP; if not, restrict by API and set strict quotas.
4. Use for server-side pin verification during agent inspection.

### `LLM_PROVIDER` — [blocked]
1. Not chosen yet. Pick a hosted provider with reliable structured outputs.
2. Store a short identifier such as `openai` or `anthropic` behind our provider interface.

### `LLM_API_KEY` — [blocked]
1. After choosing the provider, create an API key in its console.
2. Set spend limits at the provider as well as in our own code.

### `LLM_MODEL` — [blocked]
1. Choose the specific structured-output-capable model from that provider.

### `LLM_MONTHLY_BUDGET_USD` — [we choose]
1. Start with a small fixed ceiling; alert at 80%.

### `LLM_TIMEOUT_MS` — [we choose]
1. e.g. `8000`. On timeout, fall back to the normal filter UI and human handoff.

## 6. Security and operations

### `SESSION_SECRET` — [we choose]
1. Generate: `openssl rand -base64 32`.
2. Used to sign admin session cookies. Rotate if compromised.

### `TOKEN_SIGNING_SECRET` — [we choose]
1. Generate a **different** value: `openssl rand -base64 32`.
2. Signs single-use email verification links and other short-lived tokens.

### `HOTEL_PHONE_ENCRYPTION_KEY` — [we choose]
1. Generate a third distinct value: `openssl rand -base64 32` (32 bytes for AES-256-GCM).
2. Encrypts `hotels.phone_encrypted`, which is never returned by a public API.
3. Store it in a secret manager; losing it means losing the ability to read hotel phone numbers. *(Earlier note listed a `HOTEL_PHOTO_ENCRYPTION_KEY` by mistake — the correct key name is `HOTEL_PHONE_ENCRYPTION_KEY`.)*

### `EMAIL_VERIFICATION_TTL_HOURS` — [we choose]
1. `24` — the single-use verification link expires after one day.

### `SENTRY_DSN` — [needs account]
1. Create a **Node** project in Sentry (or use the same project with an environment tag).
2. **Project Settings → Client Keys (DSN)** → copy.

### `DEMO_MODE` — [we choose]
1. `true` now.
2. Set `false` only when real hotels, real photos and verification reports are live.

---

## 7. How to put them where they belong

**Local frontend**
1. Copy `client/.env.example` to `client/.env.local` and fill the frontend values.
2. From the repo root, `npm run dev` serves the client on port 4300.

**Local backend**
1. Copy `server/.env.example` to `server/.env` and fill the backend values.
2. From the repo root, `npm run dev:server` serves the API on port 10000.
3. Use Paystack test keys only.

**Local schema and cache checks**
1. Set `DATABASE_URL` for the application and `DIRECT_URL` for migrations. Both may be the same local database.
2. From the repo root, run `npm run migrate`. Applied files are recorded in `schema_migrations`; editing an applied file is rejected rather than silently re-run.
3. Run `npm run verify:db` to check the tables, columns and enum values against the Stage 4 plan.
4. Set `REDIS_URL` and run `npm run verify:cache` for a set/get/delete round-trip.

Install once from the repo root: `npm install`. npm workspaces link `client`, `server` and `packages/shared` into a single `node_modules` and one lockfile.

**Vercel**
1. Project → **Settings → Environment Variables**.
2. Add each frontend key, selecting which environments it applies to (Production / Preview / Development).
3. Redeploy after any `NEXT_PUBLIC_` change.

**Render**
1. Service → **Environment → Add Environment Variable**.
2. Or create an Environment Group and link it to the API and any worker services.
3. Render restarts the service when variables change.

## 8. What you can get today vs what is blocked

| Available now (we choose) | Needs an account | Blocked |
|---|---|---|
| `NODE_ENV`, `PORT`, URLs, `ALLOWED_ORIGINS`, `LOG_LEVEL`, `COMMISSION_BPS`, `HOLD_TTL_MINUTES`, `REFUND_RECOVERY_DAYS`, `SUBACCOUNT_VERIFICATION_REQUIRED`, `DEMO_MODE`, `PAYSTACK_ENV`, `PAYSTACK_API_BASE`, all three generated secrets, `EMAIL_VERIFICATION_TTL_HOURS`, `LLM_TIMEOUT_MS`, `LLM_MONTHLY_BUDGET_USD`, `WHATSAPP_VERIFY_TOKEN` | Domain/DNS, Paystack account keys, Supabase URLs, Redis URL, Cloudinary keys, Brevo key + verified domain, Google Maps keys, Sentry DSN, WhatsApp phone/IDs/token | `NEXT_PUBLIC_WHATSAPP_NUMBER`, all WhatsApp IDs/tokens (Meta verification), all `LLM_*` values (provider not chosen) |

## 9. Reminder

Paystack subaccount codes, hotel phone numbers, agent references, inspection reports and per-hotel commission overrides are **database fields**, not environment keys. This doc covers only configuration that is shared across the whole platform.
