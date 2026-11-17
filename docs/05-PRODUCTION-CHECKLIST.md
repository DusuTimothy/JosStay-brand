# JosStay — Production Readiness Checklist

**Status:** Working checklist. No code has been changed.
**Date:** 17 November 2026

This is the "what, why, how, and how I know it's done" list for going live. Each row has a **done when** column — an artefact you can actually hold. Nothing marked P0 is optional for launch.

---

## 1. Company, tax and legal (P0)

| Item | Why | How to get it | Done when |
|---|---|---|---|
| Company incorporated | Contracts, banking, Paystack, liability | CAC online registration: name search, reserve name, file MEMART + director details, pay fees | CAC certificate + TIN in hand |
| Corporate bank account | Receive settlements | Apply with CAC certificate, MEMART, TIN, director IDs, proof of address | Account confirmed, can receive a test transfer |
| Tax registration and VAT position | Invoice correctly | Engage an accountant; register as required; document who handles VAT on room vs commission | Written tax opinion + registration letters |
| Legal review of all policies | Avoid misleading claims | Send `04-LEGAL-AND-POLICIES.md` to a Nigerian lawyer | Signed-off policy texts |
| Guest terms + hotel agreement | Contractual basis | Lawyer drafts; you review commercial terms (10%, payouts, refunds) | Both documents signed by parties |
| Data protection position | Lawful processing | Confirm NDPC registration/DPO/DPIA obligations; appoint a DPO if required | Written confirmation + privacy notice published |
| Trademark/name clearance | Protect the brand | CAC and trademark search | Search report filed |

---

## 2. Payments and money (P0)

| Item | Why | How to get it | Done when |
|---|---|---|---|
| Paystack business account | Accept payments | Apply with company + bank + director documents; complete KYC | Live account approved |
| Live keys and webhook URL | Real transactions | Generate in Paystack dashboard; point to `https://api.josstay.ng/webhooks/paystack` | Test webhook received and verified |
| Hotel subaccounts | Split 10% to you | Create subaccount per hotel using its business bank details | Subaccount codes stored against hotels |
| Split config: 10%, fee on subaccount | Commission automatic | Set `percentage_charge: 10`, `bearer: "subaccount"` | Test payment shows correct three-way split |
| Card, bank transfer, USSD enabled | Nigerian guests pay different ways | Enable in Paystack dashboard; confirm with support | All three tested in test mode |
| Refund behaviour confirmed | You cannot promise what Paystack won't do | Paystack answered 17 Nov 2026; see `11-PAYSTACK-SPLIT-REFUND-CONFIRMATION.md`. JosStay absorbs the non-refundable fee (decided), draft hotel recovery clause, use the approved "initiated, usually 3–10 business days" wording, then test full and partial refunds | Refund test passes, commission reversal recorded, recovery task raised when hotel share already paid, `fee_lost_kobo` recorded |
| Subaccount verified before publish | Payouts to unverified subaccounts can be delayed | Create subaccount, complete verification in the dashboard, record the code | Verification confirmed in dashboard for every live hotel |
| Hotel recovery and offset clause | Hotels may already be paid when a refund happens | Lawyer puts a 7-day repayment undertaking and offset right into the partner agreement | Signed agreement contains both clauses |
| Payout reconciliation | Hotels trust the numbers | Build statement export; run one rehearsal month | Statement matches Paystack settlement |
| Chargeback playbook | Disputes will happen | Document evidence set and owner | Playbook reviewed by support lead |

---

## 3. Hotel supply and verification (P0)

| Item | Why | How to get it | Done when |
|---|---|---|---|
| Signed hotel agreements | Legal right to list and split | Send agreement to each hotel; sign; collect bank details | Signed copy per hotel |
| Hotel policy selection | Accurate display | Hotel picks flexible / moderate / strict and signs the wording | Template stored per hotel |
| House rules supplied | Guest knows the rules | Collect in writing; translate into the site's plain-English wording | Rules published on hotel page |
| Agent team and SOP | Badge must mean something | Recruit/train agents; issue the checklist and report template | SOP document + trained agent list |
| Inspection of every launch hotel | Truthful verification | Agent visit, photos, pin, power test, report | Dated signed report per hotel |
| Photo licence | Legal use of images | Included in partner agreement or separate consent | Signed consent on file |
| Re-inspection calendar | Badge stays current | 12-month cycle + complaint trigger | Calendar with owner |
| Demo labels removed | No false claims | Replace demo data with verified hotels | Zero "Demo listing" pills remain |

---

## 4. Content and brand (P0)

