import { useCallback, useMemo, useState } from "react";
import { APOD_MIN } from "../../constants";
import { fetchApodCollageCandidates } from "../../lib/apod";
import { useImagePreloadStream } from "../../hooks/useImagePreloadStream";
import { StarfieldCanvas } from "../layout/StarfieldCanvas";
import { CollageBg } from "./CollageBg";
import { GalaxyLoader } from "../ui/GalaxyLoader";
import { StatTile } from "../ui/StatTile";

interface NameModalProps {
  onSave: (name: string) => void;
}

type BackgroundMode = "galaxy" | "collage";

// Full-screen "who's claiming these flights?" gate shown until a passenger
// name is saved. Doubles as the app's visual introduction, with a toggle
// between an animated starfield and a live collage of archive thumbnails.
export function NameModal({ onSave }: NameModalProps) {
  const [value, setValue] = useState("");
  const [bgMode, setBgMode] = useState<BackgroundMode>("galaxy");
  const [collageCandidates, setCollageCandidates] = useState<string[]>([]);
  const [collageFetching, setCollageFetching] = useState(false);
  const { loadedUrls: collageUrls, isLoading: collageStreaming } = useImagePreloadStream(collageCandidates);
  const collageLoading = collageFetching || collageStreaming;

  const handleBgToggle = useCallback(async () => {
    const next: BackgroundMode = bgMode === "galaxy" ? "collage" : "galaxy";
    setBgMode(next);
    if (next === "collage") {
      setCollageFetching(true);
      setCollageCandidates([]);
      const candidates = await fetchApodCollageCandidates();
      setCollageFetching(false);
      setCollageCandidates(candidates);
    }
  }, [bgMode]);

  const archiveCount = useMemo(() => {
    const start = new Date(APOD_MIN);
    return Math.floor((new Date().getTime() - start.getTime()) / 86400000) + 1;
  }, []);

  function submit() {
    if (value.trim()) onSave(value.trim());
  }

  return (
    <main
      id="main-content"
      className="fixed inset-0 z-50 flex flex-col items-center justify-center p-6 outline-none"
      aria-labelledby="name-modal-title"
      style={{ background: bgMode === "collage" ? "transparent" : "var(--color-void)" }}
    >
      {bgMode === "galaxy" ? <StarfieldCanvas /> : <CollageBg urls={collageUrls} loading={collageLoading} />}

      {/* Toggle — fixed top-right of viewport, above everything */}
      <button
        onClick={handleBgToggle}
        disabled={collageLoading}
        aria-label={collageLoading ? "Loading archive images…" : bgMode === "galaxy" ? "Switch to archive collage background" : "Switch to galaxy background"}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-all focus-visible:outline-2 focus-visible:outline-offset-2"
        style={{
          position: "fixed",
          top: 16,
          right: 16,
          zIndex: "var(--z-overlay)",
          border: `1px solid ${collageLoading ? "rgba(255,77,0,0.35)" : "var(--color-navy-800)"}`,
          background: collageLoading ? "rgba(6,10,16,0.85)" : "rgba(6,10,16,0.72)",
          backdropFilter: "blur(8px)",
          color: collageLoading ? "var(--color-core-orange-hover)" : "var(--color-navy-300)",
          fontFamily: "var(--font-mono)",
          fontSize: 8,
          letterSpacing: "0.18em",
          outlineColor: "var(--color-core-orange)",
          cursor: collageLoading ? "not-allowed" : "pointer",
          transition: "all 0.3s ease",
        }}
      >
        {collageLoading ? (
          <>
            <GalaxyLoader size={12} />
            SCANNING
          </>
        ) : bgMode === "galaxy" ? (
          <>
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
              <rect x="1" y="1" width="3.5" height="3.5" rx="0.5" fill="currentColor" opacity="0.5" />
              <rect x="5.5" y="1" width="3.5" height="3.5" rx="0.5" fill="currentColor" opacity="0.7" />
              <rect x="1" y="5.5" width="3.5" height="3.5" rx="0.5" fill="currentColor" opacity="0.7" />
              <rect x="5.5" y="5.5" width="3.5" height="3.5" rx="0.5" fill="currentColor" />
            </svg>
            ARCHIVE VIEW
          </>
        ) : (
          <>
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
              <circle cx="5" cy="5" r="1.5" fill="currentColor" />
              <circle cx="5" cy="1.5" r="0.7" fill="currentColor" opacity="0.6" />
              <circle cx="5" cy="8.5" r="0.7" fill="currentColor" opacity="0.6" />
              <circle cx="1.5" cy="5" r="0.7" fill="currentColor" opacity="0.6" />
              <circle cx="8.5" cy="5" r="0.7" fill="currentColor" opacity="0.6" />
            </svg>
            GALAXY VIEW
          </>
        )}
      </button>

      {/* All foreground content lifted above bg layers */}
      <div className="relative w-full flex flex-col items-center" style={{ zIndex: 2 }}>
        {/* Logo */}
        <div className="relative flex items-center gap-2.5 mb-10">
          <div className="flex items-center overflow-hidden rounded shrink-0" style={{ height: 28 }}>
            <div className="h-full relative flex items-center" style={{ background: "var(--color-dark-blue)", width: 22 }}>
              {[2, 1, 3, 1, 2, 1, 2].map((w, i) => (
                <div key={i} style={{ position: "absolute", left: 2 + i * 2.6, top: 4, width: w, bottom: 4, background: "var(--color-pass-paper)", opacity: 0.8 }} />
              ))}
            </div>
            <div className="h-full flex items-center px-2" style={{ background: "var(--color-pass-paper)" }}>
              <span style={{ fontFamily: "var(--font-display)", fontSize: 10, letterSpacing: "0.08em", color: "var(--color-ink)", fontWeight: 500 }}>FF</span>
            </div>
          </div>
          <div>
            <p style={{ fontFamily: "var(--font-display)", fontSize: 13, letterSpacing: "0.08em", color: "var(--color-pass-paper)", fontWeight: 500 }}>Frequent Flyer</p>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: 7, letterSpacing: "0.25em", color: "var(--color-navy-300)" }}>STARGAZING FROM JEZERO</p>
          </div>
        </div>

        {/* Retrieval card */}
        <div className="relative w-full rounded-2xl p-8" style={{ maxWidth: 420, background: "var(--color-panel)", border: "1px solid var(--color-navy-800)" }}>
          {/* Status */}
          <div className="flex items-center gap-2 mb-6">
            <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "var(--color-status-positive)" }} />
            <p className="text-label" style={{ fontFamily: "var(--font-mono)", letterSpacing: "var(--tracking-label)", color: "var(--color-status-positive-text)" }}>ARCHIVE TERMINAL · READY</p>
          </div>

          <p className="text-label tracking-label mb-2 font-bold" style={{ color: "var(--color-core-orange)", fontFamily: "var(--font-mono)" }}>PASS RETRIEVAL</p>
          <h1 id="name-modal-title" className="mb-3" style={{ fontFamily: "var(--font-display)", fontSize: 22, color: "var(--color-pass-paper)", letterSpacing: "0.03em", lineHeight: 1.25 }}>
            Who&apos;s claiming
            <br />
            these flights?
          </h1>
          <p className="mb-7" style={{ color: "var(--color-navy-200)", fontFamily: "var(--font-mono)", fontSize: 11, lineHeight: 1.85 }}>
            Enter your name to claim your boarding passes and relive every destination.
          </p>

          <label htmlFor="passenger-name" className="block text-label tracking-label mb-2 font-bold" style={{ color: "var(--color-navy-300)", fontFamily: "var(--font-mono)" }}>
            PASSENGER NAME
          </label>
          <div className="relative mb-5">
            <input
              id="passenger-name"
              type="text"
              autoComplete="name"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && value.trim()) submit(); }}
              placeholder="Enter your full name"
              className="w-full px-4 py-3.5 rounded-lg transition-all focus-visible:outline-2 focus-visible:outline-offset-2"
              style={{
                background: "var(--color-void)",
                border: `1px solid ${value.trim() ? "var(--color-core-orange)" : "var(--color-navy-800)"}`,
                color: "var(--color-pass-paper)",
                fontFamily: "var(--font-mono)",
                fontSize: 13,
                caretColor: "var(--color-core-orange)",
                outlineColor: "var(--color-core-orange)",
                letterSpacing: "0.04em",
              }}
            />
            {!value && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-label tracking-label" style={{ color: "var(--color-navy-300)", fontFamily: "var(--font-mono)", pointerEvents: "none" }}>
                ↵ RETRIEVE
              </div>
            )}
          </div>

          <button
            onClick={submit}
            disabled={!value.trim()}
            className="w-full py-3.5 rounded-lg font-bold tracking-label transition-all focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{
              background: value.trim() ? "var(--color-core-orange)" : "var(--color-panel)",
              color: value.trim() ? "#000" : "var(--color-navy-300)",
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              cursor: value.trim() ? "pointer" : "not-allowed",
              border: value.trim() ? "none" : "1px solid var(--color-navy-800)",
              outlineColor: "var(--color-core-orange)",
            }}
          >
            RETRIEVE PASSES
          </button>
        </div>

        {/* Archive stats row */}
        <div className="relative flex items-center gap-8 mt-8">
          <StatTile value={archiveCount.toLocaleString()} label="ENTRIES LOGGED" />
          <div style={{ width: 1, height: 36, background: "var(--color-navy-800)" }} />
          <StatTile value="1995" label="ARCHIVE SINCE" />
          <div style={{ width: 1, height: 36, background: "var(--color-navy-800)" }} />
          <StatTile value="∞" label="DESTINATIONS" />
        </div>

        <p className="relative text-center mt-5 text-label tracking-label" style={{ color: "var(--color-navy-300)", fontFamily: "var(--font-mono)" }}>
          YOUR NAME STAYS ON THIS DEVICE · NEVER LEAVES
        </p>
      </div>
    </main>
  );
}
