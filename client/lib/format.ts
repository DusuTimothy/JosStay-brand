/**
 * Money + date formatting for the Nigerian market.
 *
 * Rules that matter:
 * - Naira only, no kobo. Shortlet prices are quoted in whole naira.
 * - ₦ symbol via Intl (en-NG) rather than a manual string, so grouping is right.
 * - Dates are long-form English because the WhatsApp handoff is read by a human.
 */

const NGN = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
  minimumFractionDigits: 0,
});

export function naira(amount: number): string {
  // Intl returns "₦45,000" in modern V8. Guard against "NGN 45,000" fallbacks.
  const formatted = NGN.format(Math.round(amount));
  return formatted.startsWith("₦")
    ? formatted
    : `₦${new Intl.NumberFormat("en-NG").format(Math.round(amount))}`;
}

export function nairaShort(amount: number): string {
  if (amount >= 1_000_000) return `₦${(amount / 1_000_000).toFixed(amount % 1_000_000 === 0 ? 0 : 1)}m`;
  if (amount >= 1_000) return `₦${Math.round(amount / 1_000)}k`;
  return naira(amount);
}

export function nightsBetween(from: Date | undefined, to: Date | undefined): number {
  if (!from || !to) return 0;
  const ms = startOfDay(to).getTime() - startOfDay(from).getTime();
  return Math.max(0, Math.round(ms / 86_400_000));
}

export function startOfDay(d: Date): Date {
  const copy = new Date(d);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

export function addDays(d: Date, days: number): Date {
  const copy = new Date(d);
  copy.setDate(copy.getDate() + days);
  return copy;
}

/** Local calendar date for API payloads. Never use toISOString(): it shifts WAT dates. */
export function toDateOnly(d: Date): string {
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${month}-${day}`;
}

/** "Fri, 14 Nov" — used in the booking card. */
export function formatDateShort(d: Date): string {
  return new Intl.DateTimeFormat("en-NG", {
    weekday: "short",
    day: "numeric",
    month: "short",
  }).format(d);
}

/** "14 November 2026" — used in WhatsApp copy and receipts. */
export function formatDateLong(d: Date): string {
  return new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(d);
}

/** "14 – 17 Nov 2026" compact but unambiguous. */
export function formatRange(from?: Date, to?: Date): string {
  if (!from) return "Add dates";
  if (!to) return formatDateShort(from);
  const sameMonth = from.getMonth() === to.getMonth() && from.getFullYear() === to.getFullYear();
  const fmt = new Intl.DateTimeFormat("en-NG", { day: "numeric", month: "short" });
  const end = new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(to);
  return sameMonth ? `${fmt.format(from)} – ${end}` : `${formatDateShort(from)} – ${end}`;
}
