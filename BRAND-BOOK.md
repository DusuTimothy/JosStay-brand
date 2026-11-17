# JosStay — Brand Identity Book

**Version 1.0 · November 2026**
**josstay.ng · Jos, Plateau State, Nigeria**

---

## 0. How to use this book

This is the operating manual for the JosStay brand. It is written to be used, not framed. Every rule here exists to protect one thing:

> **A guest should be able to book a stay in Jos without double-checking it.**

The book has six parts:

1. **Strategy & verbal identity** — who we are, what we promise, how we sound.
2. **Visual identity & logo** — the mark, its construction and its behaviour.
3. **Colour** — the two-family system, with measured contrast.
4. **Typography** — typefaces, scale, numerals and the Naira rule.
5. **UI design system** — components, layouts, motion and accessibility.
6. **Policies & launch kit** — the legal and marketing operating layer.

**Implementation status.** Everything described in Parts 1–5 is implemented in the companion Next.js app at `/home/timothy-dusu/josstay-brandbook`. The live design system is at `/styleguide`; it computes its own contrast ratios from the tokens, so it cannot drift from the code.

**Asset status.** The property photographs currently shipped are stock placeholders used to build the layout. They are **not** JosStay properties and must be replaced with the 12-photo inspection sets before launch. The WhatsApp number `+234 800 000 0000`, the RC number and the support email are placeholders. The logo is real, vector, and lives in `components/brand/logo.tsx`.

---

# Part 1 — Strategy & verbal identity

## 1.1 The business constraint that defines the brand

Two facts shape everything:

1. **Properties and hosts are never displayed publicly.** JosStay is the single intermediary and the merchant of record.
2. **Guests are booking a specific room in a specific city, often from another city, with real money and real anxiety.**

The first fact is usually treated as a UI rule: *hide the host*. That is a mistake. Airbnb's trust engine is people — host faces, bios, reviews, the promise that "a real person is behind this door." Remove people and you remove the engine.

The replacement cannot be a small badge that says "Vetted by JosStay." A badge is an assertion. Guests have been lied to by badges before.

**The replacement is evidence.**

## 1.2 The strategic reframe: JosStay is a guarantor, not a marketplace

| Marketplace model | JosStay model |
| --- | --- |
| We introduce you to a host | We contract with you directly |
| Host is responsible for the stay | JosStay is responsible for the stay |
| Trust comes from host profiles | Trust comes from inspection records |
| Disputes are between guest and host | JosStay resolves the dispute |
| The host's name is the brand | JosStay's name is the only brand |

Think **Michelin Guide**, not Craigslist. A Michelin star is credible because the inspection is named, dated and repeatable — not because the restaurant is hidden.

**Therefore the brand's central job is to out-verify the alternative, visibly.** That means:

- A dated inspection record on every listing.
- Named criteria, not adjectives ("24/7 power" means *tested with the mains off*).
- Photos shot by JosStay, never supplied by the owner.
- A guarantee written like an insurance policy, with edges.
- One support line for the whole stay.

## 1.3 Positioning

**Positioning statement**

> For travellers who need a reliable place to stay in Jos, JosStay is the verified-stay operator that inspects, photographs, manages and guarantees every property. Unlike booking directly or through a listings marketplace, JosStay is the single accountable company from search to checkout — you deal with us, not a stranger.

**One-line promise**

> Find a Jos stay you don't have to double-check.

**Functional promise**

> Checked in person. Power-tested. Photographed by us. Re-housed or refunded if it isn't as described.

**Emotional promise**

> The relief of not having to hope.

## 1.4 Audience

| Segment | What they need | What kills the booking | Message that lands |
| --- | --- | --- | --- |
| **Business traveller** (30–50, Abuja/Lagos) | Reliable power, fast Wi-Fi, a desk, a quiet night, a receipt | "Generator runs 6pm–6am" | "Power tested with the mains off. Receipt on arrival." |
| **Family / event visitor** (returning to Jos for a wedding, Christmas, burial) | 2–3 bedrooms, kitchen, parking, safety for children | A stranger's compound at night | "Gated, guard on duty, exact address after confirmation." |
| **Diaspora guest** (booking from UK/US/Canada for family) | To book remotely without being scammed | No verifiable local entity | "Merchant of record. Paystack. One support line. Refund policy in writing." |
| **Remote worker / long stay** | A month of dependable power and internet | Outages, noise, unclear pricing | "24/7 solar + inverter, tested. Fibre 50 Mbps. Nightly and monthly." |

**Primary audience for launch:** the business traveller and the family visitor. They have the highest intent and the most to lose. The diaspora guest converts on the same proof but needs a longer consideration window.

## 1.5 Brand architecture

**Masterbrand:** JosStay.

**Model:** Verified City Stays.

```
Verified City Stays (model, internal)
└── JosStay (flagship, Jos)
    ├── Stays          — the verified collection
    ├── Areas          — Rayfield, Lamingo, Little Rayfield, Bukuru, Bodija
    ├── Features       — 24/7 Power, gated security
    └── Promise        — the guarantee
```

**Why keep "JosStay" despite the city lock-in.** The name caps the total addressable market, and that is acceptable at launch. Local SEO and local trust are the moat: we know which street floods and which estate keeps the lights on. The architecture keeps the model portable — a future Abuja operation is "AbujaStay, a Verified City Stays company," not a rebrand.

**Naming rules for properties.** Name the *experience and the place*, never the owner:
- Good: *The Rayfield Garden Apartment*, *Lamingo Skyline Suite*, *Little Rayfield Courtyard*.
- Bad: *Grace's Place*, *De Boss Apartment*, *Luxury Suite 2*.

**Category naming.** *Areas* and *features* are different entities and must never be mixed in a filter rail without a separator. A guest searching "24/7 Power" is filtering on a property attribute; a guest searching "Rayfield" is filtering on a place. Conflating them confuses both the guest and Google.

## 1.6 Name, domain and legal entity

- **Brand name:** JosStay (one word, capital J, capital S).
- **Wordmark treatment:** `Jos` in ink, `Stay` in Pine 700, a single Emerald full stop. The full stop is the "confirmed" mark — it is the only place a period is part of the logo.
- **Domain:** josstay.ng (primary), josstay.com.ng (redirect).
- **Legal entity:** JosStay Hospitality Ltd.
- **Never:** "Jos Stay", "Josstay", "Jos-Stay", "JosStay.ng" in body copy.

## 1.7 Messaging pillars

Every page, ad and message should ladder to one of these three. If a claim supports none of them, delete it.

### Pillar 1 — Verified in person
**Proof:** dated inspection record, named inspector, 42-point checklist, JosStay-shot photography, re-inspection every 90 days.
**Line:** *"We've walked through it, so you don't have to."*

### Pillar 2 — De-risked essentials: power and security
**Proof:** power tested with the mains off; recorded backup duration; gate type, guard hours and CCTV checked.
**Line:** *"24/7 power, tested — not promised."*

### Pillar 3 — One accountable company
**Proof:** merchant of record, Paystack payment, single support line, written refund tiers, the Promise.
**Line:** *"You deal with us, not a stranger."*

## 1.8 Voice & tone

**Voice in one sentence:** *A well-travelled operations manager who tells you the truth, including the downside.*

We are calm, specific and slightly blunt. We do not oversell, because overselling is the exact behaviour we are replacing.

### Four principles

1. **Be specific.** Numbers, dates and names beat adjectives.
   - ✅ "Inspected 9 November 2026 by our Guest Experience team."
   - ❌ "Meticulously vetted for your peace of mind."
2. **Name the downside.** Honesty about a weak point buys credibility for the strong ones.
   - ✅ "The second bedroom shares the hall bathroom — better for children than two couples."
3. **Short sentences. Active voice.** Especially at the point of payment.
4. **Never blame the guest.** Even when the guest is wrong, the first sentence is a next step.

### Tone by context

| Context | Tone | Example |
| --- | --- | --- |
| Homepage | Confident, plain | "Find a Jos stay you don't have to double-check." |
| Listing | Factual, specific | "Power tested with the mains off. Backup runs lights, fans, Wi-Fi and the fridge." |
| Checkout | Reassuring, exact | "You won't be charged yet." / "Free cancellation until 72 hours before check-in." |
| Problem | Calm, accountable | "That shouldn't happen. Send us a photo and we'll fix it or move you." |
| Policy | Neutral, precise | "Between 72 and 24 hours before check-in, 50% of the nightly rate is refunded." |
| Social | Warm, local, never cringe | "Jos in the rainy season: cooler evenings, emptier roads, better rates." |

### Voice do / don't

| Do | Don't |
| --- | --- |
| "Verified" | "Vetted" (vague, sounds like a background check) |
| "Inspected on 9 November" | "Recently inspected" |
| "We re-house you or refund you" | "100% satisfaction guaranteed" |
| "Book" / "Reserve" | "Secure your dream getaway" |
| "Guest" | "Customer", "client", "user" |
| "Stay", "apartment", "suite" | "Listing", "unit", "product" |
| "JosStay handles it" | "The host will sort it out" |
| "₦85,000 per night" | "From only ₦85k!!!" |

