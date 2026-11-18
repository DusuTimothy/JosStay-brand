import { toDateOnly } from "@/lib/format";

/** Date helpers that never use toISOString() for a Jos calendar day. */
export function parseDateOnly(value: string): Date {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, (month ?? 1) - 1, day ?? 1, 12);
}

export function dateOnly(value: Date): string {
  return toDateOnly(value);
}

export function addDaysToDateOnly(value: string, days: number): string {
  const date = parseDateOnly(value);
  date.setDate(date.getDate() + days);
  return dateOnly(date);
}

export function monthFromDateOnly(value: string): { year: number; month: number } {
  const date = parseDateOnly(value);
  return { year: date.getFullYear(), month: date.getMonth() };
}

export function shiftMonth(
  current: { year: number; month: number },
  delta: number,
): { year: number; month: number } {
  const date = new Date(current.year, current.month + delta, 1, 12);
  return { year: date.getFullYear(), month: date.getMonth() };
}

export function monthLabel(year: number, month: number): string {
  return new Intl.DateTimeFormat("en-NG", { month: "long", year: "numeric" }).format(
    new Date(year, month, 1, 12),
  );
}

/** Six Monday-start weeks, so the calendar grid never changes height. */
export function monthDates(year: number, month: number): string[] {
  const first = new Date(year, month, 1, 12);
  const offset = (first.getDay() + 6) % 7;
  const start = new Date(year, month, 1 - offset, 12);
  return Array.from({ length: 42 }, (_, index) =>
    dateOnly(new Date(start.getFullYear(), start.getMonth(), start.getDate() + index, 12)),
  );
}

/** Check-in is inclusive, check-out exclusive. */
export function includesNight(date: string, from: string, to: string): boolean {
  return from <= date && date < to;
}

export function overlaps(aFrom: string, aTo: string, bFrom: string, bTo: string): boolean {
  return aFrom < bTo && bFrom < aTo;
}

export function formatDate(value: string): string {
  return new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(parseDateOnly(value));
}

export function formatShortDate(value: string): string {
  return new Intl.DateTimeFormat("en-NG", { day: "numeric", month: "short" }).format(
    parseDateOnly(value),
  );
}

export function formatDateTime(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

/** Client-only CSV download. Callers choose the columns, so no contact fields leak in. */
export function downloadCsv(filename: string, headers: string[], rows: string[][]): void {
  const escape = (value: string) => {
    const guarded = /^[=+\-@]/.test(value) ? `'${value}` : value;
    return `"${guarded.replaceAll('"', '""')}"`;
  };
  const lines = [headers, ...rows].map((row) => row.map(escape).join(",")).join("\r\n");
  const url = URL.createObjectURL(new Blob([lines], { type: "text/csv;charset=utf-8" }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}
