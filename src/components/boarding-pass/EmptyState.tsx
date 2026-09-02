interface EmptyStateProps {
  queried: boolean;
}

export function EmptyState({ queried }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-5">
      <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
        <circle cx="28" cy="28" r="24" stroke="var(--color-navy-800)" strokeWidth="1.5" />
        <circle cx="28" cy="28" r="14" stroke="var(--color-navy-800)" strokeWidth="1" strokeDasharray="3 4" />
        <circle cx="28" cy="28" r="4" fill="var(--color-navy-800)" />
      </svg>
      <div className="text-center">
        <p className="text-md tracking-widest mb-1.5" style={{ color: "var(--color-label-grey)", fontFamily: "var(--font-mono)" }}>
          {queried ? "NO FLIGHTS FOUND" : "FLIGHT LOG EMPTY"}
        </p>
        <p className="text-caption" style={{ color: "var(--color-navy-700)", fontFamily: "var(--font-mono)" }}>
          {queried ? "Try a different date range." : "Select dates or retrieve random flights."}
        </p>
      </div>
    </div>
  );
}