## 1.9 Language system

This is a controlled vocabulary. Words shape what guests believe we are.

| Use | Avoid | Why |
| --- | --- | --- |
| **Curated booking** | Referral | "Referral" sounds like we pass you to someone else and hope. We are the merchant. *Referral is an internal commercial term only.* |
| **Guest** | Customer / user | Hospitality, not software. |
| **Stay** | Listing | "Listing" exposes the marketplace mechanics we reject. |
| **Verified** | Vetted / approved | Verification is evidence-based; vetting sounds like a secret process. |
| **Inspected** | Checked out | Inspection is a formal step with a record. |
| **Partner / property owner** | Host | "Host" implies the guest will meet them. They won't. |
| **Merchant of record** | Booking agent | Legal and payment clarity. |
| **24/7 power** *(only when tested)* | Constant power / no outage | Only claim it when the record proves it. |
| **Re-house or refund** | Satisfaction guarantee | Concrete remedy beats vague promise. |

**Internal-only terms** (never customer-facing): referral, supplier, inventory, conversion, churn, GMV, subaccount, COGS.

**Words to retire from the category:** "affordable", "luxury", "cozy", "home away from home", "hidden gem", "book now!!!". Every one of them is used by the listings we are trying to be better than.

## 1.10 Taglines & copy blocks

**Primary tagline**
> Find a Jos stay you don't have to double-check.

**Support lines** (use by context, never stack more than one)
- We check the stay, so you don't have to.
- Verified in person. Guaranteed in writing.
- 24/7 power, tested — not promised.
- One company from search to checkout.
- The photos are from the inspection. So is the price.

**Boilerplate (25 words, for bios and footers)**
> JosStay is a verified-stay operator in Jos, Plateau State. We inspect, photograph, manage and guarantee every property. You deal with us, not a stranger.

**Boilerplate (50 words)**
> JosStay is a verified-stay operator in Jos, Plateau State, Nigeria. Every apartment and hotel room is inspected in person, photographed by our team, and power-tested before it goes live. JosStay is the merchant of record, so guests deal with one accountable company from search to checkout — and are re-housed or refunded if a stay is not as described.

**Boilerplate (100 words, press)**
> JosStay is a verified-stay operator based in Jos, Plateau State, Nigeria. The company was founded on a simple observation: booking a shortlet in Nigeria usually means trusting a stranger's photographs and a phone number. JosStay instead inspects every property against a 42-point checklist, shoots its own photography, tests the power backup with the mains disconnected, and records the result on a dated inspection record attached to each listing. Property owners are suppliers and are never displayed publicly; JosStay holds the booking, processes payment through Paystack, and guarantees the stay. If a property is not as described, JosStay re-houses the guest or refunds the unused nights.

## 1.11 Elevator pitches

**10 seconds**
> JosStay is a verified shortlet operator in Jos. We inspect every property and guarantee the stay, so you deal with one company instead of a stranger.

**30 seconds**
> Finding a reliable shortlet in Jos is usually a gamble: a stranger's photos, a phone number, and a prayer. JosStay replaces that with evidence. We walk every property, photograph it ourselves, test the power with the mains off, and publish a dated inspection record. We take the payment through Paystack and we're the ones you call if something goes wrong. If it isn't as described, we re-house you or refund you.

**2 minutes** — add the business model:
> Owners give us inventory and we run it end to end: photography, pricing, guest support, payments. They're never displayed, because the guest's relationship is with us. We earn a commission on the nightly rate and a service fee from the guest. That's why we can guarantee the stay — we control the listing, the access and the resolution. We're starting in Jos because local knowledge is the moat, and the model travels to other cities once the trust is earned.

## 1.12 Proof hierarchy

When space is tight, use proof in this order:

1. **Dated inspection record** (most credible, most specific)
2. **Power test** (the local anxiety)
3. **Guarantee** (the remedy)
4. **Photos by JosStay** (visual proof)
5. **Rating and review count** (social proof, last because it is easiest to fake)

---

# Part 2 — Visual identity & logo

## 2.1 The concept: "The Plateau Pin"

One form, three readings:

1. **A location pin** — where you are going.
2. **A mesa / plateau cross-section** — the Jos highlands.
3. **Stacked terraces** — at 16px they read as a doorway, which ties the mark to "unlock / check in."

The mark avoids the two obvious clichés: a mountain range and a bed. It is abstract enough to survive a favicon and literal enough to mean "place."

## 2.2 Construction

- **Canvas:** 40 × 40 units.
- **Pin:** circle top, tapered point. Width 34 units, height 35.9 units.
- **Terrace:** three steps, centred, tallest in the middle. Sits in the lower half of the pin.
- **Keyhole:** a 1.35-unit circle punched out of the terrace base, in the pin colour.
- **Colour split:** pin in **Pine 800**, terrace in **Emerald 500**. This is the brand rule in one object: *Pine holds, Emerald signals.*

SVG geometry (source of truth: `components/brand/logo.tsx`):

```
Pin:     M20 2.5C10.6 2.5 3 10.1 3 19.5 3 29.1 14.3 35.7 20 38.4
         c5.7-2.7 17-9.3 17-18.9C37 10.1 29.4 2.5 20 2.5Z
Terrace: M12.2 26.4v-4.9h4.2v-3.6h7.2v3.6h4.2v4.9H12.2Z
Keyhole: circle cx=20 cy=29.2 r=1.35
```

## 2.3 Lockups

| Lockup | Construction | Use |
| --- | --- | --- |
| **Primary horizontal** | Mark (36px) + 10px gap + wordmark (21.6px) | Header, footer, documents |
| **Stacked** | Mark above wordmark, centred | Square placements, merchandise |
| **Mark only** | 24–56px | Favicon, app icon, social avatar, loading state |
| **Wordmark only** | `Jos` + `Stay` + emerald full stop | When the mark is already present nearby |

**Wordmark typography:** Plus Jakarta Sans ExtraBold, 21.6px, tracking −4%, `Jos` in Obsidian, `Stay` in Pine 700, full stop in Emerald 500.

## 2.4 Clear space, minimum size, placement

- **Clear space:** on all sides, equal to twice the height of the mark's inner terrace (≈ 8 units at 40px).
- **Minimum sizes:** mark 24px digital / 8mm print. Horizontal lockup 96px digital / 30mm print.
- **Backgrounds:** works on white, canvas, Pine 800–950, and photographs with a scrim of 55% or darker.
- **Do not** place the full-colour mark on Emerald 500 or on mid-tone photography.
- **Do not** outline, emboss, gradient-fill, or animate the mark except for the approved fade/scale entry.

## 2.5 Misuse

| Never | Why |
| --- | --- |
| Stretch or squash | Breaks the pin's silhouette |
| Rotate | The pin must point down |
| Recolour the terrace to white | Destroys the Pine/Emerald rule |
| Add a drop shadow | The mark is flat by design |
| Put the mark inside another shape | It becomes a generic app badge |
| Use the wordmark in all caps | "JOSSTAY" reads as a different company |
| Re-typeset the wordmark in another font | The mark and wordmark must share a skeleton |
| Use the mark smaller than 24px | The keyhole disappears and it becomes a blob |

## 2.6 App icon, favicon, social avatar

- **App icon:** 96 × 96 rounded square (22px radius), Pine 800 → Pine 950 diagonal gradient, white pin, Emerald terrace. No wordmark inside.
- **Favicon:** the mark at 32px on transparent, or the app icon at 16px.
- **Social avatar:** app icon, not the horizontal lockup — the wordmark is illegible at avatar size.
- **Open Graph:** 1200 × 630, photograph with a Pine 950 gradient scrim from the left, white headline, emerald signal dot.

## 2.7 The graphic device: terrace lines

A secondary graphic device derived from the mark's terraces: thin, horizontal contour lines that step, used at 8–12% opacity on dark surfaces and 4–6% on light. It appears on the inspection-record card, the area hero and pitch decks. It must never compete with photography or text, and never appears behind the logo.

## 2.8 Photography direction

Airbnb sells the feeling of a trip. JosStay sells certainty about a specific room. That changes the shot list.

**The 12-shot standard (per property):**

| # | Shot | Notes |
| --- | --- | --- |
| 1 | Living room, wide | Curtains open, daylight, no styling tricks |
| 2 | Living room, reverse angle | Shows the whole space, including the TV wall |
| 3 | Primary bedroom | Bed made, both bedside lamps on |
| 4 | Second bedroom | Include the wardrobe and window |
| 5 | Third bedroom (if any) | Show bed configuration honestly |
| 6 | Kitchen, wide | Counter, cooker, sink, fridge |
| 7 | Kitchen detail | Worktop and storage |
| 8 | Primary bathroom | Shower/tub, towels, water pressure note |
| 9 | Second bathroom | Show if shared |
| 10 | Balcony / outdoor | The actual view, not a crop |
| 11 | Compound / parking | Gate, guard post, parking bay |
| 12 | Entrance / building | So guests recognise arrival |

