import { cn } from "@/lib/utils";

/**
 * JosStay mark — "The Plateau Pin".
 *
 * One form, three readings:
 *  1. A location pin (where you are going).
 *  2. A mesa / plateau cross-section (the Jos highlands).
 *  3. A set of stacked terraces that read as a doorway at 16px.
 *
 * The pin is the structural colour (Plateau Pine). The mesa inside is the
 * signal colour (Electric Emerald) so the mark carries the brand's one rule:
 * pine holds, emerald signals.
 */
export function LogoMark({
  className,
  tone = "brand",
}: {
  className?: string;
  tone?: "brand" | "mono" | "inverse";
}) {
  const pin = tone === "inverse" ? "#FFFFFF" : tone === "mono" ? "currentColor" : "#0B3D33";
  const mesa =
    tone === "inverse" ? "#00D97E" : tone === "mono" ? "currentColor" : "#00D97E";

  return (
    <svg
      viewBox="0 0 40 40"
      role="img"
      aria-label="JosStay"
      className={cn("h-9 w-9", className)}
    >
      {/* Pin silhouette: circle top, tapered point. */}
      <path
        d="M20 2.5C10.6 2.5 3 10.1 3 19.5 3 29.1 14.3 35.7 20 38.4c5.7-2.7 17-9.3 17-18.9C37 10.1 29.4 2.5 20 2.5Z"
        fill={pin}
      />
      {/* Mesa / plateau: three terraces, tallest in the middle. */}
      <path
        d="M12.2 26.4v-4.9h4.2v-3.6h7.2v3.6h4.2v4.9H12.2Z"
        fill={mesa}
      />
      {/* Keyhole slot: ties the mark to "unlock / book". Only reads at 32px+. */}
      <circle cx="20" cy="29.2" r="1.35" fill={pin} />
    </svg>
  );
}

export function Wordmark({
  className,
  tone = "default",
}: {
  className?: string;
  tone?: "default" | "inverse";
}) {
  return (
    <span
      className={cn(
        "font-display text-[1.35rem] font-extrabold leading-none tracking-[-0.04em]",
        tone === "inverse" ? "text-white" : "text-obsidian",
        className,
      )}
    >
      Jos<span className={tone === "inverse" ? "text-emerald-400" : "text-pine-700"}>Stay</span>
      <span className="text-emerald-500">.</span>
    </span>
  );
}

export function Logo({
  className,
  tone = "default",
  showWordmark = true,
}: {
  className?: string;
  tone?: "default" | "inverse";
  showWordmark?: boolean;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark tone={tone === "inverse" ? "inverse" : "brand"} />
      {showWordmark ? <Wordmark tone={tone} /> : null}
    </span>
  );
}

/** App-icon tile used for favicon, OG image and the iOS/Android icon. */
export function AppIcon({ size = 96 }: { size?: number }) {
  return (
    <svg viewBox="0 0 96 96" width={size} height={size} role="img" aria-label="JosStay app icon">
      <defs>
        <linearGradient id="js-icon" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0B3D33" />
          <stop offset="100%" stopColor="#041A15" />
        </linearGradient>
      </defs>
      <rect width="96" height="96" rx="22" fill="url(#js-icon)" />
      <g transform="translate(16 14) scale(1.6)">
        <path
          d="M20 2.5C10.6 2.5 3 10.1 3 19.5 3 29.1 14.3 35.7 20 38.4c5.7-2.7 17-9.3 17-18.9C37 10.1 29.4 2.5 20 2.5Z"
          fill="#FFFFFF"
        />
        <path d="M12.2 26.4v-4.9h4.2v-3.6h7.2v3.6h4.2v4.9H12.2Z" fill="#00D97E" />
        <circle cx="20" cy="29.2" r="1.35" fill="#0B3D33" />
      </g>
    </svg>
  );
}
