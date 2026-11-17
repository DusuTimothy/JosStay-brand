# JosStay — AI For Ease

**Status:** Proposed scope. No code has been changed.
**Date:** 17 November 2026

---

## 1. Why this exists

Booking a hotel in Jos is hard because of **uncertainty**, not lack of choice. The guest does not know if the place is real, if the lights stay on, what the price really is, or what happens if plans change.

AI earns its place only when it removes one of those uncertainties. Every feature below must either **save a decision**, **explain a rule**, or **catch a lie**. Anything else is decoration and is cut.

---

## 2. Guest-facing AI

### 2.1 Natural-language search — "Tell us what you need"
Input: *"quiet hotel near the university with steady power, under ₦70,000, free cancellation"*

The model outputs a **strictly typed filter object**, validated with Zod:

```ts
{ area?: string, landmark?: string, maxNightlyKobo?: number,
  power?: boolean, quiet?: boolean, policy?: "flexible"|"moderate"|"strict",
  dates?: { from, to }, guests?: number }
```

That object runs through the normal search API. The model never writes SQL and never invents a hotel. The UI shows the filters it understood so the guest can correct them: *"We understood: near university · steady power · under ₦70,000 · flexible"*.

### 2.2 "Best for you" with a reason
On results, one short generated sentence per hotel, grounded only in structured fields:
> "Good fit: verified 14 Nov, 24/7 solar, 3.2 km from the university, flexible cancellation."

No adjectives not backed by a field. No "luxury", "hidden gem" or "popular" unless data supports it.

### 2.3 Policy explainer at the decision moment
Next to the cancellation line: *"What does this mean?"* → the model explains the hotel's chosen template and the actual deadline date in plain English, then repeats: *"The hotel sets this rule. JosStay shows it before you pay."*

It never promises a refund the template does not allow.

### 2.4 WhatsApp trip assistant
After booking, the guest can ask: *"Where exactly is it?"*, *"Can I cancel?"*, *"What time is check-in?"*
Answers are grounded in that booking record: address, pin, deadline, hotel's house rules. If the answer is not in the data: **"I don't have that — let me get a JosStay person for you."** Then hand off to a human.

### 2.5 Book by chat (human + AI assist)
When a guest opens the WhatsApp *Book by chat* link, AI drafts the internal summary for the agent (hotel, dates, guests, questions asked) so the agent answers in seconds. AI does not confirm availability or take payment.

### 2.6 Review and photo summaries
Where real reviews exist: one paragraph of common themes, with the underlying reviews linked. Where they do not: show nothing. No invented social proof.

---

## 3. Operations AI

### 3.1 Policy extraction at onboarding
Hotel sends its cancellation terms (PDF, photo or text). The model extracts: deadline hours, refund percentage, check-in/out times, house rules. It proposes one of the three templates. **A human approves before publish.** The hotel confirms the extracted wording.

### 3.2 Verification report assistant
Agent uploads inspection notes and photos. AI produces a structured draft report, flags missing checklist items and highlights inconsistencies. The agent signs the final report. It cannot set `Pass` by itself.

### 3.3 Photo mismatch check
Compare the agent's on-site photos with the listing photos; flag likely mismatches for human review. A flag is a **review task**, not an automatic rejection.

### 3.4 Support triage
Classify incoming WhatsApp messages: booking question, cancellation, complaint, wrong charge, chat booking. Route to the right queue and surface the booking record to the agent. Never auto-refund.

### 3.5 Discovery by machines
Emit schema.org `Hotel` / `Product` JSON-LD with name, address, geo, price, amenities and policy on every hotel page, so search engines and AI assistants can find accurate Jos hotel data. This is "AI-ready" in the durable sense — structured data, not a chatbot.

---

## 4. Guardrails (non-negotiable)

1. **Grounded only.** Answer from structured hotel/booking data and approved policy text. No free-form invention.
2. **Typed output.** Model output is validated with Zod before it touches the database or UI.
3. **No invented facts.** No rating, review, availability, price, feature or promise that is not in a field.
4. **Show your work.** Display the filters or facts the model used; let the guest correct them.
5. **Human handoff.** One tap to a JosStay person, always visible in chat.
6. **Never on money.** AI never changes a price, confirms a refund, moves a booking status or releases a hold.
7. **Privacy.** Send the minimum PII. Do not send guest phone numbers to the model for search. Store prompts/responses only for abuse review, with retention limits.
8. **Audit.** Log model, prompt version, output and user-visible result for every AI action.
9. **Reduced-motion and no-JS parity.** Every AI feature is an enhancement; search and checkout still work without it.
10. **Disclose.** The UI says when a guest is talking to an assistant and that a human is available.

---

## 5. Model and cost

- Start with one hosted LLM with structured-output support; keep the provider behind an interface so it can be swapped.
- Cache the parsed results of common queries (e.g. "near university") in Redis.
- Cap tokens and requests per user; rate-limit the AI endpoints separately.
- Budget a fixed monthly ceiling and alert at 80%.
- Keep a deterministic fallback: if the model is unavailable, the normal filter UI still works.

---

## 6. Rollout

| Phase | AI feature | Gate |
|---|---|---|
| 1 | AI question box UI + JSON-LD | No claims beyond structured data |
| 2 | Natural-language search + policy explainer | 30 test queries reviewed for accuracy |
| 3 | WhatsApp assistant + support triage | Human handoff tested; consent captured |
| 4 | Policy extraction, photo checks, report assistant | 100% human approval before publish |

**Definition of success:** a guest reaches a confident booking decision with fewer taps and fewer questions to support — measured by search-to-booking time and repeat questions per booking.
