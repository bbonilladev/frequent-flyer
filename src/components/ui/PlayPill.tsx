interface PlayPillProps {
  size: "sm" | "lg";
}

// Absolutely-centered play-triangle + "watch on APOD" pill overlaid on video
// thumbnails. `sm` is the compact single-line badge used on grid cards; `lg`
// is the two-line badge used on the arrival modal's video embed.
export function PlayPill({ size }: PlayPillProps) {
  if (size === "sm") {
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="flex items-center gap-1.5 group-hover:scale-105 transition-transform duration-200"
          style={{ background: "rgba(0,0,0,0.68)", border: "1px solid rgba(255,77,0,0.4)", borderRadius: 999, padding: "5px 10px 5px 5px", backdropFilter: "blur(4px)" }}
        >
          <div className="flex items-center justify-center rounded-full shrink-0" style={{ width: 18, height: 18, background: "var(--color-core-orange)" }}>
            <svg width="7" height="7" viewBox="0 0 11 11" fill="none" aria-hidden="true">
              <polygon points="3,1.5 10,5.5 3,9.5" fill="#000" />
            </svg>
          </div>
          <div className="flex items-center gap-0.5" style={{ color: "var(--color-pass-paper)", fontFamily: "var(--font-mono)", fontSize: 6, letterSpacing: "0.18em" }}>
            <span>APOD</span>
            <svg width="5" height="5" viewBox="0 0 9 9" fill="none" aria-hidden="true">
              <path d="M1 8L8 1M8 1H4M8 1V5" stroke="var(--color-core-orange)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div
        className="flex items-center gap-2.5 transition-all duration-200 group-hover:scale-105"
        style={{ background: "rgba(0,0,0,0.68)", border: "1px solid rgba(255,77,0,0.45)", borderRadius: 999, padding: "10px 18px 10px 12px", backdropFilter: "blur(6px)" }}
      >
        <div className="flex items-center justify-center rounded-full shrink-0" style={{ width: 28, height: 28, background: "var(--color-core-orange)" }}>
          <svg width="11" height="11" viewBox="0 0 11 11" fill="none" aria-hidden="true">
            <polygon points="3,1.5 10,5.5 3,9.5" fill="#000" />
          </svg>
        </div>
        <div>
          <p style={{ fontFamily: "var(--font-mono)", fontSize: 8, letterSpacing: "0.22em", color: "rgba(255,255,255,0.55)", marginBottom: 2 }}>WATCH ON</p>
          <div className="flex items-center gap-1" style={{ color: "var(--color-pass-paper)", fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.18em", fontWeight: 700 }}>
            <span>NASA APOD</span>
            <svg width="8" height="8" viewBox="0 0 9 9" fill="none" aria-hidden="true">
              <path d="M1 8L8 1M8 1H4M8 1V5" stroke="var(--color-core-orange)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
