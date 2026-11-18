# JosStay — Redesigned Product Plan

**Status:** Proposed. No code has been changed. Supersedes the plan in the chat dated 17 Nov 2026.
**Date:** 17 November 2026

---

## 1. The business, stated precisely

JosStay is a **verifiable hotel marketplace in Jos**. Independent hotels keep their name, their prices and their rules. JosStay:

1. sends agents to inspect the property and write a report;
2. publishes the hotel with real photography and an honest, dated verification record;
3. brings guests to it;
4. takes **10% commission**, deducted from the payment inside Paystack before the hotel receives its share;
5. handles the guest relationship from search to confirmation and support.

We are **not** a hotel chain, not a host directory, and not a guarantor of hotel service. We guarantee the *listing* is real and the *price* is final. We do not rewrite hotel policy.

> **One-line positioning:** Find a real hotel in Jos. See the price and the rules before you pay.

---

## 2. Locked changes since the last plan

| # | Change | Consequence |
|---|---|---|
| 1 | **No hotel phone numbers in public** | Phone is revealed only after a confirmed booking — on the confirmation page, in the email and in the WhatsApp message. Public pages show hotel name, area, address and map pin only. |
| 2 | **Commission = 10%** | Fixed platform-wide, stored per hotel so it can be changed later. Paystack subaccount split, hotel bears the Paystack fee. Guest never sees a commission line. |
| 3 | **AI must be visible in the product** | See `03-AI-FOR-EASE.md`. Natural-language search, policy Q&A, WhatsApp assistant and photo/report checks are now first-class scope, not later ideas. |
| 4 | **New logo: 3D house inside a plateau map** | Replaces "The Plateau Pin". See `06-LOGO-BRIEF.md` and `logo-concept.svg`. |
| 5 | **No real hotels yet** | All listings ship in demo mode with visible labels. No invented ratings, counts or "Verified" claims. |
| 6 | **All areas, supply-led** | Rayfield, Lamingo, Little Rayfield, Bukuru, Bodija, Jos City Centre, Terminus, Shere Hills and any new area. Areas are derived from hotel data — adding a hotel in a new area creates the page. |

**Unchanged and protected:** the entire UI, colour tokens, type system, bento gallery, range calendar, motion, component library and page layouts. Only content, data shape and new transactional screens change.

---

## 3. Public vs private information

| Data | Public before booking | After confirmed booking |
|---|---|---|
| Hotel name | Yes | Yes |
| Area, address, map pin | Yes | Yes |
| Photos, amenities, power/water/parking notes | Yes | Yes |
| Cancellation template + deadline | Yes | Yes |
| All-in nightly price and total | Yes | Yes |
| Rating / review count | Only if real; hidden in demo | Yes |
| **Hotel phone number** | **No** | **Yes** |
| Owner / manager identity | **Never** | **Never** |
| Agent name and full inspection report | No | No (internal only) |

Why: the guest gets enough to decide, and JosStay stays the single point of contact. The hotel's number is a *fulfilment detail*, released once a booking exists.

---

## 4. Cancellation templates

The hotel chooses one at onboarding. We never write "free cancellation" without a date. **The three templates and their numbers were confirmed by Timothy on 17 November 2026.**

| Template | Guest-facing wording | Refund behaviour |
|---|---|---|
| **Flexible** | "Free cancellation until 24 hours before check-in" | After that, first night non-refundable |
| **Moderate** | "Free cancellation until 72 hours before check-in" | 50% back until 24 hours before; none after |
| **Strict** | "Free cancellation until 24 hours after booking" | No refund after that window |

The hotel page and checkout both show the chosen template **and** the calculated deadline for the selected dates. These numbers are locked; no further sign-off is needed before build.

---

## 5. Screens

### 5.1 Home (existing layout, new words)
- **Tagline:** `Your city, your stay.`
- **H1:** "Find a real hotel in Jos. See the price and the rules before you pay."
- **Trust strip:** `Hotel keeps its rules · We verify the listing · One price, no surprises`
- **Search:** where (area or landmark), check-in, check-out, guests
- **AI entry point:** a question box — *"Tell us what you need — 'quiet place near the university with steady power'"*
- Sections: areas rail → verified hotels → how verification works → list your hotel

