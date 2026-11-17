# JosStay — Law, Regulation and Policies

**Status:** Information checklist, **not legal advice**. Every item must be confirmed with a Nigerian lawyer and an accountant before launch.
**Date:** 17 November 2026
**Jurisdiction:** Federal Republic of Nigeria, with operations in Plateau State.

---

## 1. How to read this document

Nigerian regulation changes. This is a **scoping list** so you can brief counsel and accountants efficiently, not a statement of law. Where a statute or agency is named, confirm the current position before relying on it. Sources checked directly are listed at the end.

Priority key: **P0** = blocks launch · **P1** = needed before paying hotels or running ads · **P2** = needed as you scale.

---

## 2. Business formation and tax

| Item | Priority | Why it matters for JosStay | What to do |
|---|---|---|---|
| Incorporate a company (CAC) | **P0** | You sign contracts with hotels, receive money, and hold customer data. A registered company limits personal exposure and is required for corporate banking and Paystack business onboarding. | Register with the Corporate Affairs Commission under CAMA 2020. Reserve a name, file MEMART and director particulars, obtain certificate and TIN. Confirm whether a business name or limited company is appropriate for your risk profile. |
| TIN | **P0** | Needed for Paystack KYC, tax filings and hotel contracts. | Issued during/after CAC registration; confirm with the tax authority. |
| VAT registration and treatment | **P0** | Accommodation and platform services may be VAT-able. You must decide who accounts for VAT on the room and who accounts for VAT on your 10% commission. | Get a written opinion from an accountant. Configure invoices and the Paystack split accordingly. Do not guess. |
| Withholding tax / company income tax | **P1** | Applies to service income and some payouts. | Ask the accountant to confirm rates and filing calendar. |
| Annual returns and statutory filings | **P1** | CAC compliance lapse can invalidate your standing. | Diarise deadlines from incorporation. |
| Trademark / CAC name clearance | **P2** | Protects "JosStay" before marketing spend. | Search CAC and trademark records; file when budget allows. |

---

## 3. Data protection and privacy

| Item | Priority | Why | What to do |
|---|---|---|---|
| Nigeria Data Protection Act compliance | **P0** | You process names, emails, phone numbers, dates, payment references and inspection reports. | Brief a data-protection lawyer. Confirm whether NDPC registration applies to your category, whether a DPO is required, and whether a Data Protection Impact Assessment is needed. |
| Privacy notice | **P0** | Required for lawful collection and for Paystack/Meta review. | Publish a plain-English notice: what you collect, why, who you share with (hotel, Paystack, Brevo, WhatsApp, Cloudinary, LLM provider), retention, and how to object or delete. |
| Consent for WhatsApp | **P0** | Meta requires opt-in for template messages and a 24-hour service window. | Capture explicit opt-in at checkout with a checkbox: "Send my booking updates on WhatsApp." Never buy or scrape numbers. |
| Data subject rights process | **P1** | Access, correction, deletion and objection requests must be answerable. | Create an internal runbook with a 30-day target and an owner. |
| Cross-border transfers | **P1** | Vercel, Render, Supabase, Cloudinary, Brevo and an LLM provider may process data outside Nigeria. | List every processor and location in the notice; get counsel to confirm transfer safeguards. |
| Breach response plan | **P1** | Regulators and users expect a defined process. | Write a one-page plan: detect, contain, notify regulator and affected users, log. |
| Agent data handling | **P1** | Your inspectors hold business documents and property photos. | Signed confidentiality undertaking, least-privilege access, secure upload, no personal copies. |

---

## 4. Consumer protection and claims

