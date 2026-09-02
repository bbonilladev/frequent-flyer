interface ErrorBannerProps {
  message: string;
  onRetry: () => void;
}

export function ErrorBanner({ message, onRetry }: ErrorBannerProps) {
  return (
    <div role="alert" className="rounded-lg px-4 py-3 flex items-center gap-3 mb-5" style={{ background: "rgba(255,77,0,0.08)", border: "1px solid rgba(255,77,0,0.2)" }}>
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
        <path d="M7 1.5L13 12.5H1L7 1.5Z" stroke="var(--color-core-orange)" strokeWidth="1.1" />
        <line x1="7" y1="6" x2="7" y2="9" stroke="var(--color-core-orange)" strokeWidth="1.1" strokeLinecap="round" />
        <circle cx="7" cy="11" r="0.6" fill="var(--color-core-orange)" />
      </svg>
      <span className="flex-1 text-body-sm" style={{ color: "var(--color-core-orange-hover)", fontFamily: "var(--font-mono)" }}>{message}</span>
      <button onClick={onRetry} className="text-caption tracking-wider underline" style={{ color: "var(--color-core-orange)", fontFamily: "var(--font-mono)" }}>
        RETRY
      </button>
    </div>
  );
}
