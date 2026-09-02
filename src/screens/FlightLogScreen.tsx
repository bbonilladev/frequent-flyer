import type { ApodEntry, DateRange, FilterMode } from "../types";
import { formatDisplayDate } from "../lib/format";
import { FlightLogBar } from "../components/mission-briefing/FlightLogBar";
import { ErrorBanner } from "../components/boarding-pass/ErrorBanner";
import { LoadingGrid } from "../components/boarding-pass/LoadingGrid";
import { PaginatedGrid } from "../components/boarding-pass/PaginatedGrid";
import { EmptyState } from "../components/boarding-pass/EmptyState";

interface FlightLogScreenProps {
  filterMode: FilterMode;
  dateRange: DateRange;
  randomCount: number;
  flights: ApodEntry[];
  loading: boolean;
  error: string | null;
  queried: boolean;
  passengerName: string;
  onNewSearch: () => void;
  onRetry: () => void;
  onOpen: (entry: ApodEntry) => void;
  onImageClick: (src: string, alt: string) => void;
}

function narrativeHeading(filterMode: FilterMode, count: number): string {
  if (filterMode === "random") {
    return count === 1 ? "One trip.\nMake it count." : `${count} trips boarded\nfrom Jezero.`;
  }
  return count === 1 ? "One flight.\nOne destination." : `${count} flights departed\nfrom Jezero.`;
}

function narrativeBody(filterMode: FilterMode, count: number, dateRange: DateRange): string {
  if (filterMode === "random") {
    return count === 1
      ? "A single destination pulled from the archive. Open it and see where you landed."
      : "You have been to remarkable places. Every pass below is proof — a destination already reached, a night sky already witnessed. Open any one to relive where you were.";
  }
  if (count === 1) {
    return `${dateRange.start ? formatDisplayDate(dateRange.start) : "That night"} — you were there. Open your pass and relive where you landed.`;
  }
  const rangeText = dateRange.start
    ? `${formatDisplayDate(dateRange.start)}${dateRange.end && dateRange.end !== dateRange.start ? ` to ${formatDisplayDate(dateRange.end)}` : ""}`
    : "These nights";
  return `${rangeText} — you were there for all of them. Open any pass to relive where you've been.`;
}

export function FlightLogScreen({
  filterMode,
  dateRange,
  randomCount,
  flights,
  loading,
  error,
  queried,
  passengerName,
  onNewSearch,
  onRetry,
  onOpen,
  onImageClick,
}: FlightLogScreenProps) {
  return (
    <main id="main-content" tabIndex={-1} className="flex-1 mx-auto w-full px-4 md:px-8 py-6 overflow-y-auto outline-none" style={{ maxWidth: 1120 }}>
      <FlightLogBar filterMode={filterMode} dateRange={dateRange} randomCount={randomCount} flightCount={flights.length} onNewSearch={onNewSearch} />

      {/* Narrative header */}
      {!loading && flights.length > 0 && (
        <div className="pt-8 pb-6 border-b mb-8" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
          <p className="text-label tracking-label mb-3" style={{ color: "var(--color-navy-700)", fontFamily: "var(--font-mono)" }}>
            PASSENGER · {passengerName.toUpperCase()}
          </p>
          <h2 className="whitespace-pre-line" style={{ fontFamily: "var(--font-display)", fontSize: "clamp(20px, 3.5vw, 32px)", letterSpacing: "0.04em", color: "var(--color-pass-paper)", fontWeight: 500, lineHeight: 1.15, marginBottom: 16 }}>
            {narrativeHeading(filterMode, flights.length)}
          </h2>
          <p className="text-body-sm leading-loose max-w-xl" style={{ color: "var(--color-label-grey)", fontFamily: "var(--font-mono)" }}>
            {narrativeBody(filterMode, flights.length, dateRange)}
          </p>
        </div>
      )}

      {error && <ErrorBanner message={error} onRetry={onRetry} />}

      {loading ? (
        <LoadingGrid count={filterMode === "random" ? Math.min(randomCount, 9) : 6} />
      ) : flights.length > 0 ? (
        <PaginatedGrid flights={flights} passengerName={passengerName} onOpen={onOpen} onImageClick={onImageClick} />
      ) : (
        <EmptyState queried={queried} />
      )}
    </main>
  );
}
