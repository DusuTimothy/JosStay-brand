# JosStay — Paystack Split-Refund Confirmation

**Status:** Received answer to the open question in `02`, `04`, `05` and `09`. **Support correspondence, not a contract** — confirm against Paystack's current documentation and dashboard before launch.
**Date received:** 17 November 2026
**Source:** Email from Paystack support to Timothy, in response to our question on split payments and refunds. Full email retained by Timothy.

---

## 1. What Paystack confirmed, in our words

| # | Paystack's answer | What it means for JosStay |
|---|---|---|
| 1 | While funds are still in Paystack-managed balances or subaccounts, a refund **automatically reverses the split** by deducting each party's share from its own balance. | JosStay's 10% and the hotel's 90% are both reversed automatically if no bank payout has happened yet. |
| 2 | If a recipient's share has **already been transferred to a bank account**, the automatic refund cannot undo that payout. **The main platform account covers the refund**, and we must recover the recipient's portion directly. | If the hotel has already been paid when a guest cancels, JosStay fronts the whole refund and must chase the hotel. This is a **contractual recovery problem**, not a Paystack feature. |
| 3 | Paystack does **not** facilitate recovering the hotel's share. That is reconciliation between JosStay and the hotel. | The Hotel Partner Agreement needs an explicit repayment undertaking and, where lawful, an offset right against future settlements. |
| 4 | The fees assigned at the original transaction level decide who bore them. **Processing and transaction fees are non-refundable** and are not reimbursed on refund. | On a refunded booking the Paystack fee is gone. **Decision: JosStay absorbs it** and records it as `fee_lost_kobo`. |
| 5 | When a refund is processed, **both JosStay and the customer get confirmation emails**. Guests usually see the money in **3–10 business days**, depending on payment method and bank. | Our status language stays **"refund initiated"** until completion, and we should show the 3–10 day expectation to guests. |
| 6 | Subaccounts must be **verified** before payouts. Initial payouts to new or updated unverified subaccounts may be delayed. Settlement follows regional timelines such as **T+1 or T+2**. | Verify each hotel's subaccount before publishing it. Statements must explain settlement lag; don't promise same-day payouts. |
| 7 | There is **no manual holding or releasing of funds on subaccounts**. That capability applies only to main accounts where supported. | We cannot park the hotel's money in its subaccount to cover refund risk. Recovery must come from the agreement and monitoring — not from a Paystack hold. |

---

## 2. What changes in the build

- `refunds` table gains `recovery_status`, `recovered_kobo` and `fee_lost_kobo`.
- Refund job raises a **recovery task** whenever the hotel's share was already paid out.
- Daily reconciliation flags open recovery tasks and aged ones.
- Guest-facing refund copy: *"Refund initiated. Banks usually show the amount within 3–10 business days."*
- Admin console: recovery queue with booking reference, amount, hotel, due date and status.
- Publish gate: hotel subaccount verified.
- Monthly hotel statement shows refunds and any recovery offset separately.

---

## 3. Decisions — confirmed by Timothy, 17 Nov 2026

1. **Non-refundable Paystack fee:** **JosStay absorbs it** on refunded bookings and treats it as a cost of the promise. Record the amount as `fee_lost_kobo`. Do not promise the guest a fee refund.
2. **Recovery terms:** hotel repays its share within **7 days** of written notice and authorises JosStay to offset against future settlement obligations where lawful. Counsel to draft and confirm enforceability.
3. **Guest wording approved:** "Refund initiated. Banks usually show the amount within 3–10 business days." Use on the confirmation page, in email and in WhatsApp.
4. **Hard gate approved:** a hotel's Paystack subaccount must be **verified before the hotel is published**.

---

## 4. Cross-references

- `02-BACKEND-ARCHITECTURE.md` §6 — refund implementation and reconciliation.
- `04-LEGAL-AND-POLICIES.md` §5, §8, §9 — partner agreement clauses and counsel questions.
- `05-PRODUCTION-CHECKLIST.md` §2, §7, §8 — launch gates and rehearsal.
- `09-MONEY-QUESTIONS-FOR-HOTELS.md` §4 — questions to ask the hotel.
- `10-POLICY-QUESTIONS-FOR-HOTELS.md` §3 — what we tell guests when the hotel cancels.

**Reminder:** this is support guidance, not legal or accounting advice. Verify the current position with Paystack's documentation and have counsel/accountant sign off before any refund promise goes live.
