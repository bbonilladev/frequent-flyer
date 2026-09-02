import type { DateRange } from "../types";

// ---------------------------------------------------------------------------
// DatePicker
// ---------------------------------------------------------------------------

export function formatDisplayDate(dateStr: string): string {
  const [y, m, d] = dateStr.split("-");
  const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
  return `${d} ${months[parseInt(m) - 1]} ${y}`;
}

export function addMonths(ym: string, n: number): string {
  const [y, m] = ym.split("-").map(Number);
  const d = new Date(y, m - 1 + n, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export function daysInMonth(ym: string): number {
  const [y, m] = ym.split("-").map(Number);
  return new Date(y, m, 0).getDate();
}

export function firstDayOfWeek(ym: string): number {
  const [y, m] = ym.split("-").map(Number);
  return new Date(y, m - 1, 1).getDay();
}

export function rangeLabel(range: DateRange): string {
  if (!range.start && !range.end) return "Select dates";
  if (range.start && !range.end) return formatDisplayDate(range.start);
  if (range.start && range.end) {
    if (range.start === range.end) return formatDisplayDate(range.start);
    return `${formatDisplayDate(range.start)} → ${formatDisplayDate(range.end)}`;
  }
  return "Select dates";
}

// ---------------------------------------------------------------------------
// APOD
// ---------------------------------------------------------------------------

export function apodPageUrl(date: string): string {
  const d = date.replace(/-/g, "").slice(2);
  return `https://apod.nasa.gov/apod/ap${d}.html`;
}

export function toFlightError(e: unknown): string {
  return `Could not retrieve flights: ${e instanceof Error ? e.message : "Unknown"}`;
}

export function flightCode(dateStr: string): string {
  return "FF" + dateStr.replace(/-/g, "").slice(2);
}

export function seededMiles(dateStr: string): string {
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = (hash << 5) - hash + dateStr.charCodeAt(i);
    hash |= 0;
  }
  return (140_000_000 + Math.abs(hash % 260_000_000)).toLocaleString("en-US");
}

