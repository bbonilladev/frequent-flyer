import { useRef } from "react";
import type { CSSProperties } from "react";
import type { DateRange, FilterMode } from "../../types";
import { DateRangePicker } from "./DateRangePicker";
import { RandomCountInput } from "./RandomCountInput";
import { GalaxyLoader } from "../ui/GalaxyLoader";

interface MissionBriefingProps {
  filterMode: FilterMode;
  dateRange: DateRange;
  randomCount: number;
  loading: boolean;
  error: string | null;
  onModeChange: (m: FilterMode) => void;
  onDateChange: (r: DateRange) => void;
  onCountChange: (n: number) => void;
  onRetrieve: () => void;
}

function cardStyle(active: boolean): CSSProperties {
  return {
    border: active ? "2px solid var(--color-core-orange)" : "1px solid var(--color-navy-800)",
    background: active ? "rgba(255,77,0,0.04)" : "var(--color-panel)",
    boxShadow: active ? "0 0 40px rgba(255,77,0,0.1), inset 0 1px 0 rgba(255,77,0,0.06)" : "none",
    transition: "all 0.2s ease",
    cursor: "pointer",
    borderRadius: "var(--radius-tile)",
    padding: "20px",
    flex: 1,
    display: "flex",
    flexDirection: "column",
  };
}