| Item | Priority | Why | What to do |
|---|---|---|---|
| FCCPA compliance | **P0** | The Federal Competition and Consumer Protection Commission enforces fair trading, accurate pricing and complaint handling. Its own guidance and 2026 press releases show active enforcement on price discrepancies and misleading claims. | Brief counsel. Publish transparent pricing, honour stated policies, and keep a complaint register. |
| Truthful "Verified" claim | **P0** | A badge is a representation. It must mean exactly what your process delivers. | Define the badge publicly: "inspected by a JosStay agent on [date]; photos matched; pin confirmed; power tested." Never imply you guarantee hotel service. |
| "All-in price" claim | **P0** | Hidden fees are a enforcement target. | Show the total with taxes/fees position before checkout. No surprise commission line. |
| Cancellation policy display | **P0** | The hotel's rule must be shown before payment, with the actual deadline date. | Store a snapshot per booking. Never change a confirmed booking's policy retroactively. |
| Complaint handling and escalation | **P1** | Regulators expect a working process, not just an email address. | Publish a complaints procedure with timelines you can actually keep, plus an escalation path to a named human. |
| Advertising and sales promotions | **P2** | Discounts, referrals and "deals" may trigger rules. | If you run referrals or promotions later, clear the terms with counsel first. |

---

## 5. Payments, payouts and money

| Item | Priority | Why | What to do |
|---|---|---|---|
| Paystack business account + KYC | **P0** | Needed to accept payments and create subaccounts. | Provide CAC certificate, MEMART, TIN, director ID, proof of address, corporate bank details. |
| Hotel subaccount agreements | **P0** | The hotel must authorise you to create a subaccount and take 10%, and must repay its share if already paid out when a refund happens. | Signed partner agreement stating commission, payout timing, fee bearer, refund responsibility, a 7-day repayment undertaking and an offset right against future settlements. |
| Paystack fee bearer | **P0** | You decided the hotel bears it. Configure explicitly. | Set `bearer: "subaccount"` and verify on a test transaction. |
| Split-payment configuration | **P0** | 10% commission must be automatic and auditable. | Configure `percentage_charge: 10`; store commission and hotel share per booking. |
| Refund rules on split transactions | **P0** | Confirmed by Paystack on 17 Nov 2026 — see `11-PAYSTACK-SPLIT-REFUND-CONFIRMATION.md`. | Automatic split reversal only while funds remain with Paystack; if the hotel is already paid, JosStay's main account funds the refund and recovers from the hotel contractually. Add a recovery and offset clause to the partner agreement. Paystack fees are non-refundable — decide who absorbs them. Test full and partial refunds in test mode. |
| Chargebacks / disputes | **P1** | Guest disputes will happen. | Define evidence to keep: policy snapshot, check-in dates, messages, webhook records. Assign an owner. |
| Payout reporting to hotels | **P1** | Hotels need to trust the numbers. | Monthly statement: bookings, gross, 10% commission, Paystack fee, net paid, refunds. |
| E-invoicing / receipts | **P1** | Tax and guest trust. | Generate a receipt with hotel name, booking reference, amounts and tax position. |
| Book-by-chat payments | **P1** | Manual payment links must follow the same rules. | Never take card details over chat; always send a Paystack link. Log the agent and the reference. |

---

## 6. Hotel-side requirements you must verify

These are the hotel's responsibility, but your verification process should check them and record the result.

| Item | Why | Check |
|---|---|---|
| CAC registration / business registration | Confirms the hotel is a real business | Sight the document, record number and date |
| Relevant hospitality licences and local permits | Operating legality in Plateau State | Ask for state/local permits; confirm current requirements with the Plateau State authorities |
| Fire safety and basic health compliance | Guest safety | Record what was sighted; do not assert compliance you did not verify |
| Bank account in the business name | Paystack subaccount requirement | Match account name to registered entity |
| Ownership or authority to list | Prevents disputed listings | Get a signed declaration from an authorised person |
| Photo licence | You will publish and transform their photos | Written permission to use images on JosStay and its channels |
| Written house rules and cancellation template | Needed for accurate display | Hotel selects one of the three templates and signs off the wording |

---

## 7. Policies you must publish on the site

