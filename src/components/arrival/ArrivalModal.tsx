import { useState } from "react";
import type { ApodEntry } from "../../types";
import { flightCode, formatDisplayDate, seededMiles } from "../../lib/format";
import { Modal } from "../ui/Modal";
import { CloseButton } from "../ui/CloseButton";
import { Barcode } from "../ui/Barcode";
import { DataField } from "../ui/DataField";
import { Perforation } from "../ui/Perforation";
import { VideoEmbed } from "./VideoEmbed";

interface ArrivalModalProps {
  entry: ApodEntry;
  passengerName: string;
  onClose: () => void;
  onImageClick: (src: string, alt: string) => void;
}

export function ArrivalModal({ entry, passengerName, onClose, onImageClick }: ArrivalModalProps) {
  const titleId = `arrival-title-${entry.date}`;
  const miles = seededMiles(entry.date);
  const isVideo = entry.media_type === "video";
  const code = flightCode(entry.date);
  const [imgHover, setImgHover] = useState(false);

  const dataFields: { label: string; value: string }[] = [
    { label: "PASSENGER", value: passengerName.toUpperCase() },
    { label: "DATE LOGGED", value: formatDisplayDate(entry.date) },
    { label: "ORIGIN", value: "JEZERO CRATER" },
    { label: "FLIGHT", value: code },
    { label: "MILES EARNED", value: miles },
    ...(entry.copyright ? [{ label: "PHOTO CREDIT", value: entry.copyright.trim() }] : []),
  ];

  return (
    <Modal onClose={onClose} ariaLabelledBy={titleId} background="rgba(5,8,14,0.94)" blur={12} zIndex="var(--z-modal)" className="p-4">
      {(closeButtonRef) => (
        <>
          {/* Close button — outside the pass so it doesn't break the paper aesthetic */}
          <CloseButton ref={closeButtonRef} onClick={onClose} label="Close arrival log" size="sm" className="absolute top-4 right-4 z-10" />

          {/* The boarding pass — cream paper */}
          <div
            className="relative w-full flex flex-col overflow-hidden"
            style={{ maxWidth: 680, maxHeight: "92vh", background: "var(--color-pass-paper)", boxShadow: "0 32px 96px rgba(0,0,0,0.9)", borderRadius: "var(--radius-modal)", overflowY: "auto" }}
          >
            {/* Top strip — dark blue like the barcode stub on the mini pass */}
            <div className="flex items-stretch shrink-0" style={{ background: "var(--color-dark-blue)", minHeight: 44 }}>
              <div className="flex items-center px-2.5 sm:px-4 py-2 shrink-0" style={{ borderRight: "1px solid rgba(245,242,236,0.1)" }}>
                <Barcode seed={entry.date} height={28} />
              </div>
              {/* Grid on narrow screens (each field gets a full half-width
                  cell) so values like "JEZERO CRATER" don't get squeezed
                  down to one truncated character; a single row once there's
                  room for it. */}
              <div className="grid grid-cols-2 sm:flex sm:items-center gap-x-3 sm:gap-6 gap-y-2 px-3 sm:px-5 py-2 sm:py-0 flex-1 min-w-0">
                <DataField tone="strip" label="FLIGHT" value={code} valueSize={11} valueTracking="0.15em" />
                <DataField tone="strip" label="FROM" value="JEZERO CRATER" valueSize={11} valueTracking="0.1em" />
                <DataField tone="strip" label="DATE" value={formatDisplayDate(entry.date)} valueSize={11} valueTracking="0.1em" />
                <div className="sm:ml-auto shrink-0">
                  <DataField tone="strip" label="CLASS" value="DEEP SPACE" valueSize={11} valueTracking="0.1em" accent />
                </div>
              </div>
            </div>

            {/* Image — clickable with hover overlay, no separate button */}
            <div
              className="relative shrink-0 overflow-hidden"
              style={{ height: 240, cursor: isVideo ? "default" : "pointer" }}
              onClick={() => { if (!isVideo) onImageClick(entry.hdurl || entry.url, entry.title); }}
              onMouseEnter={() => setImgHover(true)}
              onMouseLeave={() => setImgHover(false)}
              role={isVideo ? undefined : "button"}
              tabIndex={isVideo ? undefined : 0}
              aria-label={isVideo ? undefined : `View full image: ${entry.title}`}
              onKeyDown={(e) => {
                if (!isVideo && (e.key === "Enter" || e.key === " ")) {
                  e.preventDefault();
                  onImageClick(entry.hdurl || entry.url, entry.title);
                }
              }}
            >
              {isVideo ? (
                <VideoEmbed url={entry.url} title={entry.title} date={entry.date} thumbnailUrl={entry.thumbnail_url} />
              ) : (
                <>
                  <img
                    src={entry.url}
                    alt={entry.title}
                    className="w-full h-full object-cover"
                    style={{ transition: "transform 0.4s ease", transform: imgHover ? "scale(1.03)" : "scale(1)" }}
                  />
                  {/* Hover overlay */}
                  <div
                    className="absolute inset-0 flex flex-col items-center justify-center gap-2 transition-opacity"
                    style={{ background: "rgba(5,8,14,0.55)", opacity: imgHover ? 1 : 0, backdropFilter: imgHover ? "blur(2px)" : "none" }}
                  >
                    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
                      <circle cx="12" cy="12" r="9" stroke="var(--color-pass-paper)" strokeWidth="1.5" />
                      <line x1="19" y1="19" x2="26" y2="26" stroke="var(--color-pass-paper)" strokeWidth="1.5" strokeLinecap="round" />
                      <line x1="8" y1="12" x2="16" y2="12" stroke="var(--color-pass-paper)" strokeWidth="1.3" strokeLinecap="round" />
                      <line x1="12" y1="8" x2="12" y2="16" stroke="var(--color-pass-paper)" strokeWidth="1.3" strokeLinecap="round" />
                    </svg>
                    <p className="text-label tracking-label" style={{ color: "var(--color-pass-paper)", fontFamily: "var(--font-mono)", opacity: 0.85 }}>
                      VIEW FULL IMAGE
                    </p>
                  </div>
                  {/* Bottom gradient fade into paper */}
                  <div className="absolute inset-x-0 bottom-0 h-16 pointer-events-none" style={{ background: "linear-gradient(to bottom, transparent, var(--color-pass-paper))" }} />
                </>
              )}
            </div>

            <Perforation orientation="horizontal" holeColor="rgba(5,8,14,0.94)" />

            {/* Body — cream paper data section */}
            <div className="px-6 pb-7">
              <p className="text-label tracking-label mb-1 font-bold" style={{ color: "var(--color-core-orange-on-paper)", fontFamily: "var(--font-mono)" }}>
                BOARDING PASS · ARRIVAL LOG
              </p>
              <h2
                id={titleId}
                className="leading-tight mb-4"
                style={{ fontFamily: "var(--font-display)", fontSize: "clamp(15px, 3vw, 22px)", color: "var(--color-ink)", letterSpacing: "0.04em" }}
              >
                {entry.title}
              </h2>

              <p className="leading-relaxed mb-5" style={{ color: "#4A5562", fontFamily: "var(--font-mono)", fontSize: 11, lineHeight: "1.85" }}>
                {entry.explanation}
              </p>

              {/* Data grid — boarding pass fields */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-4 pt-4" style={{ borderTop: "1.5px solid rgba(26,26,26,0.12)" }}>
                {dataFields.map((field) => (
                  <DataField key={field.label} label={field.label} value={field.value} valueSize={11} labelSize={9} labelColor="rgba(26,26,26,0.5)" truncate uppercaseLabel />
                ))}
              </div>
            </div>

            {/* Bottom orange accent rail */}
            <div className="shrink-0" style={{ height: 5, background: "linear-gradient(90deg, var(--color-core-orange) 0%, var(--color-core-orange-active) 100%)" }} />
          </div>
        </>
      )}
    </Modal>
  );
}
