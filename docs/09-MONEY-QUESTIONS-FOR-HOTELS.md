# JosStay — Money Questions to Ask a Hotel

**Status:** Meeting aid. Tax and refund answers must be confirmed by an accountant and Paystack before launch.
**Date:** 17 November 2026
**Use with:** `07-LEGAL-QUESTIONS-FOR-HOTELS.md`, `10-POLICY-QUESTIONS-FOR-HOTELS.md`
**Backing docs:** `02-BACKEND-ARCHITECTURE.md` §6, `04-LEGAL-AND-POLICIES.md` §§2 and 5, `05-PRODUCTION-CHECKLIST.md` §2

---

## How to use this in the meeting

Money is where trust is won or lost. Ask for **numbers, not adjectives**. Write the rate card into the notes, get it signed, and never let a guest see a different total at checkout than the one advertised.

> The rule being agreed: guest pays one all-in price. JosStay deducts **10%** inside Paystack before the hotel is paid. The hotel bears the Paystack transaction fee. The guest never sees a commission line.

---

## 1. Rate card and what is included

| # | Ask | Why it matters | Listen for |
|---|---|---|---|
| 1 | "What is the nightly rate for each room type, in naira?" | The displayed all-in price comes from this. | Written rate card, per room, per night. |
| 2 | "Does that rate already include all taxes and fees?" | We advertise all-in. A hidden tax breaks the promise. | Clear "yes" or a written list of what is added. |
| 3 | "What is included — breakfast, Wi-Fi, parking, water, housekeeping?" | Guests compare on inclusions. | Itemised list. |
| 4 | "Do rates change on weekends, holidays or during events?" | The calendar must calculate the right total per night. | Written seasonal calendar or rules. |
| 5 | "What is the minimum stay, and do children pay?" | Affects the total and the guest count. | Explicit rule. |
| 6 | "Are there extra charges — early check-in, late checkout, extra bed, laundry, airport pickup?" | Must be disclosed before payment, not at the desk. | Amounts or "none". |
| 7 | "Do you take a damage or security deposit? How much, and when is it returned?" | A deposit is a policy the guest must see in advance. | Amount, hold or cash, return window. |

---

## 2. The 10% commission and the split

| # | Ask | Why it matters | Listen for |
|---|---|---|---|
| 8 | "Do you agree that JosStay takes 10% of each booking payment?" | Fixed platform-wide. Must be in the signed agreement. | Explicit yes. Red flag: "can we do 5% for my cousin?" |
| 9 | "Are you comfortable that the 10% is deducted automatically by Paystack before you are paid, rather than invoiced later?" | This is how the split is configured. | Yes, with understanding. |
| 10 | "Do you accept that you bear the Paystack transaction fee, so your 10% stays clean?" | Already decided; confirm, don't negotiate silently. | Yes. |
| 11 | "Can we create a Paystack subaccount using your business bank account?" | Legal row in the checklist. | Yes, with bank details. |

### Worked example to say out loud

> "If a guest books a ₦70,000 room for 2 nights, the total is ₦140,000. JosStay receives 10% = ₦14,000. Your share is ₦126,000, from which Paystack deducts its transaction fee. We will show you the exact fee on a live statement."

Illustration only. The actual Paystack fee and its calculation must be confirmed directly with Paystack before any number is published as final.

---

## 3. Payouts and bank details

| # | Ask | Why it matters | Listen for |
|---|---|---|---|
| 12 | "What are the account name, number and bank, and does the name exactly match the CAC registration?" | Paystack subaccount requirement. | Business account, matching name. |
| 13 | "When do you want settlements — daily, weekly or monthly?" | Set expectations in the agreement. | A schedule we can actually run. |
| 14 | "Who receives the monthly statement, and by what email?" | Trust through transparency. | Named finance contact. |
| 15 | "If bank details change, will you send a signed written instruction?" | Prevents fraud and wrong payouts. | Yes, with re-verification. |
| 16 | "Can you accept a small test payment before we publish the hotel?" | Proves the 10% split end to end. | Yes. |

Statement must show: gross, 10% commission, Paystack fee, refunds, net paid, booking references.

---

## 4. Refunds, cancellations and disputes

