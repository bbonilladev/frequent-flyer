interface StatTileProps {
  value: string;
  label: string;
}

// A number-over-label stat, used in the name-gate's archive-stats row.
export function StatTile({ value, label }: StatTileProps) {
  return (
    <div className="text-center">
      <p style={{ fontFamily: "var(--font-display)", fontSize: 20, color: "var(--color-pass-paper)", letterSpacing: "var(--tracking-snug)" }}>
        {value}
      </p>
      <p style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-label)", letterSpacing: "0.15em", color: "var(--color-navy-300)", marginTop: 5 }}>
        {label}
      </p>
    </div>
  );
}