### 5.2 Search results
Filters: area, dates, guests, price, 24/7 power, water, parking, Wi-Fi, security, cancellation template, distance from centre.
Card: image, **hotel name**, area + distance, `Verified · [date]`, all-in nightly price, policy label, View rooms, **Book by chat** link.
Result count reflects real data. No "124 properties".

### 5.3 Hotel detail
Existing bento gallery and calendar stay. Added:
- **Verification panel:** "Inspected 14 Nov 2026 by a JosStay agent · photos matched · power tested · pin confirmed"
- **House rules and policy:** the hotel's chosen template in plain English, plus its own house rules
- **Sticky "Your stay" panel:** dates, guests, room, all-in total, cancellation deadline, **Pay securely** and **Book by chat on WhatsApp**
- **Phone number is not shown.**

### 5.4 Checkout (new)
Guest name, email, phone. Reservation summary: hotel name, room, nights, all-in total, cancellation deadline. Secure-payment indicator. **Pay with Paystack** hosted checkout (card, bank transfer, USSD). No card fields on our site. No sign-in.

### 5.5 Confirmation (new)
Booking reference, hotel name, address, map pin, **hotel phone number**, dates, total, cancellation deadline, "Need help? Message JosStay". Sent as a page, an email (Brevo) and a WhatsApp message.

### 5.6 Book by chat
A WhatsApp link prefilled with: *"Hi JosStay, I'd like to book [hotel] for [dates], [guests] guests."* An agent confirms availability and either sends a Paystack payment link or completes the booking manually. This is a fallback, not a bypass of the payment rules.

### 5.7 Partner / list your hotel
Explain verification, the three templates, the 10% commission, subaccount payouts, photo licence and what the hotel must provide. Enquiry form.

---

## 6. Data shape (frontend-facing)

```ts
Hotel {
  slug, name, area, address, lat, lng
  nightly                    // all-in, NGN
  policyTemplate             // flexible | moderate | strict
  amenities[], rooms[]
  power, water, parking, security, wifi
  verification: {
    inspectedAt, agentRef, status,   // Pass | Pass with notes | Fail
    checks: { registration, visit, photoMatch, pin, power, water, security }[],
    reportUrl                  // internal only
  }
  rating?, reviews?          // hidden unless real
  demo, featured
}
```

Areas are derived from `Hotel.area`. A hotel in a new area creates that area page automatically.

---

## 7. Demo-mode rules

Until real hotels are onboarded:

- Every listing carries a **Demo listing** pill.
- Verification panel reads **Sample inspection record**.
- Ratings and review counts are hidden.
- Result counts reflect actual demo data only.
- A site-wide note: *"Demo content — real Jos hotels are being onboarded."*
- Demo hotels use the existing stock photography, clearly labelled as placeholder imagery.

Nothing in demo mode may imply a real inspection, a real price or a real guest review.

---

## 8. Build order

| Phase | Scope | Exit condition |
|---|---|---|
| **1 — Truth** | Data model, demo hotels, derived areas, verification panel, hotel policy display, new copy, logo, AI question box (UI) | Every public claim is either true or labelled demo |
| **2 — Booking** | Checkout, Paystack 10% split, webhook, confirmations (email + WhatsApp), Book by chat | A demo booking completes end-to-end in test mode |
| **3 — Intelligence** | AI search, policy Q&A, WhatsApp assistant, photo/report checks, JSON-LD | AI answers are grounded, logged and hand off to a human |
| **4 — Scale** | Real hotels, real photos, maps, partner onboarding, removal of demo labels | First live hotel paid out correctly |

Read `node_modules/next/dist/docs/` before writing any code, per `client/AGENTS.md`.

---

## 9. What I need from you before each phase

- Phase 1: cancellation templates are confirmed in §4; confirm area names only as new hotels arrive.
- Phase 2: commission confirmed at 10% — Paystack live keys and a subaccount for at least one test hotel.
- Phase 3: which AI provider and budget, plus approval for WhatsApp automation.
- Phase 4: first signed hotel, agent report and real photography.
