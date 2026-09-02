export function Footer() {
  return (
    <footer
      className="mt-auto shrink-0"
      style={{ borderTop: "1px solid rgba(255,255,255,0.05)", background: "rgba(10,14,20,0.98)" }}
    >
      <div className="mx-auto px-4 md:px-8 flex items-center justify-between" style={{ maxWidth: 1120, height: 40 }}>
        {/* Left — location */}
        <div className="flex items-center gap-1.5">
          <svg width="9" height="11" viewBox="0 0 9 11" fill="none" aria-hidden="true">
            <path
              d="M4.5 0.5C2.57 0.5 1 2.07 1 4c0 2.625 3.5 6.5 3.5 6.5S8 6.625 8 4c0-1.93-1.57-3.5-3.5-3.5z"
              stroke="var(--color-navy-600)"
              strokeWidth="1"
              fill="none"
            />
            <circle cx="4.5" cy="4" r="1.2" fill="var(--color-navy-600)" />
          </svg>
          {/* Mobile: short */}
          <p className="text-label tracking-label sm:hidden" style={{ color: "var(--color-navy-600)", fontFamily: "var(--font-mono)" }}>
            JEZERO CRATER, MARS
          </p>
          {/* Desktop: full */}
          <p className="text-label tracking-label hidden sm:block" style={{ color: "var(--color-navy-600)", fontFamily: "var(--font-mono)" }}>
            TRANSMITTED FROM · JEZERO CRATER, MARS
          </p>
        </div>

        {/* Right — APOD link */}
        <a
          href="https://apod.nasa.gov/apod/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-label tracking-label transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 rounded -my-2.5 py-2.5"
          style={{ color: "var(--color-navy-600)", fontFamily: "var(--font-mono)", outlineColor: "var(--color-core-orange)" }}
        >
          APOD ARCHIVE ↗
        </a>
      </div>
    </footer>
  );
}
