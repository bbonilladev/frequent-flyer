interface RandomCountInputProps {
  value: number;
  onChange: (n: number) => void;
}

export function RandomCountInput({ value, onChange }: RandomCountInputProps) {
  const clamp = (n: number) => Math.max(1, Math.min(50, n));
  const countId = "random-count-val";

  return (
    <div
      // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role -- a fieldset would need a <legend>, redesigning this control's layout.
      role="group"
      aria-label="Number of random images"
      className="flex items-stretch rounded-lg overflow-hidden shrink-0"
      style={{ border: "1px solid var(--color-navy-700)", height: 40 }}
    >
      <button
        onClick={() => onChange(clamp(value - 1))}
        className="flex items-center justify-center transition-colors hover:bg-white/5 focus-visible:outline-2 focus-visible:-outline-offset-2"
        style={{ width: 36, background: "#121820", color: "var(--color-label-grey)", borderRight: "1px solid var(--color-navy-700)", flexShrink: 0, outlineColor: "var(--color-core-orange)" }}
        aria-label="Decrease count"
        aria-controls={countId}
      >
        <svg width="10" height="2" viewBox="0 0 10 2" fill="none" aria-hidden="true">
          <line x1="1" y1="1" x2="9" y2="1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
      <div
        id={countId}
        className="flex items-center justify-center"
        style={{ width: 48, background: "#121820", color: "var(--color-pass-paper)", fontFamily: "var(--font-mono)", fontSize: 14, fontWeight: 700 }}
        aria-live="polite"
        aria-atomic="true"
        aria-label={`${value} images`}
      >
        {value}
      </div>
      <button
        onClick={() => onChange(clamp(value + 1))}
        className="flex items-center justify-center transition-colors hover:bg-white/5 focus-visible:outline-2 focus-visible:-outline-offset-2"
        style={{ width: 36, background: "#121820", color: "var(--color-label-grey)", borderLeft: "1px solid var(--color-navy-700)", flexShrink: 0, outlineColor: "var(--color-core-orange)" }}
        aria-label="Increase count"
        aria-controls={countId}
      >
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
          <line x1="5" y1="1" x2="5" y2="9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="1" y1="5" x2="9" y2="5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}
