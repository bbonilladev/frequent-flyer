import { SKELETON_DELAYS } from "../../constants";

interface CollageBgProps {
  urls: string[];
  loading: boolean;
}

// Full-viewport 6x3 grid of archive thumbnails, breathing in as skeleton
// squares until their image arrives — the alt background for the name gate.
export function CollageBg({ urls, loading }: CollageBgProps) {
  const slots = Array.from({ length: 18 }, (_, i) => urls[i] ?? null);

  return (
    <div className="pointer-events-none" aria-hidden="true" style={{ position: "fixed", inset: 0, zIndex: 1 }}>
      {/* Base fill */}
      <div style={{ position: "absolute", inset: 0, background: "var(--color-void)" }} />

      {/* Grid — skeleton cells breathe until their image arrives */}
      <div style={{ position: "absolute", inset: 0, display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gridTemplateRows: "repeat(3, 1fr)", gap: 2 }}>
        {slots.map((url, i) => (
          <div key={i} style={{ overflow: "hidden", position: "relative", background: "#060A10" }}>
            {url ? (
              <img
                src={url}
                alt=""
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", filter: "saturate(0.45) brightness(0.55)", animation: "fadeIn 0.9s ease-out" }}
              />
            ) : (
              /* Breathing skeleton square */
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(135deg, var(--color-navy-900) 0%, #111E30 50%, var(--color-navy-900) 100%)",
                  animationName: "breathe",
                  animationDuration: "2.2s",
                  animationTimingFunction: "ease-in-out",
                  animationIterationCount: "infinite",
                  animationDelay: `${SKELETON_DELAYS[i] ?? 0}s`,
                  opacity: loading ? 1 : 0,
                  transition: "opacity 0.5s ease",
                }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Flat dim + radial vignette */}
      <div style={{ position: "absolute", inset: 0, background: "rgba(6,10,16,0.62)" }} />
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 65% 65% at 50% 50%, rgba(6,10,16,0.05) 0%, rgba(6,10,16,0.85) 100%)" }} />
    </div>
  );
}
