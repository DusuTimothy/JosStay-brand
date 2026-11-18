import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  X,
  Zap,
  ShieldCheck,
  Search,
  MapPin,
  CalendarDays,
  Users,
  Star,
  Heart,
  Images,
  Sun,
  Moon,
} from "lucide-react";
import { Logo, LogoMark, Wordmark, AppIcon } from "@/components/brand/logo";
import { Button, buttonClasses } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { contrast, rgbLabel, hslLabel, wcag } from "@/lib/contrast";
import { naira } from "@/lib/format";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Design system & brand book",
  description:
    "The JosStay visual language: Plateau Pine and Electric Emerald, Plus Jakarta Sans and Inter, components, motion and accessibility rules.",
};

const PINE = [
  ["50", "#f0f7f4"],
  ["100", "#dbede5"],
  ["200", "#b8dbce"],
  ["300", "#7fbfa9"],
  ["400", "#4a9e85"],
  ["500", "#2e816a"],
  ["600", "#216754"],
  ["700", "#1b5345"],
  ["800", "#0b3d33"],
  ["900", "#072b24"],
  ["950", "#041a15"],
];

const EMERALD = [
  ["50", "#ecfdf5"],
  ["100", "#d1fae5"],
  ["200", "#a7f3d0"],
  ["300", "#6ee7b7"],
  ["400", "#2fe392"],
  ["500", "#00d97e"],
  ["600", "#00b368"],
  ["700", "#047857"],
  ["800", "#065f46"],
  ["900", "#064e3b"],
];

const SEMANTIC = [
  ["Obsidian", "#0b0c0e", "text-obsidian"],
  ["Canvas", "#fafafa", "bg-canvas"],
  ["Surface", "#ffffff", "bg-surface"],
  ["Danger", "#b42318", "text-danger"],
  ["Warning", "#b54708", "text-warning"],
  ["Success", "#047857", "text-success"],
  ["Unavailable", "#a1a1aa", "text-unavailable"],
  ["WhatsApp ink", "#075e54", "text-whatsapp-ink"],
  ["WhatsApp green", "#25d366", "text-whatsapp"],
];

const CONTRAST_PAIRS: { fg: string; bg: string; label: string; use: string }[] = [
  { fg: "#0B3D33", bg: "#FFFFFF", label: "Pine 800 on white", use: "Primary button fill / body headings" },
  { fg: "#FFFFFF", bg: "#0B3D33", label: "White on Pine 800", use: "Primary button label" },
  { fg: "#00D97E", bg: "#FFFFFF", label: "Emerald 500 on white", use: "Never for text — fails" },
  { fg: "#0B0C0E", bg: "#00D97E", label: "Obsidian on Emerald 500", use: "Signal button label" },
  { fg: "#00D97E", bg: "#0B0C0E", label: "Emerald 500 on Obsidian", use: "Dark-surface signal text" },
  { fg: "#00D97E", bg: "#0B3D33", label: "Emerald 500 on Pine 800", use: "Dark cards, inspection record" },
  { fg: "#FFFFFF", bg: "#075E54", label: "White on WhatsApp ink", use: "WhatsApp button" },
  { fg: "#25D366", bg: "#FFFFFF", label: "WhatsApp green on white", use: "Never for text — fails" },
  { fg: "#0B0C0E", bg: "#25D366", label: "Obsidian on WhatsApp green", use: "WhatsApp light chip" },
  { fg: "#B42318", bg: "#FFFFFF", label: "Danger on white", use: "Errors, no-refund warnings" },
  { fg: "#B54708", bg: "#FFFFFF", label: "Warning on white", use: "Minimum-night notices" },
  { fg: "#D4D4D8", bg: "#FFFFFF", label: "Zinc 300 on white", use: "Never for text — fails" },
];

const TYPE_SPECIMENS = [
  ["text-display-hero", "Find a Jos stay you don't have to double-check.", "Hero — 44/72px, 800, -3.5%"],
  ["text-display", "We check the stay, so you don't have to.", "Display — 36/52px, 800, -3%"],
  ["text-title", "The Rayfield Garden Apartment", "Page title — 28/36px, 700, -2.5%"],
  ["text-section", "Where you'll sleep", "Section — 22/28px, 700, -2%"],
  ["text-card", "Lamingo Skyline Suite", "Card title — 18px, 650, -1.5%"],
  ["text-body", "Every real listing will be inspected, photographed and power-tested before it goes live.", "Body — 16px / 1.6"],
  ["text-body-sm", "Exact address and gate code are shared after your booking is confirmed.", "Body small — 15px / 1.55"],
  ["text-meta", "Not inspected — demo listing", "Meta — 13px / 1.45"],
];

