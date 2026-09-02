interface DataFieldProps {
  label: string;
  value: string;
  tone?: "paper" | "strip";
  accent?: boolean;
  valueSize?: number;
  valueTracking?: string;
  labelSize?: number;
  labelColor?: string;
  truncate?: boolean;
  uppercaseLabel?: boolean;
  className?: string;
}

// Label colors are tuned for 4.5:1 contrast (WCAG AA) against their surface:
// --color-paper-label on pass-paper, and a 0.6-alpha paper white on the
// dark-blue strip (0.4 alpha measured at 2.75:1, below the AA minimum).
const TONE_STYLE = {
  paper: { label: "var(--color-paper-label)", value: "var(--color-ink)", accent: "var(--color-gold-dark)", labelSize: 8, tracking: "var(--tracking-label)" },
  strip: { label: "rgba(245,242,236,0.6)", value: "var(--color-pass-paper)", accent: "var(--color-core-orange-hover)", labelSize: 7, tracking: "0.22em" },
};

// Label-above-value pair used across the boarding pass card, the arrival
// modal's top strip, and its data grid — the one shape hand-rolled three
// different ways in the original prototype.
export function DataField({
  label,
  value,
  tone = "paper",
  accent = false,
  valueSize = 10,
  valueTracking,
  labelSize,
  labelColor,
  truncate = true,
  uppercaseLabel = false,
  className,
}: DataFieldProps) {
  const style = TONE_STYLE[tone];
  return (
    <div className={`min-w-0 ${className ?? ""}`}>
      <p
        className={uppercaseLabel ? "uppercase" : undefined}
        style={{ fontFamily: "var(--font-mono)", fontSize: labelSize ?? style.labelSize, letterSpacing: style.tracking, color: labelColor ?? style.label }}
      >
        {label}
      </p>
      <p
        className={`font-bold leading-tight ${truncate ? "truncate" : ""}`}
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: valueSize,
          letterSpacing: valueTracking,
          color: accent ? style.accent : style.value,
          maxWidth: "100%",
        }}
      >
        {value}
      </p>
    </div>
  );
}