| Item | Why | How to get it | Done when |
|---|---|---|---|
| Final logo files | Consistent identity | Use `06-LOGO-BRIEF.md` + `logo-concept.svg`; have a designer produce final vector master | SVG master + PNG exports + favicon set |
| Real hotel photography | Drives desire; demo stock is a launch blocker | Commission a shoot per hotel; 12 approved images tagged by room | All live hotels have real galleries |
| Copy review | No invented claims | Check every page against `01-PRODUCT-PLAN.md` | No "124 properties", no "we re-house or refund", no fake ratings |
| Public phone rule | Hotel numbers stay private | Confirm API never returns `phone_encrypted` publicly | Automated test: guest API response has no hotel phone |
| Area pages | Supply-led coverage | Areas derived from hotel data; verify Jos City Centre, Terminus, Shere Hills where hotels exist | Area list matches live supply |
| AI disclosure text | Honest UX | Add to chat and `/help` | Text visible in product |

---

## 5. Technical infrastructure (P0/P1)

| Item | Priority | How to get it | Done when |
|---|---|---|---|
| Domain `josstay.ng` + DNS | P0 | Register; configure Vercel and API subdomain | HTTPS works on apex and `api.` |
| SSL / HSTS | P0 | Vercel + Render defaults; verify | A-grade SSL test |
| Vercel frontend | P0 | Connect repo, set env vars | Production deploy green |
| Render API | P0 | Deploy Express service, health check | `/health` returns 200 |
| Supabase PostgreSQL | P0 | Create project, run migrations, enable backups | Restore tested from a backup |
| Redis | P1 | Provision instance for holds/rate limits | Hold expiry job verified |
| Cloudinary | P0 | Create account, upload presets, signed uploads | Images delivered via CDN with transformations |
| Brevo | P0 | Verify sender domain (SPF/DKIM/DMARC), build templates | Test email lands in inbox, not spam |
| WhatsApp Business API | P0 | Meta Business verification, phone number, approved templates, opt-in capture | Template message delivered to a test number |
| Google Maps | P1 | Billing enabled, key restricted to josstay.ng, budget alerts, check Jos coverage | Pin and embed work; no surprise charges |
| LLM provider | P1 | Account, keys, spend cap, provider interface | Structured output validated in staging |
| Secrets management | P0 | All keys in env vars; rotate before launch | No secrets in repo or logs |
| Error monitoring + uptime | P1 | Sentry-style tool + uptime checks on site and webhook | Alert fires on a deliberate failure |
| Penetration test / security review | P1 | External or senior reviewer; focus on auth, webhook, IDOR | Report with no critical findings |

---

## 6. Compliance pages and flows (P0)

| Item | How to get it | Done when |
|---|---|---|
| Terms, Privacy, Cookies, Cancellation, Fees, House Rules, Accessibility | Lawyer-reviewed text from `04-LEGAL-AND-POLICIES.md` | All routes live and linked from footer |
| Verification methodology page | Document the agent checklist and badge definition | Page live with real dates |
| Checkout clickwrap | Checkbox: accepted terms + WhatsApp opt-in | Acceptance timestamp stored on booking |
| WhatsApp opt-in record | Store consent with phone and time | Consent row per booking |
| Complaint flow | Form + email + escalation owner | Test complaint gets a tracked response |
| AI assistant disclosure | Written text + human handoff | Visible in chat before first message |

---

## 7. Launch rehearsal (P0)

Run this end-to-end in **staging** with test keys before touching production:

1. Guest searches in plain English → correct filters shown → results returned.
2. Guest opens a hotel → sees real name, verification record, all-in price, policy + deadline → **no phone number**.
3. Guest selects dates → hold placed → checkout → Paystack test payment (card, transfer, USSD each once).
4. Webhook verifies signature → booking confirmed → availability recalculated.
5. Email + WhatsApp arrive with reference, address, pin and hotel phone.
6. Guest cancels → refund initiated → commission reversed (or recovery task raised if the hotel was already paid) → guest told 3–10 business days → status updates only after Paystack confirms.
7. Two guests race for the last room → second is blocked, not double-booked.
8. Book-by-chat link → agent receives structured summary → sends payment link.
9. Hotel statement shows gross, 10%, Paystack fee, net.
10. AI asks an unsupported question → says it does not know → hands off to a human.

**Go-live gate:** all ten pass, all P0 rows above are "done when" complete, and counsel + accountant have signed off.

---

## 8. Open items blocking specific rows

| Item | Blocks |
|---|---|
| Commission percentage | Confirmed at **10%** — no longer blocking |
| Cancellation template hours/percentages | **Confirmed 17 Nov 2026** — see `01-PRODUCT-PLAN.md` §4 |
| Paystack written answer on split refunds | **Resolved 17 Nov 2026** — see `11-PAYSTACK-SPLIT-REFUND-CONFIRMATION.md` |
| Non-refundable Paystack fee treatment | **Decided:** JosStay absorbs it; accountant to confirm treatment |
| Hotel 7-day repayment and offset clause | **Decided:** 7 days + offset; counsel to draft and confirm enforceability |
| First signed hotel | All verification and payout rows |
| Agent recruited and trained | Verification badge |
| Real photography | Removal of demo labels |
| LLM provider + budget | AI phases 2–4 |
| Meta Business verification | WhatsApp confirmation and chat booking |