export default function StyleguidePage() {
  return (
    <div className="mx-auto max-w-[1080px] px-4 pb-24 pt-10 sm:px-6 lg:px-8">
      {/* ------------------------------------------------------------- Masthead */}
      <header>
        <p className="text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-pine-700">
          JosStay · Design system v1.0
        </p>
        <h1 className="mt-3 max-w-3xl text-display-hero text-obsidian">
          One rule, applied everywhere.
        </h1>
        <p className="mt-4 max-w-2xl text-body text-zinc-600">
          <strong className="font-semibold text-obsidian">Pine holds. Emerald signals.</strong>{" "}
          Everything structural — text, primary actions, navigation, the merchant
          bar — is Plateau Pine or ink. Electric Emerald never carries white text;
          it marks verification, live state and the one action we want the guest
          to take next.
        </p>
        <div className="mt-6 flex flex-wrap gap-2 text-[0.75rem]">
          {[
            "WCAG 2.2 AA minimum",
            "Mobile-first, 360px baseline",
            "GPU-only animation",
            "₦ glyph guaranteed in latin-ext",
          ].map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-zinc-300 bg-white px-2.5 py-1 font-medium text-zinc-600"
            >
              {tag}
            </span>
          ))}
        </div>
      </header>

      <nav aria-label="Contents" className="mt-10 rounded-xl border border-zinc-200 bg-white p-4">
        <p className="text-[0.6875rem] font-bold uppercase tracking-[0.1em] text-zinc-500">
          Contents
        </p>
        <ol className="mt-2 grid gap-2 text-[0.8125rem] sm:grid-cols-2">
          {[
            ["#logo", "1 · Logo & mark"],
            ["#colour", "2 · Colour system"],
            ["#contrast", "3 · Contrast audit"],
            ["#type", "4 · Typography"],
            ["#space", "5 · Space, radius, elevation"],
            ["#components", "6 · Components"],
            ["#motion", "7 · Motion"],
            ["#imagery", "8 · Imagery & iconography"],
          ].map(([href, label]) => (
            <li key={href}>
              <a
                href={href}
                className="font-medium text-pine-800 underline-offset-4 hover:underline"
              >
                {label}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      {/* ---------------------------------------------------------------- Logo */}
      <Section
        id="logo"
        kicker="01 · Identity"
        title="The Plateau Pin"
        intro="A location pin read as a mesa cross-section. Three terraces inside the pin form a doorway at 16px. Pine is the pin; emerald is the plateau. The mark works because it says both 'here' and 'high ground' without drawing a mountain cliché."
      >
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-zinc-200 bg-white p-8">
            <Logo />
            <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-zinc-400">
              Primary lockup
            </p>
          </div>
          <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-zinc-200 bg-pine-900 p-8">
            <Logo tone="inverse" />
            <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-white/45">
              Inverse
            </p>
          </div>
          <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-zinc-200 bg-white p-8">
            <div className="flex items-end gap-5">
              <LogoMark className="h-6 w-6" />
              <LogoMark className="h-9 w-9" />
              <LogoMark className="h-14 w-14" />
            </div>
            <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-zinc-400">
              24 / 36 / 56px
            </p>
          </div>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-[1fr_1.2fr]">
          <div className="rounded-xl border border-zinc-200 bg-white p-5">
            <p className="text-[0.6875rem] font-bold uppercase tracking-[0.08em] text-zinc-500">
              App icon
            </p>
            <div className="mt-3 flex items-center gap-4">
              <AppIcon size={72} />
              <div>
                <Wordmark />
                <p className="mt-1 text-[0.75rem] text-zinc-500">
                  Pine 800 → Pine 950 gradient. Emerald terrace. No wordmark
                  inside the icon.
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-white p-5">
            <p className="text-[0.6875rem] font-bold uppercase tracking-[0.08em] text-zinc-500">
              Clear space & minimum size
            </p>
            <ul className="mt-2 space-y-1.5 text-[0.8125rem] text-zinc-600">
              <li>Clear space on all sides = height of the mark's inner terrace ×2.</li>
              <li>Minimum digital size: 24px mark, 96px lockup.</li>
              <li>Never place the mark on a photo without a scrim at 55% or darker.</li>
              <li>Never re-colour the mark outside pine / emerald / white / obsidian.</li>
            </ul>
          </div>
        </div>
      </Section>

      {/* -------------------------------------------------------------- Colour */}
      <Section
        id="colour"
        kicker="02 · Colour"
        title="Two families, one hierarchy"
        intro="Plateau Pine is the brand's spine: 12.14:1 on white, so it can carry text and primary actions without a second thought. Electric Emerald is an instrument light — it marks what is verified, live or next. It is never a text colour on white, and never a button fill with white text."
      >
        <h3 className="text-[0.8125rem] font-bold uppercase tracking-[0.08em] text-zinc-500">
          Plateau Pine — structural
        </h3>
        <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-6 lg:grid-cols-11">
          {PINE.map(([step, hex]) => (
            <Swatch key={step} step={step} hex={hex} token={`pine-${step}`} />
          ))}
        </div>

        <h3 className="mt-8 text-[0.8125rem] font-bold uppercase tracking-[0.08em] text-zinc-500">
          Electric Emerald — signal
        </h3>
        <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-5 lg:grid-cols-10">
          {EMERALD.map(([step, hex]) => (
            <Swatch key={step} step={step} hex={hex} token={`emerald-${step}`} />
          ))}
        </div>

        <h3 className="mt-8 text-[0.8125rem] font-bold uppercase tracking-[0.08em] text-zinc-500">
          Ink & semantic
        </h3>
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-3">
          {SEMANTIC.map(([name, hex, token]) => (
            <div key={name} className="overflow-hidden rounded-lg border border-zinc-200 bg-white">
              <div className="h-16 w-full" style={{ backgroundColor: hex }} />
              <div className="px-2.5 py-2">
                <p className="text-[0.75rem] font-semibold text-obsidian">{name}</p>
                <p className="mt-0.5 text-[0.625rem] text-zinc-500 tabular">{hex.toUpperCase()}</p>
                <p className="mt-0.5 font-mono text-[0.625rem] text-zinc-400">{token}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <UsageCard
            tone="pine"
            title="Pine is for structure"
            items={[
              "All body text and headings",
              "Primary buttons and links",
              "Header, footer, merchant bar",
              "Inspection record surfaces",
            ]}
          />
          <UsageCard
            tone="emerald"
            title="Emerald is for state"
            items={[
              "Verification ticks and pass badges",
              "Live / available dots",
              "One signal CTA per screen, obsidian text",
              "Never emerald text on white",
            ]}
          />
        </div>
      </Section>

      {/* ------------------------------------------------------------ Contrast */}
      <Section
        id="contrast"
        kicker="03 · Accessibility"
        title="The ratios, computed live"
        intro="These numbers are calculated from the tokens above on every render — not copied from a PDF. AA body text needs 4.5:1; large text and UI boundaries need 3:1."
      >
        <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50">
                <th className="px-4 py-2.5 text-[0.6875rem] font-bold uppercase tracking-[0.06em] text-zinc-500">
                  Pair
                </th>
                <th className="px-4 py-2.5 text-[0.6875rem] font-bold uppercase tracking-[0.06em] text-zinc-500">
                  Use
                </th>
                <th className="px-4 py-2.5 text-right text-[0.6875rem] font-bold uppercase tracking-[0.06em] text-zinc-500">
                  Ratio
                </th>
                <th className="px-4 py-2.5 text-right text-[0.6875rem] font-bold uppercase tracking-[0.06em] text-zinc-500">
                  AA
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {CONTRAST_PAIRS.map((pair) => {
                const ratio = contrast(pair.fg, pair.bg);
                const pass = wcag(ratio);
                return (
                  <tr key={pair.label}>
                    <td className="px-4 py-2.5">
                      <span className="inline-flex items-center gap-2">
                        <span
                          className="inline-flex size-6 items-center justify-center rounded-md border border-zinc-200 text-[0.625rem] font-bold"
                          style={{ backgroundColor: pair.bg, color: pair.fg }}
                          aria-hidden="true"
                        >
                          Aa
                        </span>
                        <span className="text-[0.8125rem] font-medium text-obsidian">
                          {pair.label}
                        </span>
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-[0.75rem] text-zinc-500">{pair.use}</td>
                    <td className="px-4 py-2.5 text-right text-[0.8125rem] font-semibold text-obsidian tabular">
                      {ratio.toFixed(2)}:1
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[0.6875rem] font-bold",
                          pass.aa
                            ? "bg-emerald-50 text-pine-800 ring-1 ring-inset ring-emerald-200"
                            : "bg-[#FDF3F2] text-danger ring-1 ring-inset ring-[#F3C9C5]",
                        )}
                      >
                        {pass.aa ? <Check className="size-3" /> : <X className="size-3" />}
                        {pass.aa ? "Pass" : "Fail"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-[0.75rem] leading-relaxed text-zinc-500">
          Note: the original brief specified Zinc-300 for unavailable-date
          strikethrough on white. It measures 1.48:1 and is effectively invisible
          on a phone in daylight. The build uses Zinc-400 for the line and
          Zinc-500 for any accompanying label.
        </p>
      </Section>

      {/* ---------------------------------------------------------- Typography */}
      <Section
        id="type"
        kicker="04 · Typography"
        title="Plus Jakarta Sans draws, Inter works"
        intro="Display type is geometric and slightly warm — it carries the brand voice. Interface text is Inter, because Inter's tabular numerals keep ₦ prices from shifting width as digits change. Both are loaded in latin and latin-ext, because the Naira sign (U+20A6) lives in latin-ext. Dropping that subset silently swaps ₦ to a system fallback."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-zinc-200 bg-white p-5">
            <p className="font-display text-[3.5rem] font-extrabold leading-none tracking-[-0.04em] text-obsidian">
              Aa ₦
            </p>
            <p className="mt-3 font-display text-[0.9375rem] font-bold text-obsidian">
              Plus Jakarta Sans
            </p>
            <p className="mt-1 text-[0.8125rem] text-zinc-500">
              Display / headlines / wordmark. Weights 650–800. Tracking −2% to
              −4%. Never below 18px.
            </p>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-white p-5">
            <p className="font-sans text-[3.5rem] font-semibold leading-none tracking-[-0.02em] text-obsidian tabular">
              Aa ₦
            </p>
            <p className="mt-3 font-sans text-[0.9375rem] font-semibold text-obsidian">Inter</p>
            <p className="mt-1 text-[0.8125rem] text-zinc-500">
              Body / UI / prices. Weights 400–600. Prices always use tabular
              numerals. Never letterspace body copy.
            </p>
          </div>
        </div>

        <div className="mt-4 overflow-hidden rounded-xl border border-zinc-200 bg-white">
          {TYPE_SPECIMENS.map(([cls, sample, note], i) => (
            <div
              key={cls}
              className={cn(
                "flex flex-col gap-2 px-4 py-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8",
                i > 0 && "border-t border-zinc-100",
              )}
            >
              <p
                className={cn(
                  cls,
                  "min-w-0 text-obsidian",
                  cls === "text-display-hero" && "sm:max-w-xl",
                  cls === "text-display" && "sm:max-w-xl",
                )}
              >
                {sample}
              </p>
              <div className="shrink-0 text-left sm:text-right">
                <p className="font-mono text-[0.6875rem] text-pine-700">{cls}</p>
                <p className="mt-0.5 text-[0.6875rem] text-zinc-400">{note}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
          <p className="flex items-center gap-2 text-[0.8125rem] font-bold text-pine-900">
            <Check className="size-4" aria-hidden="true" />
            The Naira test
          </p>
          <p className="mt-1 text-[0.8125rem] text-pine-900/80">
            <span className="font-semibold tabular">{naira(85000)}</span> ·{" "}
            <span className="font-semibold tabular">{naira(1200000)}</span> ·{" "}
            <span className="font-semibold tabular">{naira(4500)}</span> — all three
            render in Inter with the glyph from latin-ext, not a fallback.
          </p>
        </div>
      </Section>

      {/* --------------------------------------------------------- Space/radius */}
      <Section
        id="space"
        kicker="05 · Structure"
        title="Space, radius, elevation"
        intro="An 8px rhythm with a 4px half-step. Radii stay in a narrow band so cards, buttons and pills feel like one family: 8px controls, 12px inputs, 16px cards, 24px sheets."
      >
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-zinc-200 bg-white p-5">
            <p className="text-[0.6875rem] font-bold uppercase tracking-[0.08em] text-zinc-500">
              Radius
            </p>
            <div className="mt-3 flex items-end gap-2">
              {[
                ["8", "rounded-sm"],
                ["12", "rounded-md"],
                ["16", "rounded-lg"],
                ["24", "rounded-3xl"],
                ["999", "rounded-full"],
              ].map(([label, cls]) => (
                <div key={label} className="flex flex-col items-center gap-1">
                  <span className={cn("size-10 border border-pine-300 bg-pine-50", cls)} />
                  <span className="text-[0.625rem] text-zinc-500 tabular">{label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-zinc-200 bg-white p-5">
            <p className="text-[0.6875rem] font-bold uppercase tracking-[0.08em] text-zinc-500">
              Elevation
            </p>
            <div className="mt-3 space-y-2">
              {[
                ["shadow-soft", "Cards at rest"],
                ["shadow-raised", "Hover / sticky pill"],
                ["shadow-float", "Booking card"],
                ["shadow-overlay", "Modals & popovers"],
              ].map(([cls, label]) => (
                <div key={cls} className="flex items-center gap-3">
                  <span className={cn("h-6 w-9 rounded-md border border-zinc-200 bg-white", cls)} />
                  <span className="font-mono text-[0.6875rem] text-pine-700">{cls}</span>
                  <span className="text-[0.6875rem] text-zinc-400">{label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-zinc-200 bg-white p-5">
            <p className="text-[0.6875rem] font-bold uppercase tracking-[0.08em] text-zinc-500">
              Spacing
            </p>
            <div className="mt-3 space-y-2">
              {[1, 2, 3, 4, 6, 8, 12, 16].map((n) => (
                <div key={n} className="flex items-center gap-2">
                  <span className="w-6 text-[0.625rem] text-zinc-400 tabular">{n}</span>
                  <span
                    className="h-2 rounded-sm bg-pine-300"
                    style={{ width: n * 4 }}
                    aria-hidden="true"
                  />
                  <span className="text-[0.625rem] text-zinc-400 tabular">{n * 4}px</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* ----------------------------------------------------------- Components */}
      <Section
        id="components"
        kicker="06 · Components"
        title="Components carry the rules"
        intro="Every interactive element below is the real component from the build, not a screenshot. Hover, focus and active states are live."
      >
        <div className="grid gap-4">
          <div className="rounded-xl border border-zinc-200 bg-white p-5">
            <p className="text-[0.6875rem] font-bold uppercase tracking-[0.08em] text-zinc-500">
              Buttons
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2.5">
              <Button variant="primary">Reserve · {naira(212000)}</Button>
              <Button variant="signal">
                <Zap className="size-4" aria-hidden="true" />
                Instant Book
              </Button>
              <Button variant="secondary">Check availability</Button>
              <Button variant="ghost">Save</Button>
              <Button variant="whatsapp">Confirm on WhatsApp</Button>
              <Button variant="primary" disabled>
                Sold out
              </Button>
            </div>
            <p className="mt-3 text-[0.75rem] text-zinc-500">
              Signal buttons use obsidian text (10.46:1). There is no
              emerald-fill-with-white-text variant, by design.
            </p>
          </div>

          <div className="rounded-xl border border-zinc-200 bg-white p-5">
            <p className="text-[0.6875rem] font-bold uppercase tracking-[0.08em] text-zinc-500">
              Badges — state, never decoration
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <Badge tone="verified">
                <ShieldCheck className="size-3" aria-hidden="true" />
                JosStay Verified
              </Badge>
              <Badge tone="instant">Instant Book</Badge>
              <Badge tone="neutral">Sleeps 4</Badge>
              <Badge tone="outline">Shared bath</Badge>
              <Badge tone="warning">2-night minimum</Badge>
              <Badge tone="danger">Not available</Badge>
              <Badge tone="unavailable">Booked</Badge>
            </div>
          </div>

          <div className="rounded-xl border border-zinc-200 bg-white p-5">
            <p className="text-[0.6875rem] font-bold uppercase tracking-[0.08em] text-zinc-500">
              Search pill (static preview)
            </p>
            <div className="mt-3 flex items-center rounded-full border border-zinc-200 bg-white p-2 shadow-float">
              <PillField icon={<MapPin />} label="Where" value="Jos, Plateau" grow />
              <span className="h-8 w-px bg-zinc-200" aria-hidden="true" />
              <PillField icon={<CalendarDays />} label="Check-in" value="14 Nov" />
              <span className="h-8 w-px bg-zinc-200" aria-hidden="true" />
              <PillField icon={<CalendarDays />} label="Check-out" value="17 Nov" />
              <span className="h-8 w-px bg-zinc-200" aria-hidden="true" />
              <PillField icon={<Users />} label="Guests" value="2 guests" />
              <span className="ml-1 inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-pine-800 text-white">
                <Search className="size-4" aria-hidden="true" />
              </span>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-zinc-200 bg-white p-5">
              <p className="text-[0.6875rem] font-bold uppercase tracking-[0.08em] text-zinc-500">
                Listing card anatomy
              </p>
              <div className="mt-3 overflow-hidden rounded-2xl border border-zinc-200">
                <div className="relative aspect-[4/3] bg-gradient-to-br from-pine-700 via-pine-800 to-pine-950">
                  <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-[0.625rem] font-bold text-pine-800">
                    <span className="inline-flex size-3 items-center justify-center rounded-full bg-emerald-500 text-[0.45rem] text-obsidian">
                      ✓
                    </span>
                    JosStay Verified
                  </span>
                  <span className="absolute right-3 top-3 inline-flex size-8 items-center justify-center rounded-full bg-white/15 backdrop-blur-md">
                    <Heart className="size-3.5 text-white" aria-hidden="true" />
                  </span>
                  <span className="absolute inset-x-0 bottom-2.5 flex justify-center gap-1">
                    <span className="h-1.5 w-4 rounded-full bg-white" />
                    <span className="size-1.5 rounded-full bg-white/55" />
                    <span className="size-1.5 rounded-full bg-white/55" />
                  </span>
                </div>
                <div className="p-3">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-display text-[0.875rem] font-bold text-obsidian">
                      The Rayfield Garden Apartment
                    </p>
                    <span className="inline-flex shrink-0 items-center gap-0.5 text-[0.75rem] font-semibold text-obsidian">
                      <Star className="size-3 fill-obsidian" aria-hidden="true" />
                      4.92
                    </span>
                  </div>
                  <p className="mt-0.5 text-[0.75rem] text-zinc-500">Rayfield, Jos · 2 beds · sleeps 4</p>
                  <p className="mt-1 text-[0.75rem] text-zinc-500">
                    <span className="text-[0.875rem] font-bold text-obsidian tabular">
                      {naira(85000)}
                    </span>{" "}
                    night
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-zinc-200 bg-white p-5">
              <p className="text-[0.6875rem] font-bold uppercase tracking-[0.08em] text-zinc-500">
                Bento gallery — hover state
              </p>
              <div className="mt-3 grid h-52 grid-cols-4 grid-rows-2 gap-1.5 overflow-hidden rounded-xl">
                <div className="group relative col-span-2 row-span-2 overflow-hidden bg-pine-800">
                  <div className="absolute inset-0 bg-gradient-to-br from-pine-600 to-pine-950 transition-[filter] duration-300 group-hover:brightness-90" />
                  <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-white/95 px-2 py-0.5 text-[0.5rem] font-bold text-pine-800">
                    <Images className="size-2.5" aria-hidden="true" />
                    Show all 12
                  </span>
                </div>
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="bg-gradient-to-br from-pine-300 via-pine-500 to-pine-800 opacity-90 transition-[filter] duration-300 hover:brightness-90"
                  />
                ))}
              </div>
              <p className="mt-2 text-[0.6875rem] leading-relaxed text-zinc-500">
                4 × 2 grid, 460px tall, hero at 2 × 2. Hover is a filter only —
                no layout shift. On mobile it becomes a snap carousel with a
                “1 / 12” counter.
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* ---------------------------------------------------------------- Motion */}
      <Section
        id="motion"
        kicker="07 · Motion"
        title="Movement that explains, not decorates"
        intro="Three durations, three curves. Anything that animates must animate transform or opacity only — never height, top, or box-shadow on the scroll path. Reduced-motion kills all of it."
      >
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            ["var(--ease-out-expo)", "Out Expo", "Entering elements, galleries, sheets"],
            ["var(--ease-standard)", "Standard", "Hover colours, small state changes"],
            ["var(--ease-spring)", "Spring", "Shared-layout pills, guest stepper"],
          ].map(([curve, name, use]) => (
            <div key={name} className="rounded-xl border border-zinc-200 bg-white p-5">
              <div className="flex h-10 items-end gap-1" aria-hidden="true">
                {[10, 18, 26, 34, 30, 22, 14, 10].map((h, i) => (
                  <span
                    key={i}
                    className="w-2 rounded-sm bg-pine-700"
                    style={{ height: `${h}px`, opacity: 0.4 + i * 0.075 }}
                  />
                ))}
              </div>
              <p className="mt-3 text-[0.875rem] font-bold text-obsidian">{name}</p>
              <p className="mt-1 font-mono text-[0.6875rem] text-pine-700">{curve}</p>
              <p className="mt-1 text-[0.75rem] text-zinc-500">{use}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 overflow-hidden rounded-xl border border-zinc-200 bg-white">
          {[
            ["120–160ms", "Colour / opacity feedback", "Buttons, links, badges"],
            ["180–240ms", "Element entry", "Cards, popovers, sheets"],
            ["260–320ms", "Page-level transition", "Gallery open, route change"],
            ["0ms", "prefers-reduced-motion", "All of the above disabled"],
          ].map(([duration, use, scope], i) => (
            <div
              key={duration}
              className={cn(
                "grid gap-1 px-4 py-3 sm:grid-cols-[120px_1fr_1fr] sm:items-center",
                i > 0 && "border-t border-zinc-100",
              )}
            >
              <span className="font-mono text-[0.75rem] font-semibold text-pine-700">{duration}</span>
              <span className="text-[0.8125rem] text-obsidian">{use}</span>
              <span className="text-[0.75rem] text-zinc-500">{scope}</span>
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-xl border border-zinc-200 bg-obsidian p-5 text-white">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-2.5 py-1 text-[0.6875rem] font-bold text-emerald-400">
              <Sun className="size-3" aria-hidden="true" />
              Hover me
            </span>
            <span className="group inline-flex cursor-pointer items-center gap-2 rounded-lg bg-white/10 px-3 py-2 text-[0.8125rem] transition-transform duration-200 ease-[var(--ease-out-expo)] hover:-translate-y-0.5">
              <Zap className="size-4 text-emerald-400 transition-transform duration-200 group-hover:scale-110" aria-hidden="true" />
              transform + opacity only
            </span>
            <span className="inline-flex items-center gap-1.5 text-[0.75rem] text-white/50">
              <Moon className="size-3.5" aria-hidden="true" />
              No animation on scroll-linked layout.
            </span>
          </div>
        </div>
      </Section>

      {/* -------------------------------------------------------------- Imagery */}
      <Section
        id="imagery"
        kicker="08 · Imagery"
        title="Proof, not aspiration"
        intro="Airbnb sells the feeling of a trip. JosStay sells certainty about a specific room. That changes the shot list: wide, honest, well-lit frames that show the whole space — including the ordinary corners a marketing photographer would crop out."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-pine-200 bg-pine-50 p-5">
            <p className="flex items-center gap-1.5 text-[0.8125rem] font-bold text-pine-900">
              <Check className="size-4" aria-hidden="true" />
              Do
            </p>
            <ul className="mt-2 space-y-1.5 text-[0.8125rem] text-pine-900/85">
              <li>Shoot every room in daylight with curtains open.</li>
              <li>Show the bathroom, the kitchen counter and the gate.</li>
              <li>Keep verticals straight — no fisheye distortion.</li>
              <li>Photograph the power setup if it is a selling point.</li>
              <li>Re-shoot when furniture or condition changes.</li>
            </ul>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-white p-5">
            <p className="flex items-center gap-1.5 text-[0.8125rem] font-bold text-obsidian">
              <X className="size-4 text-danger" aria-hidden="true" />
              Don't
            </p>
            <ul className="mt-2 space-y-1.5 text-[0.8125rem] text-zinc-600">
              <li>No owner-supplied photos. Ever.</li>
              <li>No HDR skies or warm filters that hide condition.</li>
              <li>No cropped shots that hide a shared bathroom.</li>
              <li>No stock imagery presented as the property.</li>
              <li>No people in frame without written consent.</li>
            </ul>
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-zinc-200 bg-white p-5">
          <p className="text-[0.6875rem] font-bold uppercase tracking-[0.08em] text-zinc-500">
            Iconography
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-4">
            {[ShieldCheck, Zap, MapPin, CalendarDays, Users, Star, Images, Heart].map((Icon, i) => (
              <Icon key={i} className="size-5 text-pine-700" aria-hidden="true" />
            ))}
            <span className="text-[0.75rem] text-zinc-500">
              Lucide, 1.75px stroke, 16–20px. Icons support labels; they never
              replace them.
            </span>
          </div>
        </div>
      </Section>

      <footer className="mt-14 flex flex-wrap items-center justify-between gap-4 border-t border-zinc-200 pt-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-[0.875rem] font-semibold text-pine-800 underline-offset-4 hover:underline"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back to JosStay
        </Link>
        <p className="text-[0.75rem] text-zinc-500">
          Design system v1.0 · {new Date().getFullYear()} · Maintained with the codebase
        </p>
      </footer>
    </div>
  );
}

function Section({
  id,
  kicker,
  title,
  intro,
  children,
}: {
  id: string;
  kicker: string;
  title: string;
  intro: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="mt-16 scroll-mt-24">
      <p className="text-[0.6875rem] font-bold uppercase tracking-[0.12em] text-pine-700">
        {kicker}
      </p>
      <h2 className="mt-2 text-display text-obsidian">{title}</h2>
      <p className="mt-3 max-w-3xl text-body-sm text-zinc-600">{intro}</p>
      <div className="mt-6">{children}</div>
    </section>
  );
}

function Swatch({ step, hex, token }: { step: string; hex: string; token: string }) {
  const onWhite = contrast(hex, "#FFFFFF");
  const onInk = contrast(hex, "#0B0C0E");
  const light = onInk > onWhite;

  return (
    <div className="overflow-hidden rounded-lg border border-zinc-200">
      <div
        className="flex h-14 items-end justify-between p-1.5"
        style={{ backgroundColor: hex }}
      >
        <span
          className="text-[0.625rem] font-bold tabular"
          style={{ color: light ? "#FFFFFF" : "#0B0C0E" }}
        >
          {step}
        </span>
      </div>
      <div className="bg-white px-1.5 py-1.5">
        <p className="text-[0.5625rem] font-semibold text-zinc-600 tabular">{hex.toUpperCase()}</p>
        <p className="mt-0.5 truncate font-mono text-[0.5rem] text-zinc-400">{token}</p>
      </div>
    </div>
  );
}

function UsageCard({
  tone,
  title,
  items,
}: {
  tone: "pine" | "emerald";
  title: string;
  items: string[];
}) {
  const pine = tone === "pine";
  return (
    <div
      className={cn(
        "rounded-xl border p-5",
        pine ? "border-pine-200 bg-pine-50" : "border-emerald-200 bg-emerald-50",
      )}
    >
      <p className={cn("text-[0.875rem] font-bold", pine ? "text-pine-900" : "text-pine-900")}>
        {title}
      </p>
      <ul className={cn("mt-2 space-y-1.5 text-[0.8125rem]", pine ? "text-pine-900/80" : "text-pine-900/80")}>
        {items.map((item) => (
          <li key={item} className="flex items-start gap-1.5">
            <Check className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function PillField({
  icon,
  label,
  value,
  grow,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  grow?: boolean;
}) {
  return (
    <span
      className={cn(
        "flex min-w-0 flex-col items-start gap-0.5 rounded-full px-3.5 py-1.5",
        grow ? "flex-[1.4]" : "flex-1",
      )}
    >
      <span className="flex items-center gap-1 text-[0.5625rem] font-bold uppercase tracking-[0.06em] text-zinc-500 [&>svg]:size-2.5">
        {icon}
        {label}
      </span>
      <span className="truncate text-[0.75rem] font-semibold text-obsidian">{value}</span>
    </span>
  );
}