// The "Where have you been?" search screen: pick a date range or ask for a
// random set of flights, then retrieve.
export function MissionBriefing({ filterMode, dateRange, randomCount, loading, error, onModeChange, onDateChange, onCountChange, onRetrieve }: MissionBriefingProps) {
  const canRetrieve = filterMode === "random" || !!dateRange.start;
  const rangeRadioRef = useRef<HTMLButtonElement>(null);
  const randomRadioRef = useRef<HTMLButtonElement>(null);

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 relative" style={{ paddingTop: 48, paddingBottom: 48 }}>
      {/* Atmospheric glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{ background: "radial-gradient(ellipse 70% 50% at 50% 50%, rgba(255,77,0,0.03) 0%, transparent 65%), radial-gradient(ellipse 50% 60% at 20% 70%, rgba(0,82,204,0.05) 0%, transparent 60%)" }}
      />

      {/* Heading */}
      <div className="text-center mb-10 relative z-10">
        <p className="text-label tracking-label mb-4" style={{ color: "var(--color-navy-700)", fontFamily: "var(--font-mono)" }}>✦ FLIGHT LOG ✦</p>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(24px, 5vw, 44px)", letterSpacing: "0.05em", color: "var(--color-pass-paper)", fontWeight: 500, lineHeight: 1.1 }}>
          WHERE HAVE<br className="sm:hidden" /> YOU BEEN?
        </h2>
        <p className="mt-4 text-body-sm leading-loose max-w-md mx-auto" style={{ color: "var(--color-label-grey)", fontFamily: "var(--font-mono)" }}>
          Every day since 1995, NASA has pointed a lens at the cosmos.
          You are stationed at Jezero Crater — pick a window and revisit the places you have already seen.
        </p>
      </div>

      {/* Mode cards */}
      <div className="flex flex-col sm:flex-row gap-4 w-full relative z-20" style={{ maxWidth: 820 }} role="radiogroup" aria-label="Flight retrieval method">
        {/* Chart a Course — the card itself is a plain container (mouse-only
            convenience click); role="radio" lives on just the header button
            so the DateRangePicker's own buttons below aren't ARIA-nested
            inside a radio widget. */}
        {/* oxlint-disable-next-line click-events-have-key-events, no-static-element-interactions -- mouse-only convenience; the role="radio" button below already covers keyboard selection. */}
        <div onClick={() => onModeChange("range")} style={cardStyle(filterMode === "range")}>
          <button
            ref={rangeRadioRef}
            type="button"
            // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role -- an <input type="radio"> can't host this button's roving-tabindex/arrow-key composite-widget behavior without a rewrite.
            role="radio"
            aria-checked={filterMode === "range"}
            tabIndex={filterMode === "range" ? 0 : -1}
            onClick={(e) => { e.stopPropagation(); onModeChange("range"); }}
            onKeyDown={(e) => {
              if (e.key === "ArrowRight" || e.key === "ArrowDown") { e.preventDefault(); onModeChange("random"); randomRadioRef.current?.focus(); }
            }}
            className="flex items-center gap-2 -my-1.5 py-1.5 mb-0.5 w-full text-left"
          >
            <svg width="13" height="13" viewBox="0 0 12 12" fill="none" aria-hidden="true" style={{ color: filterMode === "range" ? "var(--color-core-orange)" : "var(--color-navy-700)", flexShrink: 0 }}>
              <rect x="1" y="1.5" width="10" height="9.5" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
              <line x1="4" y1="0.5" x2="4" y2="3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              <line x1="8" y1="0.5" x2="8" y2="3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              <line x1="1" y1="5" x2="11" y2="5" stroke="currentColor" strokeWidth="1.2" />
            </svg>
            <span className="text-label tracking-label font-bold" style={{ fontFamily: "var(--font-mono)", color: filterMode === "range" ? "var(--color-core-orange)" : "var(--color-navy-700)" }}>CHART A COURSE</span>
          </button>
          <p className="text-caption leading-relaxed mb-5 flex-1" style={{ color: filterMode === "range" ? "var(--color-navy-300)" : "var(--color-navy-700)", fontFamily: "var(--font-mono)" }}>
            Pick a date or a window. We will show you what the sky looked like from here.
          </p>
          {/* oxlint-disable-next-line click-events-have-key-events, no-static-element-interactions -- stops inner clicks from re-triggering the card's onModeChange; same keyboard path via the card's radio button. */}
          <div onClick={(e) => e.stopPropagation()}>
            <DateRangePicker value={dateRange} onChange={onDateChange} onActivate={() => onModeChange("range")} />
          </div>
        </div>

        {/* Surprise Me — same pattern: role="radio" on the header button only,
            RandomCountInput's own +/- buttons are siblings, not descendants. */}
        {/* oxlint-disable-next-line click-events-have-key-events, no-static-element-interactions -- mouse-only convenience; the role="radio" button below already covers keyboard selection. */}
        <div onClick={() => onModeChange("random")} style={cardStyle(filterMode === "random")}>
          <button
            ref={randomRadioRef}
            type="button"
            // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role -- an <input type="radio"> can't host this button's roving-tabindex/arrow-key composite-widget behavior without a rewrite.
            role="radio"
            aria-checked={filterMode === "random"}
            tabIndex={filterMode === "random" ? 0 : -1}
            onClick={(e) => { e.stopPropagation(); onModeChange("random"); }}
            onKeyDown={(e) => {
              if (e.key === "ArrowLeft" || e.key === "ArrowUp") { e.preventDefault(); onModeChange("range"); rangeRadioRef.current?.focus(); }
            }}
            className="flex items-center gap-2 -my-1.5 py-1.5 mb-0.5 w-full text-left"
          >
            <svg width="13" height="13" viewBox="0 0 12 12" fill="none" aria-hidden="true" style={{ color: filterMode === "random" ? "var(--color-core-orange)" : "var(--color-navy-700)", flexShrink: 0 }}>
              <path d="M1 4h2l2 4 2-6 2 4h2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M9 2l2 2-2 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="text-label tracking-label font-bold" style={{ fontFamily: "var(--font-mono)", color: filterMode === "random" ? "var(--color-core-orange)" : "var(--color-navy-700)" }}>SURPRISE ME</span>
          </button>
          <p className="text-caption leading-relaxed mb-5 flex-1" style={{ color: filterMode === "random" ? "var(--color-navy-300)" : "var(--color-navy-700)", fontFamily: "var(--font-mono)" }}>
            Let the sky decide. We will pull a random set of nights from the log.
          </p>
          {/* oxlint-disable-next-line click-events-have-key-events, no-static-element-interactions -- stops inner clicks from re-triggering the card's onModeChange; same keyboard path via the card's radio button. */}
          <div onClick={(e) => e.stopPropagation()} className="flex items-center gap-3">
            <RandomCountInput value={randomCount} onChange={(n) => { onModeChange("random"); onCountChange(n); }} />
            <span className="text-caption" style={{ color: filterMode === "random" ? "var(--color-label-grey)" : "var(--color-navy-700)", fontFamily: "var(--font-mono)" }}>
              {randomCount === 1 ? "flight" : "flights"}
            </span>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="mt-6 w-full relative z-10" style={{ maxWidth: 820 }}>
        <button
          onClick={onRetrieve}
          disabled={loading || !canRetrieve}
          className="w-full flex items-center justify-center gap-3 rounded-xl font-bold tracking-label transition-all focus-visible:outline-2 focus-visible:outline-offset-2"
          style={{
            height: 54,
            background: loading || !canRetrieve ? "var(--color-panel)" : "var(--color-core-orange)",
            color: loading || !canRetrieve ? "var(--color-navy-700)" : "#000",
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            border: loading || !canRetrieve ? "1px solid var(--color-navy-800)" : "none",
            cursor: loading || !canRetrieve ? "not-allowed" : "pointer",
            outlineColor: "var(--color-core-orange)",
            boxShadow: !loading && canRetrieve ? "var(--shadow-glow-orange)" : "none",
            transition: "all 0.2s ease",
          }}
        >
          {loading ? (
            <>
              <GalaxyLoader size={18} />
              RETRIEVING FLIGHTS…
            </>
          ) : (
            <>
              <svg width="13" height="13" viewBox="0 0 11 11" fill="none" aria-hidden="true">
                <line x1="1" y1="5.5" x2="9.5" y2="5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M6.5 2.5L9.5 5.5L6.5 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              RETRIEVE FLIGHTS
            </>
          )}
        </button>
        <p className="text-center mt-3 text-label tracking-label" style={{ color: "var(--color-navy-700)", fontFamily: "var(--font-mono)" }}>
          {!canRetrieve && !loading
            ? "SELECT A DATE OR CHOOSE RANDOM TO CONTINUE"
            : !loading
            ? "Boarding from Jezero · Landing in the stars — one pass per destination"
            : null}
        </p>
        {error && (
          <p role="alert" className="text-center mt-3 text-label leading-relaxed" style={{ color: "var(--color-status-negative)", fontFamily: "var(--font-mono)" }}>
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