**Rules:** daylight, verticals straight, no fisheye, no HDR skies, no warm filters that hide condition, no people without consent, no stock imagery presented as the property. Re-shoot when furniture changes. Every set is dated.

## 2.9 Iconography

Lucide, 1.75px stroke, 16–20px in UI, 24px in feature rows. Icons support labels; they never replace them. The **bolt** is the only icon allowed to carry the signal colour, and only for verified power. The **shield-check** is the verification icon. Do not mix icon families.

## 2.10 Motion signature

Motion should feel like a well-made door: quick, weighted, quiet. Three curves, three durations — defined in Part 5.15. The signature moment is the shared-layout pill in the category rail and the hero gallery opening into the photo tour. Everything else is feedback, not choreography.

---

# Part 3 — Colour system

## 3.1 The rule

> **Pine holds. Emerald signals.**

- **Plateau Pine** is structural: text, primary buttons, navigation, dark surfaces, the merchant bar.
- **Electric Emerald** is instrumental: verification ticks, live dots, one signal CTA, focus rings, the plateau inside the mark.
- **Emerald never carries white text.** It fails at 1.87:1 on white and 1.98:1 for WhatsApp green. When emerald is a fill, the text on it is Obsidian (10.46:1).

This single rule resolves the tension in the original brief, which asked for an electric primary that is physically unreadable in sunlight.

## 3.2 Plateau Pine (structural)

| Step | HEX | RGB | Tailwind | Role |
| --- | --- | --- | --- | --- |
| 50 | `#F0F7F4` | `rgb(240, 247, 244)` | `bg-pine-50` | Callout backgrounds, quiet surfaces |
| 100 | `#DBEDE5` | `rgb(219, 237, 229)` | `bg-pine-100` | Hover on light pine, chart fills |
| 200 | `#B8DBCE` | `rgb(184, 219, 206)` | `border-pine-200` | Borders on verified/promise blocks |
| 300 | `#7FBFA9` | `rgb(127, 191, 169)` | `border-pine-300` | Input hover borders, dividers on pine |
| 400 | `#4A9E85` | `rgb(74, 158, 133)` | `text-pine-400` | Secondary text on dark pine |
| 500 | `#2E816A` | `rgb(46, 129, 106)` | `bg-pine-500` | Illustrative fills only |
| 600 | `#216754` | `rgb(33, 103, 84)` | `text-pine-600` | Hover text links on white |
| 700 | `#1B5345` | `rgb(27, 83, 69)` | `text-pine-700` | Eyebrows, icons, link text (8.86:1) |
| 800 | `#0B3D33` | `rgb(11, 61, 51)` | `bg-pine-800` | **Primary**: buttons, header, key surfaces (12.14:1) |
| 900 | `#072B24` | `rgb(7, 43, 36)` | `bg-pine-900` | Hover on primary, dark hero scrim |
| 950 | `#041A15` | `rgb(4, 26, 21)` | `bg-pine-950` | Deep gradients, hero base |

## 3.3 Electric Emerald (signal)

| Step | HEX | RGB | Tailwind | Role |
| --- | --- | --- | --- | --- |
| 50 | `#ECFDF5` | `rgb(236, 253, 245)` | `bg-emerald-50` | Verified badge background |
| 100 | `#D1FAE5` | `rgb(209, 250, 229)` | `bg-emerald-100` | Preview range, soft highlight |
| 200 | `#A7F3D0` | `rgb(167, 243, 208)` | `ring-emerald-200` | Badge rings |
| 300 | `#6EE7B7` | `rgb(110, 231, 183)` | `text-emerald-300` | On dark surfaces, secondary |
| 400 | `#2FE392` | `rgb(47, 227, 146)` | `text-emerald-400` | Signal text on Pine 900/950 (10.76:1) |
| 500 | `#00D97E` | `rgb(0, 217, 126)` | `bg-emerald-500` | **Signal**: ticks, dots, focus ring, one CTA |
| 600 | `#00B368` | `rgb(0, 179, 104)` | `text-emerald-600` | Icons on light backgrounds (2.75:1 — icon only, never text) |
| 700 | `#047857` | `rgb(4, 120, 87)` | `text-emerald-700` | Text-safe green accent (5.48:1) |
| 800 | `#065F46` | `rgb(6, 95, 70)` | `bg-emerald-800` | Rare; dark accent |
| 900 | `#064E3B` | `rgb(6, 78, 59)` | `bg-emerald-900` | Rare; deepest accent |

## 3.4 Ink, neutrals & semantics

| Token | HEX | RGB | Tailwind | Role |
| --- | --- | --- | --- | --- |
| Obsidian | `#0B0C0E` | `rgb(11, 12, 14)` | `text-obsidian` | Primary text, not pure black |
| Canvas | `#FAFAFA` | `rgb(250, 250, 250)` | `bg-canvas` | Page background |
| Surface | `#FFFFFF` | `rgb(255, 255, 255)` | `bg-surface` | Cards, header, sheets |
| Zinc 600 | `#52525B` | `rgb(82, 82, 91)` | `text-zinc-600` | Secondary body (7.73:1) |
| Zinc 500 | `#71717A` | `rgb(113, 113, 122)` | `text-zinc-500` | Meta text (4.83:1) |
| Zinc 400 | `#A1A1AA` | `rgb(161, 161, 170)` | `text-zinc-400` | Disabled/struck dates (2.56:1 — non-text only) |
| Zinc 300 | `#D4D4D8` | `rgb(212, 212, 216)` | `border-zinc-300` | Default control borders (1.48:1 — never text) |
| Zinc 200 | `#E4E4E7` | `rgb(228, 228, 231)` | `border-zinc-200` | Card and section borders |
| Danger | `#B42318` | `rgb(180, 35, 24)` | `text-danger` | Errors, no-refund warnings (6.57:1) |
| Warning | `#B54708` | `rgb(181, 71, 8)` | `text-warning` | Minimum-night notices (5.43:1) |
| Success | `#047857` | `rgb(4, 120, 87)` | `text-success` | Confirmed states (5.48:1) |
| Unavailable | `#A1A1AA` | `rgb(161, 161, 170)` | `text-unavailable` | Blocked dates (line/label pairing) |

## 3.5 WhatsApp functional palette

WhatsApp is a channel, not a brand colour. It appears only on WhatsApp actions.

| Token | HEX | RGB | Use |
| --- | --- | --- | --- |
| `whatsapp-ink` | `#075E54` | `rgb(7, 94, 84)` | Button fill with white text (7.67:1) |
| `whatsapp` | `#25D366` | `rgb(37, 211, 102)` | Icon or fill with **Obsidian** text only (9.87:1) |
| `whatsapp-soft` | `#E7F8EE` | `rgb(231, 248, 238)` | Light button background with ink text |

**Never** white text on `#25D366` (1.98:1). The familiar WhatsApp button in most Nigerian products is inaccessible; we use the darker ink green and keep the icon recognisable.

## 3.6 Contrast audit (measured)

Ratios are computed with WCAG 2.2 relative luminance. AA body text = 4.5:1; large text and UI boundaries = 3:1.

| Foreground | Background | Ratio | AA | Use |
| --- | --- | --- | --- | --- |
| Pine 800 `#0B3D33` | White | **12.14:1** | ✅ | Primary button fill, headings |
| White | Pine 800 | **12.14:1** | ✅ | Primary button text |
| Pine 700 `#1B5345` | White | **8.86:1** | ✅ | Eyebrows, links |
| Pine 900 `#072B24` | White | **15.22:1** | ✅ | Hero scrim base |
| Emerald 500 `#00D97E` | White | **1.87:1** | ❌ | **Banned for text** |
| Obsidian `#0B0C0E` | Emerald 500 | **10.46:1** | ✅ | Signal button text |
| Emerald 500 | Obsidian | **10.46:1** | ✅ | Signal text on dark |
| Emerald 500 | Pine 800 | **6.49:1** | ✅ | Signal text on dark pine |
| Emerald 400 `#2FE392` | Pine 950 | **10.76:1** | ✅ | Dark-surface accents |
| WhatsApp ink `#075E54` | White | **7.67:1** | ✅ | WhatsApp button text |
| WhatsApp green `#25D366` | White | **1.98:1** | ❌ | **Banned for text** |
| Obsidian | WhatsApp green | **9.87:1** | ✅ | WhatsApp chip text |
| Danger `#B42318` | White | **6.57:1** | ✅ | Errors |
| Warning `#B54708` | White | **5.43:1** | ✅ | Notices |
| Zinc 500 `#71717A` | White | **4.83:1** | ✅ | Meta text |
| Zinc 400 `#A1A1AA` | White | **2.56:1** | ❌ | Non-text only |
| Zinc 300 `#D4D4D8` | White | **1.48:1** | ❌ | **Never text or strikethrough** |