| # | Ask | Why it matters | Listen for |
|---|---|---|---|
| 17 | "Paystack confirms that if your share has already been paid to your bank when a refund happens, JosStay's main account funds the guest refund and we recover your share from you. Do you accept that, and will you return it within 7 days of written notice?" | Paystack cannot claw back paid-out funds. Recovery is contractual, not automatic. See `11-PAYSTACK-SPLIT-REFUND-CONFIRMATION.md`. | Written yes, with a 7-day undertaking and, where lawful, offset against future settlements. |
| 18 | "JosStay's 10% is reversed proportionally on a refund, and JosStay absorbs Paystack's non-refundable processing fee. You keep your share unless it was already paid out, in which case the 7-day repayment undertaking applies." | Tell the hotel the money rules plainly; no argument about fees at the desk. | Written acknowledgement. |
| 19 | "What happens on a no-show, or if a guest checks out early?" | These are hotel rules, but they affect money and must be shown in advance. | Written rule. |
| 20 | "If you cannot honour a confirmed booking, will you agree to a full refund initiated immediately?" | Guest protection. See `10-POLICY-QUESTIONS-FOR-HOTELS.md`. | Unambiguous yes. |
| 21 | "What evidence will you give us for a chargeback dispute?" | Policy snapshot, dates, messages, check-in record. | Named person and records. |
| 22 | "Do you accept that we say 'refund initiated' until Paystack confirms, and tell guests the money usually appears in 3–10 business days?" | Honest status language, confirmed by Paystack on 17 Nov 2026. | Yes. |

Paystack confirmed on 17 Nov 2026: automatic split reversal while funds remain with Paystack; main account funds the refund if the hotel is already paid; Paystack fees are non-refundable; guests usually see refunds in 3–10 business days; both parties get confirmation emails. See `11-PAYSTACK-SPLIT-REFUND-CONFIRMATION.md`.

AI never touches any of this. AI cannot change a price, confirm a refund, move a booking or release a hold.

---

## 5. Tax and invoicing

| # | Ask | Why it matters | Listen for |
|---|---|---|---|
| 23 | "Who issues the guest receipt — you or JosStay, or both?" | Tax and guest trust. | Written arrangement. |
| 24 | "How should VAT be shown on the room and on our commission?" | Accountant must confirm. Do not guess. | Referred to accountant. |
| 25 | "Does withholding tax apply to your payouts or our commission?" | Affects net amounts. | Written tax opinion. |
| 26 | "Can you provide a valid TIN and any VAT registration letter?" | KYC and filing. | Documents produced. |

---

## 6. Leakage and off-platform payment

| # | Ask | Why it matters | Listen for |
|---|---|---|---|
| 27 | "If a guest asks to pay you cash or by transfer directly, what will you say?" | Direct payment loses commission and breaks the guest's protection. | "We refer them to the JosStay payment link." |
| 28 | "Will you honour the JosStay price for a guest who found you here?" | Prevents bait-and-switch at the desk. | Yes, written. |
| 29 | "Do you accept walk-ins, and do you have a way to block a date when your last room is taken?" | Avoids double-booking and awkward refunds. | Yes, with a dashboard process. |
| 30 | "Are you comfortable that your phone number is only given to a guest after a confirmed booking?" | Keeps JosStay as the single contact until confirmation. | Yes. |

Suggested script for the hotel: *"For bookings that start here, please send the guest back to the JosStay payment link. It protects the price they saw and the policy they agreed. Cash on arrival can be handled under your own rules for walk-ins."*

---

## 7. Red flags on money

- Give different rates depending on the guest or the platform.
- Refuse to confirm that the price is all-in.
- Want a personal account for company money.
- Want to skip the split and be paid manually "to avoid paperwork".
- Cannot explain refunds or deposits.
- Ask JosStay to hide the commission or inflate a price to cover it.
- Demand guaranteed occupancy in exchange for the 10%.

---

## 8. Meeting record

Hotel: ____________________  Date: ____________________
Rate card attached: Yes / No  All-in confirmed: Yes / No
Commission 10% accepted: Yes / No  Paystack fee bearer accepted: Yes / No
Bank account name: ____________________  Bank: ____________________
Settlement schedule: ____________________  Statement email: ____________________
Refund recovery accepted / fee absorption decision: ___________________________
Tax questions referred to accountant: __________________________________________
Decision: Proceed / Hold  Reason: ______________________________________________

Next: `10-POLICY-QUESTIONS-FOR-HOTELS.md`, then sign the agreement and book the agent inspection.
