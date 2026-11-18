# JosStay — Logo Brief: 3D House Inside a Plateau Map

**Status:** Proposed direction. Replaces "The Plateau Pin" from the current brand book.
**Date:** 17 November 2026

> The concept artwork is supplied as **`logo-concept.svg`** beside this file. It is a clean vector concept you can open in any browser or editor. It is a **direction**, not a final production master — have a designer refine the 3D shading and export locked-off files.

---

## 1. The idea

**A three-dimensional house sits inside the outline of Plateau State, and the whole mark reads as a location pin.**

| Element | Meaning |
|---|---|
| Plateau State outline | We are specifically, deeply in Jos and Plateau — not a generic national platform |
| Location-pin silhouette | Discovery, maps, finding a place |
| Isometric house | A hotel room, a stay, shelter — and the "3D" promise that you can see the place before you pay |
| Warm gold light in the doorway | A lamp left on for you; arrival, safety, hospitality |
| Deep Ocean structure | Trust and authority |
| Ivory negative space | Calm, warmth, restraint |

The mark answers the brand in one glance: *a real place, in Plateau, found through JosStay.*

---

## 2. Construction

- **Outer shape:** a pin silhouette whose shoulders follow the general outline of Plateau State. It should read as a pin at 24px and as a map at 200px. Do not draw a geographically precise outline — the silhouette must stay legible.
- **Inner field:** warm ivory, with the state outline cut into it as negative space.
- **House:** simple isometric volume — two visible walls and a roof, centred, with clear space between it and the pin edge.
- **Doorway:** a small arched cut with a muted gold fill and the faintest warm halo. The light is the only "glow" in the mark.
- **Perspective:** one consistent isometric angle (30°). No drop shadow on the house itself; one soft shadow under it at most.
- **Grid:** build on an 8-unit grid; house width ≈ 45% of the pin's inner width.

---

## 3. Colour

| Role | Colour | Hex |
|---|---|---|
| Pin / structure | Deep Ocean | `#173B4D` |
| Inner field / house wall | Warm Ivory | `#F7F4ED` |
| Roof / secondary plane | Soft Sage | `#DCE7E0` |
| Light, doorway, small accents | Muted Gold | `#B99A62` |
| Line detail (optional) | Charcoal | `#283238` |

Gold is a signal, not a fill. Use it only on the doorway light and a maximum of one tiny detail. Never colour the whole roof gold.

**Contrast note:** Ivory on Deep Ocean is high contrast and safe. Muted Gold on Ivory is **not** a text pairing — never set the wordmark or small labels in gold. Gold is a decorative accent only.

---

## 4. Wordmark and lockup

- **Wordmark:** `josstay.` — lowercase, Inter Bold, tracking −0.045em, with the full stop in Muted Gold.
- **Tagline:** `Your city, your stay.` — Inter Regular, Charcoal, used under the wordmark on large sizes only.
- **Horizontal lockup:** mark left, wordmark right, gap equal to the height of the `j` bowl.
- **Stacked lockup:** mark above wordmark; tagline below at 50% of wordmark size.
- **Reversed:** ivory mark and wordmark on Deep Ocean; the doorway becomes Deep Ocean and the gold light stays gold.
- **App icon / favicon:** the mark only, on a Deep Ocean rounded square. No wordmark, no tagline.

---

## 5. Clear space and sizes

- Clear space on all sides = the height of the wordmark's `j`.
- Full lockup: **minimum 120px wide** on screen.
- Tagline: drop below **200px** lockup width.
- Mark alone: usable down to **24px**; below that use the app-icon tile.
- Print: mark minimum 12mm; full lockup minimum 32mm.

---

## 6. Do not

- Stretch, rotate, tilt or add a second perspective to the house.
- Add a shadow, bevel or gradient to the wordmark.
- Put the mark on a busy photo without a Deep Ocean overlay.
- Use the tagline on its own next to the icon.
- Recolour the doorway light or make the roof gold.
- Use the old Plateau Pin mesa/keyhole geometry alongside this mark — replace it everywhere.

---

## 7. Files to produce

| File | Use |
|---|---|
| `logo-master.svg` | Source of truth, outlined wordmark |
| `logo-primary.svg` / `.png` (1x/2x/3x) | Header, documents |
| `logo-reversed.svg` / `.png` | Dark backgrounds, photo overlays |
| `icon-512.png`, `icon-192.png`, `favicon.ico`, `icon.svg` | App, favicon, PWA |
| `logo-onecolour.svg` | Stamps, receipts, single-colour print |
| Clear-space and minimum-size spec sheet | Internal + partner use |

Before production: convert the wordmark to outlines, test the mark at 16px, and complete CAC name/trademark checks (see `04-LEGAL-AND-POLICIES.md`).

---

## 8. Migration from the current mark

The existing site uses **"The Plateau Pin"** in `client/components/brand/logo.tsx`, plus `client/app/icon.svg` and social/OG imagery. When you approve this direction, those files need a single coordinated swap — the wordmark component, favicon, manifest icons and the brand book's Part 2. No layout changes are required; the new mark occupies the same footprint.