**Note on the brief.** The original specification used Zinc 300 for unavailable-date strikethrough. At 1.48:1 it is effectively invisible in daylight on a phone. The build uses Zinc 400 for the line and keeps a Zinc 500 label so the state is perceivable without relying on colour alone.

## 3.7 Proportion & pairing

**60 / 30 / 10**
- 60% white / canvas (space and photography)
- 30% ink and Pine (structure and text)
- 10% Emerald (signal) + semantic colours

**Approved pairings**

| Surface | Text | Accent |
| --- | --- | --- |
| White | Obsidian / Zinc 600 | Pine 700 links, Emerald tick |
| Canvas | Obsidian / Zinc 600 | Pine 800 cards |
| Pine 800–950 | White / white-70 | Emerald 400 |
| Emerald 50 | Pine 900 | Pine 800 |
| Emerald 500 | Obsidian | Obsidian icons |

**Banned pairings:** Emerald 500 on white text; white on Emerald 500; WhatsApp green with white text; Pine 300 text on white; any text on a photograph without a scrim.

## 3.8 Accessibility rules

- Never use colour alone to convey state (WCAG 1.4.1). Pair every colour with an icon or a word: verified = tick + text; unavailable = strikethrough + label; error = icon + message.
- Focus ring is always 2px Emerald 500 with 2px offset; on emerald surfaces use Pine 800.
- Body text minimum ratio 4.5:1; large text (≥24px or ≥19px bold) 3:1.
- Chart and rating bars must have a text value beside them.
- Test at 200% zoom and with `prefers-contrast: more` (the token layer inherits system colours for text).

## 3.9 Case study: why the original primary colour was rejected

The brief specified **Electric Emerald `#00D97E`** as the primary brand colour. Measured:

- Emerald on white: **1.87:1** — fails AA by a wide margin.
- White on emerald: **1.87:1** — the primary CTA would be unreadable in sunlight, which is exactly where guests use the site.

No amount of design confidence fixes physics. The resolution was not to abandon emerald but to demote it:

- **Pine 800** becomes primary (12.14:1).
- **Emerald 500** becomes the signal colour: never a text colour on white, never a fill with white text, always paired with Obsidian when it is a surface.

The brand keeps the electric energy at the moments that matter — a verified tick, a live availability dot, the Instant Book pulse — and keeps the money path legible.

---

# Part 4 — Typography

## 4.1 Typefaces

| Role | Family | Weights | Licence | Why |
| --- | --- | --- | --- | --- |
| Display | **Plus Jakarta Sans** | 200–800 (use 650–800) | SIL Open Font License | Geometric, warm, slightly humanist. Carries authority without hotel-formality. |
| Body / UI | **Inter** | 100–900 (use 400–600) | SIL Open Font License | Best-in-class UI legibility; tabular numerals; huge x-height for small screens. |
| Mono | System mono | — | — | Tokens, references, debug only. Never customer copy. |

Both are self-hosted in `public/fonts/` as variable WOFF2. No runtime dependency on Google Fonts.

## 4.2 The Naira rule (critical)

The Naira sign **₦ (U+20A6)** lives in the **latin-ext** subset, not latin. Both Inter and Plus Jakarta Sans declare `U+20A0-20AB` in their latin-ext `unicode-range`.

**Therefore:** every `@font-face` block must include both `latin` and `latin-ext` files with the correct `unicode-range`. Dropping latin-ext does not break the page — it silently swaps ₦ to a system fallback, so prices look subtly wrong at the exact moment of payment. The token layer loads both; do not "optimise" it away.

Both fonts also ship tabular numerals. Every price, date and count uses `.tabular` / `font-variant-numeric: tabular-nums` so figures do not shift width when they change.

## 4.3 Type scale

Fluid, clamped between 360px and 1440px viewports. Tailwind v4 tokens in `app/globals.css`.

| Token | Size | Line height | Tracking | Weight | Use |
| --- | --- | --- | --- | --- | --- |
| `text-display-hero` | `clamp(44px, ..., 72px)` | 0.98 | −3.5% | 800 | Homepage and area heroes |
| `text-display` | `clamp(36px, ..., 52px)` | 1.04 | −3% | 800 | Page titles, big statements |
| `text-title` | `clamp(28px, ..., 36px)` | 1.1 | −2.5% | 700 | Stay page `h1` |
| `text-section` | `clamp(22px, ..., 28px)` | 1.2 | −2% | 700 | Section headings |
| `text-card` | `18px` | 1.3 | −1.5% | 650 | Card and room titles |
| `text-body` | `16px` | 1.6 | 0 | 400 | Body copy |
| `text-body-sm` | `15px` | 1.55 | 0 | 400 | Supporting body, policy |
| `text-meta` | `13px` | 1.45 | 0 | 400/500 | Meta, captions, legal |
| `text-badge` | `11px` | 1.0 | +6% | 700 | Badges, uppercase labels |
| `text-price` | `24px` | 1.1 | −3% | 750 | Nightly price |

## 4.4 Hierarchy rules

1. **One `h1` per page.** On a stay page it is the property name, not "Stay details".
2. **Eyebrows are 11px, uppercase, +6–14% tracking, Pine 700 or Zinc 500.** Never more than one per section.
3. **Headings use Plus Jakarta Sans; body and UI use Inter.** Never set paragraphs in the display face.
4. **Measure:** body copy 60–75 characters. Hero subcopy max ~55 characters per line on mobile.
5. **Sentence case everywhere**, including buttons and headings. The only uppercase is eyebrow/badge text and the footer legal labels.
6. **Do not stack more than three type sizes** in a single card. Hierarchy comes from weight and colour as much as size.
7. **No justified text.** Ever.

## 4.5 Numerals & currency

- Currency: **₦**, no space, no kobo, no decimals: `₦85,000`, `₦1,200,000`.
- Never `NGN 85,000` in customer copy (legal/receipts may use `NGN`).
- Use `Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" })` and fall back to a manual `₦` + grouping if the runtime returns `NGN` instead of `₦` (`lib/format.ts` does this).
- Prices are always `.tabular`. Ratings are two decimals: `4.92`.
- Dates long-form for WhatsApp: `14 November 2026`. Compact for UI: `14 – 17 Nov 2026`.
- Night counts: `1 night` / `2 nights` — never `1 nights`.
- Quantities under ten are spelled out in prose; figures are used in tables and UI.

## 4.6 Typography don'ts

- Don't letterspace body copy.
- Don't use light weights below 18px.
- Don't use all caps for sentences longer than three words.
- Don't underline headings; underline only links.
- Don't set white body text on photography without a 55%+ scrim.
- Don't use more than one display weight per page (700 and 800 are not a pairing).

---

# Part 5 — UI design system

## 5.1 Grid & breakpoints

Mobile-first. Baseline viewport **360px**.

| Breakpoint | Min width | Columns | Gutter | Page padding |
| --- | --- | --- | --- | --- |
| base | 0 | 1 | 20px | 16px |
| `sm` | 640px | 2 | 20px | 24px |
| `md` | 768px | 2–8 | 24px | 24px |
| `lg` | 1024px | 12 | 32px | 32px |
| `xl` | 1280px | 12 | 32px | 32px |

Max content width **1280px**. Reading width for policy pages **820px**. Stay body uses a **65/35** split: `minmax(0, 1.65fr)` / `minmax(320px, 1fr)` with a 56px gap at `lg`.

Spacing base **8px** with a 4px half-step. Section rhythm: 40px mobile, 56–80px desktop.

## 5.2 Page archetypes

| Archetype | Key layout |
| --- | --- |
| **Home** | Full-bleed hero (image + Pine gradient), floating search pill, 4-col listing grid, area grid, promise/inspection panel, partner CTA |
| **Search** | Filter rail (sticky under header), listing grid, count line |
| **Area** | Editorial hero + 3 fact cards + listing grid + neighbouring areas |
| **Stay** | Bento gallery, 65/35 body, sticky booking card, availability calendar |
| **Trust / legal** | Single column, max 820px, persistent policy tabs |
| **Styleguide** | Documentation with live components and computed contrast |

## 5.3 Header & search pill

**Header:** sticky `top-0 z-50`, white 85% + backdrop blur, 1px bottom border that appears on scroll. Two states only: expanded `h-[4.5rem]` and condensed `h-14` after 24px of scroll. Two states, not a continuous animation — continuous height animation costs layout every frame.

**Search pill:** signature element.

