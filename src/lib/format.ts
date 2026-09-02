import type { DateRange } from "../types";

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