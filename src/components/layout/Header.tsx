import { UserMenu } from "./UserMenu";

interface HeaderProps {
  passengerName: string;
  onEditName: () => void;
  onSignOut: () => void;
  onGoHome: () => void;
}

export function Header({ passengerName, onEditName, onSignOut, onGoHome }: HeaderProps) {
  return (
    <header
      style={{
        background: "rgba(10,14,20,0.96)",
        backdropFilter: "blur(14px)",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        position: "sticky",
        top: 0,
        zIndex: "var(--z-sticky)",
      }}
    >
      <div className="mx-auto px-4 md:px-8 flex items-center justify-between py-3" style={{ maxWidth: 1120 }}>
        <button
          type="button"
          onClick={onGoHome}
          className="flex items-center gap-3 -m-2 p-2 rounded-lg text-left transition-colors hover:bg-white/5"
        >
          <div className="flex items-center overflow-hidden rounded shrink-0" aria-hidden="true" style={{ height: 26 }}>
            <div className="h-full flex items-center px-1.5 relative" style={{ background: "var(--color-dark-blue)", width: 24 }}>
              {[2, 2, 2, 2].map((w, i) => (
                <div key={i} style={{ position: "absolute", left: 3 + i * 6, top: 5, width: w, bottom: 5, background: "var(--color-pass-paper)", opacity: 0.9 }} />
              ))}
            </div>
            <div className="h-full flex items-center px-2.5" style={{ background: "var(--color-pass-paper)" }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.167em", color: "var(--color-ink)", fontWeight: 700 }}>FF</span>
            </div>
          </div>
          <div>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(15px, 2.2vw, 20px)", letterSpacing: "0.067em", color: "var(--color-pass-paper)", lineHeight: 1, fontWeight: 500 }}>
              Frequent Flyer
            </h1>
            <p className="text-3xs tracking-[0.214em] mt-0.5 hidden sm:block" style={{ color: "var(--color-navy-700)", fontFamily: "var(--font-mono)" }}>
              STARGAZING FROM JEZERO
            </p>
          </div>
        </button>
        <div className="flex items-center gap-3">
          <UserMenu name={passengerName} onEditName={onEditName} onSignOut={onSignOut} />
        </div>
      </div>
    </header>
  );
}