- **Expanded:** full split pill — Where / Check-in / Check-out / Guests + circular Pine search button. Max width 1024px.
- **Condensed:** compact pill carrying the live query (`Rayfield · 14–17 Nov · 2 guests`) with a Search button. Max width 672px.
- **Sticky:** `top-[4.5rem]`, `z-40`, driven by an `IntersectionObserver` sentinel (not scroll math).
- **Mobile:** never shrinks — full-bleed and always usable.
- Field labels are 11px uppercase; values are 13px semibold. Hover fills the field's rounded segment, not the whole pill.

## 5.4 Listing card

Anatomy, in order:

1. **Photo carousel** — native CSS scroll-snap (4:3), no JS on the scroll path. 4 photos on the card, "+N" pill bottom-right.
2. **State badge** top-left: white/95 pill, Pine 800 text, Emerald tick inside a 14px circle. "JosStay Verified" or "Instant Book".
3. **Power badge** top-right of the badge row: Obsidian/85 pill, Emerald 400 text, bolt icon. Desktop only (`sm:inline-flex`).
4. **Wishlist heart** top-right: 36px circle, white/15 blur, `active:scale-90`, `aria-pressed`.
5. **Pagination dots** bottom-centre; active dot stretches to 16px.
6. **Title + rating** row; rating uses a filled star and two decimals.
7. **Meta** — area, bedrooms, sleeps.
8. **Price** — `₦85,000` in tabular 15px bold, "night" in Zinc 500.

Hover: image scales to 1.05 over 300ms. No card lift (the listing grid is a scrolling surface; lifting cards causes jitter).

## 5.5 Bento gallery (stay page)

**Desktop (≥768px)**

```
grid grid-cols-4 grid-rows-2 gap-2 h-[460px] rounded-2xl overflow-hidden

┌────────────────┬────────┬────────┐
│                │ tile 2 │ tile 3 │
│   hero 2×2     ├────────┼────────┤
│                │ tile 4 │ tile 5 │
└────────────────┴────────┴────────┘
```

- Hero: `col-span-2 row-span-2`.
- Fixed `h-[460px]` so the booking column never jumps as images load.
- Every tile is a button; hover = `brightness-90` + `scale-1.02` over 500ms. Filter/transform only.
- Hero carries a white/95 "Inspected 9 Nov 2026" badge with an emerald tick.
- "Show all 12 photos" pill, bottom-right: white, `shadow-raised`, images icon, `active:scale-[0.97]`.

**Mobile (<768px)**

- Full-width snap carousel of **all** photos (not just the bento five), `aspect-[4/3]`.
- Counter pill bottom-left: `1 / 12` in tabular digits over Obsidian/70 blur.
- "Swipe" hint bottom-right, first visit only in production.
- Tap opens the photo tour at that photo.

**Why a counter, not just dots.** Twelve photos is too many for dots to communicate depth. The counter answers "how much is here?" in one glance.

## 5.6 Photo tour

