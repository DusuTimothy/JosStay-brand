import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Badge = state, not decoration.
 *
 * Every badge pairs colour with an icon or a word so it never relies on hue
 * alone (WCAG 1.4.1). Emerald appears only as a soft tint with pine text,
 * never as emerald-on-white text.
 */
export type BadgeTone =
  | "verified"
  | "instant"
  | "neutral"
  | "outline"
  | "unavailable"
  | "warning"
  | "danger";

const tones: Record<BadgeTone, string> = {
  verified: "bg-emerald-50 text-pine-800 ring-1 ring-inset ring-emerald-200",
  instant: "bg-pine-800 text-white",
  neutral: "bg-zinc-100 text-zinc-700",
  outline: "border border-zinc-300 bg-white/90 text-zinc-700",
  unavailable: "bg-zinc-100 text-zinc-500",
  warning: "bg-[#FEF3E2] text-warning ring-1 ring-inset ring-[#F5D9B0]",
  danger: "bg-[#FDF3F2] text-danger ring-1 ring-inset ring-[#F3C9C5]",
};

const sizes = {
  sm: "px-2 py-0.5 text-[0.6875rem] tracking-[0.02em]",
  md: "px-2.5 py-1 text-[0.75rem] tracking-[0.01em]",
};

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
  size?: keyof typeof sizes;
}

export function Badge({ className, tone = "neutral", size = "md", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-sans font-semibold whitespace-nowrap",
        tones[tone],
        sizes[size],
        className,
      )}
      {...props}
    />
  );
}
