import type { DateRange, FilterMode } from "../../types";
import { rangeLabel } from "../../lib/format";

interface FlightLogBarProps {
  filterMode: FilterMode;
  dateRange: DateRange;
  randomCount: number;
  flightCount: number;
  onNewSearch: () => void;
}

export function FlightLogBar({ filterMode, dateRange, randomCount, flightCount, onNewSearch }: FlightLogBarProps) {
  const summary = filterMode === "random" ? `${randomCount} RANDOM` : rangeLabel(dateRange);

  return (
    <div className="flex items-center gap-3 py-4 mb-5 border-b" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
      <div className="flex items-center gap-2 flex-1 min-w-0 flex-wrap">
        <span className="text-2xs tracking-[0.25em] px-2 py-1 rounded" style={{ color: "var(--color-core-orange)", background: "rgba(255,77,0,0.08)", border: "1px solid rgba(255,77,0,0.15)", fontFamily: "var(--font-mono)" }}>
          {filterMode === "range" ? "DATE RANGE" : "RANDOM"}
        </span>
        <span className="text-label tracking-wider truncate" style={{ color: "#8A9AAE", fontFamily: "var(--font-mono)" }}>{summary}</span>
        <span className="text-label" style={{ color: "var(--color-navy-700)" }}>·</span>
        <span className="text-label tracking-wider" style={{ color: "var(--color-label-grey)", fontFamily: "var(--font-mono)" }}>
          {flightCount} {flightCount === 1 ? "ENTRY" : "ENTRIES"}
        </span>
      </div>
      <button
        onClick={onNewSearch}
        className="flex items-center gap-1.5 text-label tracking-[0.15em] font-bold px-3 py-1.5 rounded-lg transition-colors hover:bg-white/5 focus-visible:outline-2 focus-visible:outline-offset-2 shrink-0"
        style={{ color: "var(--color-core-orange)", fontFamily: "var(--font-mono)", border: "1px solid rgba(255,77,0,0.2)", outlineColor: "var(--color-core-orange)" }}
      >
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
          <circle cx="4.5" cy="4.5" r="3.5" stroke="currentColor" strokeWidth="1.1" />
          <line x1="7.5" y1="7.5" x2="9.5" y2="9.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
        </svg>
        NEW SEARCH
      </button>
    </div>
  );
}
