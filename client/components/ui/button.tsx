import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Button system.
 *
 * Pine is the primary action (12.14:1 with white, safe everywhere).
 * Emerald is NEVER a primary surface with white text — it fails at 1.87:1.
 * When emerald is used it carries near-black text (10.46:1).
 */
export type ButtonVariant =
  | "primary"
  | "signal"
  | "secondary"
  | "ghost"
  | "quiet"
  | "whatsapp"
  | "danger";

export type ButtonSize = "sm" | "md" | "lg" | "xl" | "icon";

const base =
  "inline-flex items-center justify-center gap-2 rounded-md font-sans font-semibold " +
  "transition-[background-color,color,box-shadow,transform] duration-200 ease-[var(--ease-out-expo)] " +
  "disabled:pointer-events-none disabled:opacity-45 active:scale-[0.985] " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 " +
  "motion-reduce:transition-none motion-reduce:active:scale-100";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-pine-800 text-white shadow-soft hover:bg-pine-900 hover:shadow-raised",
  signal: "bg-emerald-500 text-obsidian shadow-soft hover:bg-emerald-400 hover:shadow-raised",
  secondary:
    "bg-white text-obsidian border border-zinc-300 hover:border-zinc-400 hover:bg-zinc-50",
  ghost: "bg-transparent text-obsidian hover:bg-zinc-100",
  quiet: "bg-transparent text-zinc-600 hover:text-obsidian hover:bg-zinc-100",
  whatsapp: "bg-whatsapp-ink text-white hover:bg-[#064E45] shadow-soft",
  danger: "bg-danger text-white hover:bg-[#961E15]",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-9 px-3.5 text-[0.8125rem]",
  md: "h-11 px-5 text-[0.9375rem]",
  lg: "h-12 px-6 text-base",
  xl: "h-[3.25rem] px-7 text-base",
  icon: "h-11 w-11",
};

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  full?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", full, type, ...props }, ref) => (
    <button
      ref={ref}
      type={type ?? "button"}
      className={cn(base, variants[variant], sizes[size], full && "w-full", className)}
      {...props}
    />
  ),
);
Button.displayName = "Button";

export function buttonClasses(
  variant: ButtonVariant = "primary",
  size: ButtonSize = "md",
  extra?: string,
) {
  return cn(base, variants[variant], sizes[size], extra);
}