- Full-screen white dialog, `z-[80]`, body scroll locked.
- Header: room tag + `3 / 12` counter, close button (autofocus).
- Stage: Obsidian/95, `object-contain`, prev/next 44px white circles.
- Keyboard: `Escape` close, `←`/`→` navigate.
- Filmstrip grouped by room tag (Living Room, Bedrooms, Kitchen, Bathrooms, Exterior), active thumb ringed Pine 800.
- Footer line: "Shot by JosStay on inspection day. Not supplied by the property owner."
- Transition: 160–180ms cross-fade. No slide-carousel animation between photos (it delays the guest's inspection).

## 5.7 Stay detail page

Order of information is deliberate: proof before persuasion.

1. Breadcrumb.
2. Title, rating, area, verified badge, "Managed and billed by JosStay".
3. Bento gallery.
4. Manager row — "Hosted by the JosStay team", inspection date, stays hosted.
5. Four fact tiles: guests, bedrooms, beds, baths.
6. **"The JosStay take"** — an honest editorial paragraph, including the property's weak point. This is the most differentiating block on the page.
7. Three trust rows: inspected / power / security, each with a Pine icon well.
8. About this stay + merchant-of-record statement.
9. Where you'll sleep — room cards with bed size, sleeps, ensuite/shared bath, note.
10. Amenities — two groups preview + "Show all N amenities" modal.
11. Availability — inline range calendar bound to the same state as the booking card.
12. Inspection record — a `<dl>` table with dates, inspector, photos, power, security, cleanliness, open issues, plus a "Passed inspection" pill.
13. House rules & safety — two columns.
14. Neighbourhood — Pine 900 panel, area copy, "Address shared after booking" lock line.
15. Reviews summary — six sub-scores with bars and numeric values.
16. Back to all stays.

**Booking column:** `sticky top-28`, 320px minimum, `shadow-float`. On mobile the sticky card is replaced by a fixed bottom action bar (`safe-bottom`) and the calendar opens as a bottom sheet.

## 5.8 Booking widget

Anatomy:

1. **Price + rating** row. Price uses `text-price` and tabular numerals.
2. **Dates control** — two-line button (label 10px uppercase, value 13px semibold). Empty state: "Add dates" in Zinc 400.
3. **Guests control** — stepper popover limited to `stay.guests`, with `aria-label`s.
4. **Primary CTA**:
   - Dates valid → `Reserve · ₦212,000` (Pine 800).
   - No dates → `Check availability`.
   - Missing checkout → `Add check-out`.
   - Under minimum → disabled messaging via warning note.
5. **WhatsApp secondary** — soft green (`whatsapp-soft`), ink text, prefilled message containing property, dates, guests and estimated total.
6. **"You won't be charged yet."**
7. **Breakdown** — nightly × nights, cleaning fee (if any), service fee, total. Shown only when nights > 0.
8. **Minimum-night warning** — warning surface + info icon.
9. **Trust footer** — Promise line + power line.

**Rules**
- The card never shows a total for an invalid range.
- The service fee is 7% (`stay.serviceFeeRate`), rounded to the nearest naira.
- Currency always NGN, never mixed.
- The WhatsApp message is generated from live state — no hardcoded dates.
- Mobile bar repeats price + dates + one action; it is hidden while the calendar sheet is open.

## 5.9 Range calendar

Built on `react-day-picker` v10 (`mode="range"`).

**Behaviour**
- Two months side by side ≥768px; one month stacked on mobile.
- Past dates disabled.
- Owner-blocked ranges disabled **and** struck through, with a legend: "Unavailable".
- Hover preview band between check-in and hovered day (Emerald 100).
- Selected start/end are Pine 800 circles; the range band is Pine 50 with rounded ends.
- `today` has a 1px Pine 300 ring and a 3px dot; it is never filled unless selected.
- Quick chips: **This weekend**, **Next week**, **Two weeks out**. Each walks forward until it finds a window that does not overlap a blocked range — a chip must never propose an unbookable total.
- Minimum stay: **2 nights**. Enforced in the widget, stated in the calendar footer.
- Footer shows the selected range + night count, or "Pick a check-in date".
- Calendar is keyboard-navigable (react-day-picker grid semantics). Focus ring emerald.

**Do not** replace the calendar with a text input, and do not require a form submit to show availability.

## 5.10 Amenities

- Page shows the first two groups (4 items each) with a "Show all N amenities" button.
- Modal: grouped checklist, two columns on `sm`, sheet on mobile, `Escape` closes, focus moves to the close button, scroll locked.
- Every item is a phrase, not an icon-only tile. Icons support labels.

## 5.11 Footer

`bg-zinc-50`, `border-t border-zinc-200`, three link columns + brand column.

- **Brand column:** logo, 2-line description, social icons, WhatsApp chip.
- **Columns:** Support & trust / Explore Jos / Partner & company.
- **Explore Jos** contains the SEO neighbourhood links (Rayfield, Lamingo, Little Rayfield, Bukuru, 24/7 Power, all neighbourhoods).
- **Merchant bar:** "Secured by Paystack", "NDPR-compliant data handling", `₦ NGN` chip.
- **Legal bar:** © year, legal links, merchant-of-record paragraph, "Property owners are not displayed publicly."
- The footer is the last trust surface. It must never be a link farm with no narrative.

## 5.12 Component inventory

| Component | File | States |
| --- | --- | --- |
| Button | `components/ui/button.tsx` | primary, signal, secondary, ghost, quiet, whatsapp, danger; sm/md/lg/xl/icon; disabled; focus-visible; active scale |
| Badge | `components/ui/badge.tsx` | verified, instant, neutral, outline, unavailable, warning, danger; sm/md |
| Skeleton | `components/ui/skeleton.tsx` | pulse; reduced-motion off |
| Logo | `components/brand/logo.tsx` | brand, inverse, mono; mark/wordmark/lockup/app icon |
| Header | `components/layout/site-header.tsx` | expanded/condensed, mobile open/closed |
| Search pill | `components/home/search-pill.tsx` | expanded/condensed |
| Category bar | `components/home/category-bar.tsx` | active pill via shared layout; area/feature split |
| Stay card | `components/home/stay-card.tsx` | carousel index, saved/unsaved |
| Bento gallery | `components/stay/bento-gallery.tsx` | desktop grid, mobile carousel |
| Photo tour | `components/stay/photo-tour.tsx` | open/closed, keyboard |
| Booking widget | `components/stay/booking-widget.tsx` | empty/partial/valid, guests popover, calendar popover/sheet |
| Range calendar | `components/booking/range-calendar.tsx` | empty, picking, complete, hover preview |
| Amenities | `components/stay/amenities.tsx` | closed/open |
| Partner form | `components/partner/partner-form.tsx` | idle/sent |

**Button rules**
- Primary = Pine 800 / white. Hover Pine 900.
- Signal = Emerald 500 / Obsidian. Hover Emerald 400. Only one per screen.
- WhatsApp = WhatsApp ink / white. Never WhatsApp green with white text.
- `active:scale-[0.985]`; disabled opacity 45%; focus ring 2px Emerald 500 + offset.
- `type="button"` by default so a button inside a form never submits by accident.

**Badge rules**
- Always icon + word or word alone, never colour alone.
- Verified = Emerald 50 background, Pine 800 text, Emerald 200 ring.
- Instant = Pine 800 fill, white text.
- Warning/danger are the only warm surfaces; they never appear on the homepage.

## 5.13 Forms & validation

- Label above input, 12px semibold; input height 44px; 12px radius.
- Focus: Pine 600 border + 2px Emerald 500/30 ring.
- Errors: message below the field, Danger colour, icon + text, `aria-describedby`.
- Never validate on every keystroke; validate on blur and submit.
- Required fields are marked in the label, not only by colour.
- Phone inputs use `inputMode="tel"`; names use `autoComplete="name"`.
- The partner form is intentionally short: name, phone, area, bedrooms, power, notes.

## 5.14 Empty, loading, error

| State | Pattern |
| --- | --- |
| Loading listing | Skeleton card: 4:3 block, title line, meta line, price line; `animate-pulse` disabled under reduced motion |
| Empty filter | Dashed border card, plain explanation, WhatsApp fallback — never a dead end |
| No availability | Calendar shows blocked dates; effort goes into explaining *why* |
| Payment failure | Inline, next to the CTA, with the Paystack reference and a retry path. Never a toast that disappears |
| Network error | Preserve the guest's dates and guest count in state; never reset the form |

## 5.15 Motion specification

**Principle:** movement explains a change. If it doesn't explain anything, it doesn't ship.

| Token | Value | Use |
| --- | --- | --- |
| `--ease-out-expo` | `cubic-bezier(0.16, 1, 0.3, 1)` | Entrances, gallery, sheets |
| `--ease-standard` | `cubic-bezier(0.2, 0, 0, 1)` | Colour/opacity feedback |
| `--ease-spring` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Shared-layout pills, steppers |
| Fast | 120–160ms | Hover colours, focus, badge changes |
| Base | 180–240ms | Cards, popovers, dropdowns |
| Slow | 260–320ms | Sheets, photo tour, page transitions |

**Named behaviours**
- **Search pill shrink:** width/padding transition 200ms Expo, driven by an IntersectionObserver.
- **Category pill:** Framer Motion `layoutId="area-pill"`, spring stiffness 400, damping 34.
- **Card image hover:** scale 1.05, 300ms.
- **Gallery tile hover:** brightness 90 + scale 1.02, 500ms.
- **Heart:** `active:scale-90`, 200ms.
- **Booking card entry:** `fade-up` 450ms Expo, 10px translate.
- **Mobile sheets:** spring y 100% → 0, stiffness 320, damping 34.
- **Price changes:** text swaps instantly; no count-up animation. A number that animates is a number the guest can't read at the moment of decision.

**Performance rules**
- Animate only `transform`, `opacity` and `filter`. Never `height`, `top`, `width` or `box-shadow` on the scroll path.
- `will-change: transform` is applied per animated tile, then removed when idle.
- No scroll-linked layout animation.
- `prefers-reduced-motion: reduce` kills all animation and smooth scrolling globally (implemented in `globals.css`).

## 5.16 Accessibility checklist

- [x] Skip-to-content link.
- [x] One `h1` per page; ordered headings.
- [x] All interactive elements reachable by keyboard; visible focus ring.
- [x] Icon-only buttons have `aria-label`s.
- [x] Wishlist exposes `aria-pressed`.
- [x] Dialogs: `role="dialog"`, `aria-modal`, labelled, Escape closes, scroll lock, focus moved in.
- [x] Gallery images have descriptive alt text; decorative images use `alt=""`.
- [x] Calendar disables past/blocked days and announces selection in the footer.
- [x] Colour never the sole carrier of meaning.
- [x] Body contrast ≥ 4.5:1 (audited table in 3.6).
- [x] Touch targets ≥ 44px.
- [x] Motion respects `prefers-reduced-motion`.
- [ ] **Open:** manual screen-reader pass on iOS VoiceOver and Android TalkBack before launch.
- [ ] **Open:** real-device test of the calendar with large text (200%).

## 5.17 Microcopy

| Surface | Use | Not |
| --- | --- | --- |
| Empty dates | "Add dates" | "Select your desired travel period" |
| No total yet | "You won't be charged yet" | "No payment required at this time" |
| Min nights | "2-night minimum on this stay" | "Minimum stay requirement not met" |
| Blocked date | "Unavailable" | "Not available for selection" |
| Guarantee | "If it isn't as described, we re-house you or refund you" | "100% satisfaction guaranteed" |
| Power | "24/7 solar + inverter backup — tested on inspection day" | "Constant power supply" |
| Address | "Exact address and gate code are shared after your booking is confirmed" | "Address provided upon request" |
| Checkout error | "That payment didn't go through. Your dates are still held for 10 minutes. Try again or pay on WhatsApp." | "Transaction failed." |

**Capitalisation:** sentence case everywhere. **Punctuation:** full stops in full sentences, none in labels/badges. **Exclamation marks:** zero. **Emoji:** none in product UI; sparingly in social, never in a price or policy message.

## 5.18 Responsive behaviour

| Element | Mobile (<768px) | Desktop (≥768px) |
| --- | --- | --- |
| Header | Logo, search link hidden, menu button | Full nav, search link, Reserve CTA |
| Search pill | Full width, single row | Expanded split pill → condensed on scroll |
| Listing grid | 1 column | 2 (`sm`) → 4 (`lg`) |
| Bento gallery | Snap carousel, all photos, counter | 4×2 bento, 460px, hero 2×2 |
| Stay body | Single column, booking card inline | 65/35, booking card `sticky top-28` |
| Calendar | One month, bottom sheet | Two months, popover |
| Footer | Stacked columns (2-up) | Brand column + 3 columns |
| Booking CTA | Fixed bottom bar | In-card CTA |
| Photo tour | Full-screen, swipe + arrows | Full-screen, arrows + filmstrip |

---

# Part 6 — Policies & marketing launch kit

> These are customer-facing drafts. Have them reviewed by Nigerian counsel before launch. They are written to be read by a human, not to hide behind.

## 6.1 Cancellation & refund policy

**Clock:** property local check-in time, 2pm WAT.

| When the guest cancels | Nightly rate | Cleaning fee | Service fee |
| --- | --- | --- | --- |
| ≥72 hours before check-in | 100% refunded | 100% refunded | 100% refunded |
| 72–24 hours before | 50% refunded | 100% refunded | Not refunded |
| <24 hours before | No refund | No refund | No refund |
| No-show | No refund | No refund | No refund |

**The JosStay Promise overrides the tiers.** If the property is not as described, unsafe or uninhabitable — no power, no water, broken lock, different unit, material listing inaccuracy — the guest chooses a comparable re-house or a full refund of unused nights. No timing argument.

**Changes:** one free date change ≥72 hours before check-in, subject to availability and any rate difference. Inside 72 hours, treated as cancellation + rebooking.

**Force majeure:** government restriction, civil unrest or natural disaster → credit valid 12 months or refund of unused nights, even inside 24 hours.

**Refund mechanics (Paystack-verified):**
- JosStay approves and initiates within 24 hours.
- Paystack processes refunds **asynchronously**. A refund marked `processed` can still take **up to 10 business days** to appear, depending on the bank.
- Refund references are 8–64 characters, unique per environment.
- Communicate the 10-day window at the moment of cancellation, not after the guest chases.

## 6.2 Guest house rules & ID policy

**Check-in / out:** from 2pm; out by 11am, unless agreed in writing.

**ID:** the lead guest presents a valid government ID (NIN slip, driver's licence, passport or voter's card) before access is released. Every additional adult staying overnight is registered by name. IDs are not shared with property owners, are stored for 12 months, then deleted.

**Occupancy:** never exceed the listed maximum. Day visitors leave by 10pm and do not use beds. Sub-letting is prohibited.

**Noise:** quiet hours 10pm–7am. No parties, events or commercial filming without written approval and a fee. Repeated complaints = removal without refund.

**Smoking / pets / substances:** no indoor smoking or vaping (cleaning surcharge applies); no pets unless listed; illegal substances → police.

**Property & power:** do not tamper with the inverter, solar, generator or meters. Do not move furniture between rooms or remove linen/appliances. Report accidental damage before checkout — concealed damage is a breach.

**Safety:** keep the gate closed; do not disable CCTV or smoke alarms. Call the JosStay line first in an emergency.

**Removal:** immediate, without refund, for violence or threats, illegal activity, exceeding occupancy, damage, or repeated noise complaints.

## 6.3 Privacy & NDPR statement

**Controller:** JosStay Hospitality Ltd.

**Collected:** name, phone, email; lead-guest government ID (verification only); booking details; Paystack transaction reference and amount (never card numbers); WhatsApp/email messages; aggregate device data.

**Purposes:** deliver the booking, verify identity, process payment/refunds, meet tax and anti-fraud obligations, support the stay, and — only with opt-in — marketing.

**Never:** publish owner details, sell data, share guest ID or phone with owners, or add a guest to marketing because they booked.

**Processors:** Paystack (payments), Brevo (email), Meta/WhatsApp (messaging), hosting/database providers, and authorities where legally required.

**Retention:** booking/payment 7 years; ID verification 12 months post-checkout; support 24 months; marketing preferences until withdrawn.

**Rights:** access, correction, deletion where lawful, withdrawal of consent. privacy@josstay.ng, response within 30 days. Complaints to the NDPC.

**Security:** TLS 1.2+ in transit, encryption at rest, role-limited logged access, no card data on JosStay servers.

## 6.4 Partner terms (summary)

- **Model:** owners are suppliers; JosStay is merchant of record and manages the guest relationship.
- **Split (2026 season):** owner 70% of nightly rate; JosStay 30%; cleaning fee passed through in full; guest service fee retained by JosStay.
- **Settlement:** every 7 days to a Nigerian bank account.
- **Exclusivity:** dates blocked for JosStay must not be sold on another platform (no double-selling).
- **Standards:** working lock, running water, tested power backup, linen and furnishing that match the inspection photos.
- **Access:** permission to photograph and re-inspect every 90 days; a named local contact on site within 30 minutes for emergencies.
- **Term:** no listing fee; no lock-in beyond the first 90 days.
- **Never:** publish owner name, phone or exact address; take a fee before the first booking.

## 6.5 Merchant-of-record & trust copy

Use verbatim in the footer, receipts and checkout:

> JosStay is the merchant of record for every booking made on josstay.ng. Payments are processed by Paystack. Property owners are not displayed publicly; all bookings, payments and support are handled by JosStay.

Short form (badge/tooltip):

> Managed and billed by JosStay. You never deal with the property owner.

## 6.6 WhatsApp playbook

**Number:** +234 800 000 0000 (placeholder — replace before launch).
**Hours:** 8am–9pm WAT daily; automated acknowledgement outside hours.

**Business profile:** name JosStay, category "Travel & Transportation", description "Verified stays in Jos. Inspected, photographed and guaranteed.", address Jos, Plateau State, website josstay.ng.

**Auto-greeting (first inbound message):**

> Hi 👋 Welcome to JosStay. You're through to the booking team.
>
> To check a stay, send us:
> 1. Your dates
> 2. Number of guests
> 3. Area (Rayfield, Lamingo, Little Rayfield, Bukuru, Bodija)
>
> Or browse verified stays: josstay.ng
>
> We reply within 15 minutes, 8am–9pm WAT.

**Away message (outside hours):**

> Thanks for messaging JosStay. We're closed until 8am WAT. If you have a booking in progress tonight, reply URGENT and we'll call you back.

**Template strategy (Meta rules):** outside the 24-hour customer-service window, only approved templates can be sent. Categories: `utility` for booking/check-in/receipts, `marketing` for offers (opt-in only), `authentication` for OTP.

**Utility templates to submit**

1. **Booking confirmed**
   > Hi {{1}}, your JosStay booking is confirmed. Ref {{2}}. {{3}} in {{4}}, {{5}}–{{6}}, {{7}} guests. Total {{8}}. Check-in instructions will follow 24 hours before arrival. — JosStay
2. **Check-in instructions**
   > Hi {{1}}, check-in today is from 2pm. Address: {{2}}. Gate code: {{3}}. Your contact is the JosStay line — reply here. Please have the lead guest's ID ready.
3. **Post-stay review request**
   > Hi {{1}}, thanks for staying at {{2}}. How was it? Reply with a score 1–5 and one line we can learn from. If something was wrong, tell us here and we'll fix it.

**Quick replies:** "Availability", "View a stay", "Cancellation policy", "Speak to a human", "I have a problem".

**Rules:** never send a marketing template to a guest who booked within the last 24 hours without opt-in; never quote a price without dates; always include the booking reference; move payment to the site/Paystack, never a personal account.

## 6.7 Social bios

**Instagram**
> Verified stays in Jos, Plateau State. We inspect, photograph and guarantee every property — 24/7 power checked with the mains off. Book at josstay.ng ↓

**X / Twitter**
> Verified shortlets & hotel rooms in Jos. Inspected in person. Power-tested. Re-housed or refunded if it isn't as described. josstay.ng

**Facebook**
> JosStay is a verified-stay operator in Jos. Every apartment and hotel room is inspected by our team and backed by the JosStay Promise. One company from search to checkout. Book at josstay.ng.

**LinkedIn**
> JosStay is a verified-stay operator in Jos, Plateau State. We inspect, photograph, manage and guarantee shortlets and hotel rooms, acting as merchant of record so guests deal with one accountable company. Property owners are suppliers and are never displayed publicly.

**TikTok**
> The stay you don't have to double-check. Jos, Nigeria. 🏔️

## 6.8 Launch posts (3)

**Post 1 — The problem, stated plainly**

Visual: split screen. Left: a blurry WhatsApp-forwarded room photo with the caption "This is what you're usually sent." Right: a clean JosStay inspection record with a dated photo.
Caption:
> Booking a shortlet in Nigeria usually means trusting a photo someone forwarded and a phone number that might go quiet.
>
> We built JosStay to remove that moment.
>
> Every property is walked through by our team, photographed by us, and power-tested with the mains off. The inspection record is on the listing, dated.
>
> If it isn't as described, we re-house you or refund you.
>
> Verified stays in Jos → josstay.ng
>
> #JosStay #Jos #PlateauState #ShortletsNigeria

**Post 2 — The power claim**

Visual: a short Reel. Mains switch goes off; lights, fan, Wi-Fi router and fridge stay on. Overlay text: "24/7 power means tested. Not promised."
Caption:
> "24/7 power" is the most abused phrase in Nigerian shortlet listings.
>
> So we test it. Our inspector switches off the public supply and records what actually stays on: lights, fans, Wi-Fi, the fridge — sometimes the AC.
>
> You'll find that record on every listing, with the date.
>
> That's the whole product: fewer surprises.
>
> Browse 24/7 power stays → josstay.ng/jos/24-7-power
>
> #JosStay #24HourPower #Jos #VerifiedStay

**Post 3 — The guarantee**

Visual: a clean white card on Pine 900. Headline: "If it isn't as described, we fix it or refund it." Small print: "Re-housed or refunded. Your choice."
Caption:
> Most guarantees are written to sound good. Ours is written to be used.
>
> If the property is materially different from the listing, unsafe or uninhabitable — no power, no water, a broken lock, a different unit — tell us within two hours of check-in.
>
> We move you to a comparable JosStay at no extra cost, or refund the unused nights in full. The normal cancellation tiers don't apply.
>
> One company from search to checkout. That's the point.
>
> Read the Promise → josstay.ng/promise
>
> #JosStay #Jos #TravelNigeria #Plateau

## 6.9 WhatsApp broadcast & launch email

**WhatsApp broadcast (opt-in list only, marketing template):**

> JosStay is live 🏔️
>
> Verified shortlets and hotel rooms in Jos — inspected in person, photographed by us, power-tested with the mains off.
>
> Launch offer: 10% off your first 2-night stay with code **JOS10**.
>
> Browse: josstay.ng
> Reply STOP to opt out.

**Launch email (subject: "A Jos stay you don't have to double-check")**

> Hi {{first_name}},
>
> Finding a reliable shortlet in Jos usually means trusting a stranger's photos and hoping the power stays on.
>
> JosStay is the alternative. We inspect every property, shoot the photos ourselves, test the power with the mains off, and put the dated record on the listing. If it isn't as described, we re-house you or refund you.
>
> We're live in Rayfield, Lamingo, Little Rayfield, Bukuru and Bodija, with 24/7-power stays filterable from day one.
>
> **Launch offer:** 10% off your first 2-night stay with code JOS10.
>
> [Browse verified stays →]
>
> — The JosStay team

## 6.10 SEO & metadata

| Page | Title | Meta description |
| --- | --- | --- |
| Home | JosStay — Verified stays in Jos | Every JosStay is checked before it goes live: photographed by us, power-verified, and backed by the JosStay Promise. Book shortlets and hotel rooms in Jos. |
| Area | Stays in {Area}, Jos · JosStay | Verified shortlets and hotel rooms in {Area}. Inspected in person, power-tested, with the inspection record on every listing. |
| Stay | {Name} — {Area}, Jos · JosStay | {Tagline}. {Bedrooms} bedrooms, sleeps {guests}. {Power}. Inspected and managed by JosStay. |
| 24/7 Power | Stays with 24/7 power in Jos · JosStay | Power tested with the mains off. Verified solar and inverter stays in Jos, with the dated inspection record on every listing. |
| Promise | The JosStay Promise · JosStay | How we verify every property and what happens if it isn't as described. Re-housed or refunded. |
| List your property | List your property · JosStay | We handle photography, inspection, pricing and payments. Your name is never published. Apply for an inspection. |

**Structured data:** use `LodgingBusiness` for stays, `Place` for areas, `FAQPage` for help, `Organization` + `WebSite` on home. Never use `AggregateRating` unless the reviews are verifiable.

**Keyword clusters:** Jos shortlets, Jos apartments, Rayfield shortlet, Lamingo apartments, Bukuru hotels, 24/7 power stays Jos, Jos accommodation, shortlet in Jos.

## 6.11 Launch checklist

**Before launch**
- [ ] Replace all placeholder photography with 12-shot inspection sets.
- [ ] Replace placeholder phone number, support email and RC number.
- [ ] Legal review of terms, privacy, cancellation and house rules.
- [ ] Paystack live keys + webhook verification; test a real refund end to end.
- [ ] WhatsApp Business verification; submit the three utility templates.
- [ ] Screen-reader and 200%-zoom pass on the stay page and calendar.
- [x] 404 page, favicon, sitemap and robots.
- [ ] Open Graph image (1200 × 630) — spec in 2.6, asset not yet produced.
- [ ] Analytics and conversion events (search, view stay, dates selected, checkout started, paid).
- [ ] Confirm NDPR data-retention jobs (ID 12 months, support 24 months).

**Week 1**
- [ ] Publish the three launch posts; pin Post 1.
- [ ] Send the launch email; enable the WhatsApp broadcast to opt-ins only.
- [ ] Publish the five area pages; submit the sitemap.
- [ ] Onboard 5 partner properties for the first month.
- [ ] Manually inspect the first 10 bookings' messages for tone drift.

**Ongoing**
- [ ] Re-inspect every property at 90 days; update the record date.
- [ ] Review Promise claims weekly; a repeat cause is a checklist failure, not a guest failure.
- [ ] Re-shoot any property whose furniture changes.
- [ ] Audit contrast and keyboard flow whenever a new component ships.

## 6.12 KPIs

| Metric | Target (first 90 days) |
| --- | --- |
| Search → stay viewed | ≥ 45% |
| Stay viewed → dates selected | ≥ 35% |
| Dates selected → checkout started | ≥ 25% |
| Checkout started → paid | ≥ 60% |
| Inspection pass rate (first visit) | 40–60% (a high pass rate means the checklist is too soft) |
| Promise claims per 100 stays | < 2 |
| Support first response | < 15 min in hours |
| Review score | ≥ 4.8 |
| Repeat / direct booking share | ≥ 20% by month 6 |

---

# Part 7 — Implementation notes

## 7.1 Project

- Location: `/home/timothy-dusu/josstay-brandbook`
- Stack: Next.js 16.4.5 (App Router, Turbopack), React 19.2, Tailwind CSS 4.3.5, Framer Motion 14.13, react-day-picker 10.0.2, lucide-react.
- Dev: `npm run dev` → http://localhost:4300
- Build: `npm run build`
- Typecheck: `npm run typecheck`
- Dependencies were installed **offline** from the local npm cache. Do not run a networked `npm install` without `--offline`; the registry connection is unreliable on this machine.

## 7.2 Key files

| Concern | File |
| --- | --- |
| Design tokens (colour, type, radius, shadow, motion) | `app/globals.css` |
| Fonts (self-hosted, latin + latin-ext) | `public/fonts/*.woff2`, `app/globals.css` |
| Logo, wordmark, app icon | `components/brand/logo.tsx` |
| Formatting (₦, dates, nights) | `lib/format.ts` |
| Contrast maths used by the styleguide | `lib/contrast.ts` |
| Stay / photo / room data model | `lib/data.ts` |
| Booking state (single source of truth) | `components/booking/booking-provider.tsx` |
| Range calendar | `components/booking/range-calendar.tsx` |
| Bento gallery + photo tour | `components/stay/*` |
| Booking widget | `components/stay/booking-widget.tsx` |
| Live design system | `app/styleguide/page.tsx` |
| Policies | `app/legal/[slug]/page.tsx` |
| Promise page | `app/promise/page.tsx` |

## 7.3 Routes

```
/                               Home
/search                         Search + filters
/jos                            Neighbourhood index
/jos/[area]                     Rayfield, Lamingo, Little Rayfield, Bukuru, Bodija, 24-7-power
/stays/[slug]                   Four sample stays
/promise                        Verification + guarantee
/help                           FAQ + report a problem
/about                          Company, careers, press
/list-your-property             Partner intake
/legal/terms | /privacy | /cancellation | /house-rules
/styleguide                     Live design system
/not-found                      404 with a WhatsApp fallback
/sitemap.xml · /robots.txt      21 URLs; /search and /styleguide noindexed
/icon.svg                       Favicon / app mark
```

## 7.4 Token quick reference

```css
/* Colour */
--color-pine-800: #0B3D33;      /* primary */
--color-emerald-500: #00D97E;   /* signal */
--color-obsidian: #0B0C0E;
--color-canvas: #FAFAFA;

/* Type */
--text-display-hero: clamp(2.75rem, 2rem + 4.2vw, 4.5rem);
--text-body: 1rem;
--text-price: 1.5rem;

/* Motion */
--ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
```

## 7.5 Known limitations

1. **Photography is placeholder stock.** The model cannot verify image content; every image must be replaced with a real JosStay inspection set. See the 12-shot standard in 2.8.
2. **No backend in this build.** Bookings, payments, WhatsApp sending and partner intake are front-end demonstrations. Paystack, Brevo, WhatsApp Business API and the database are specified but not wired.
3. **Calendar availability is static sample data** (`stay.unavailable`). Production must read live inventory and hold dates transactionally.
4. **WhatsApp number, emails and RC number are placeholders.**
5. **Accessibility:** automated structure and contrast are in place; manual screen-reader and large-text passes are still required (listed in 5.16).
6. **No dark mode** — deliberate. The brand's photography and Pine surfaces are designed for light mode; a dark theme would need a separate token pass.
7. **`next/image` dev warnings** for the hidden mobile carousel are cosmetic and do not affect production output.

---

# Part 8 — Decisions log: what changed from the original brief and why

This section exists so the reasoning survives the next redesign.

| # | Brief asked for | Decision | Reason |
| --- | --- | --- | --- |
| 1 | Electric Emerald as primary | Pine 800 primary; Emerald as signal | Emerald on white is 1.87:1 — the primary CTA would fail WCAG AA |
| 2 | Hide hosts behind a "Verified" badge | Reframe JosStay as a guarantor with an inspection record + guarantee | A badge asserts; a dated record proves. Airbnb's trust engine is people, so the replacement must be evidence |
| 3 | "Referral platform" in customer copy | "Curated booking"; referral stays internal | "Referral" signals hand-off and risk; we are the merchant of record |
| 4 | "24/7 Power" as a nav chip | First-class, verified property with a test record | Power is one of the two real anxieties in Jos; discovery is not the problem |
| 5 | A shortlet marketplace aesthetic | Photo-first, app-like, mobile-first | The audience books on a phone, often on mobile data, often in a hurry |
| 6 | Zinc 300 strikethrough for unavailable dates | Zinc 400 line + Zinc 500 label + "Unavailable" legend | Zinc 300 is 1.48:1 and effectively invisible |
| 7 | WhatsApp green for buttons | WhatsApp ink `#075E54` with white text | White on `#25D366` is 1.98:1 |
| 8 | Generic "luxury" copy | Specific, downside-naming copy | Specificity is the differentiator; overselling is the behaviour we replace |
| 9 | Continuous scroll header animation | Two-state header (expanded/condensed) | Continuous height animation forces layout every frame |
| 10 | One flat photo grid | 5-photo bento (desktop) + full 12-photo carousel (mobile) with counter | Bento sells the space; the counter tells the guest how much proof exists |

---

*End of Brand Identity Book v1.0. Maintained alongside the codebase — when a token changes, `/styleguide` updates itself.*