| Policy | Where | Must contain |
|---|---|---|
| Terms of Service | `/legal/terms` | Who JosStay is, what the service is, booking contract formation, merchant/intermediary role, pricing, user obligations, liability limits, governing law, dispute route |
| Privacy Policy | `/legal/privacy` | Data collected, purposes, processors, retention, rights, contact, cross-border transfers |
| Cookie Policy | `/legal/privacy#cookies` | Cookies used, analytics, consent |
| Cancellation & Refund Policy | `/legal/cancellation` | The three templates in full, how the deadline is calculated, refund process, "initiated vs completed" language, 3–10 business day expectation, non-refundable Paystack fee position, chargebacks |
| Pricing & Fees Policy | `/legal/fees` | All-in pricing, no guest commission, 10% paid by hotel, taxes/fees position |
| Guest House Rules | `/legal/house-rules` | Check-in/out, conduct, damage, smoking, pets — as set by each hotel, with hotel-specific addendum |
| Verification Methodology | `/promise#verification` | Exactly what the badge means, what was checked, when, who did it, re-inspection rule, how to challenge a claim |
| AI Assistant Disclosure | In chat and `/help` | That an assistant is in use, what it can and cannot do, that a human is available, and that it never changes money or policy |
| WhatsApp Consent Notice | At checkout opt-in | What messages will be sent and how to stop them |
| Complaints & Dispute Resolution | `/help#report` | How to complain, response targets, escalation, regulator signposting |
| Accessibility Statement | `/legal/accessibility` | WCAG target, known gaps, feedback route |

**Home/footer microcopy that must stay honest:**
- "JosStay is the booking intermediary. The hotel sets its own rules and remains responsible for the stay."
- "JosStay verifies the listing, not the hotel's service."
- "Hotel contact details are shared after a confirmed booking."

---

## 8. Contracts to have drafted

1. **Hotel Partner Agreement** — 10% commission, subaccount authorisation, fee bearer, policy template, payout timing, refund responsibility, a 7-day repayment undertaking if the hotel's share was already paid out, an offset right against future settlements, content licence, verification access, termination, audit rights.
2. **Guest Terms** — incorporated into checkout via clickwrap with a timestamped acceptance.
3. **Inspection Agent Agreement** — contractor status, confidentiality, data handling, report ownership, code of conduct, no conflicts of interest.
4. **Photo licence** — either within the partner agreement or a separate image consent.
5. **Processor agreements** — with Paystack, Brevo, WhatsApp provider, Cloudinary, hosting and LLM vendor, as applicable.

---

## 9. Open legal questions for counsel and accountant

1. Are you the **merchant of record**, an agent of the hotel, or both — and how is that stated in the terms?
2. Who accounts for VAT on the room and on the 10% commission?
3. Is withholding tax deductible from hotel payouts or your commission?
4. Does NDPC registration / DPIA / DPO obligation apply at your intended scale?
5. What are the current Plateau State requirements for hotel operation and short-stay accommodation?
6. Are there shortlet-specific local bylaws in Jos that change what you may list?
7. How should referral or promotional rewards be treated if you add them later?
8. What liability limit is enforceable in your guest terms, and what cannot be excluded?
9. **Decided:** JosStay absorbs Paystack's non-refundable processing fee. Ask the accountant how to treat `fee_lost_kobo` in the books and whether it is deductible.
10. Is a 7-day repayment undertaking and offset against future settlements enforceable, and how should it be drafted? (See `11-PAYSTACK-SPLIT-REFUND-CONFIRMATION.md`.)

---

## 10. Sources checked while writing this

- Corporate Affairs Commission (cac.gov.ng) — CAMA 1990 re-enacted 2020; registration gives legal recognition, corporate banking and verifiability.
- FCCPC (fccpc.gov.ng) — FCCPA 2018 mandate, consumer rights, complaint handling, business obligations, and 2026 enforcement activity on price discrepancies.
- Google Maps Platform global pricing — Embed map loads have unlimited free usage; Dynamic Maps and Places Autocomplete each have a 10,000/month free cap; billing must be enabled and API keys restricted. Paystack and NDPC pages were not verified directly; confirm their current terms with the providers.

**Reminder:** this document is a briefing aid, not a legal opinion. Nothing here should be published as a promise until counsel and your accountant have signed off.
