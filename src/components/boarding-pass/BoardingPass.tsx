import type { ApodEntry } from "../../types";
import {
  flightCode,
  seededMiles,
  formatDisplayDate,
  apodPageUrl,
} from "../../lib/format";
import { Barcode } from "../ui/Barcode";
import { Perforation } from "../ui/Perforation";
import { DataField } from "../ui/DataField";
import { PlayPill } from "../ui/PlayPill";
import { VideoThumbnail } from "../arrival/VideoThumbnail";

interface BoardingPassProps {
  entry: ApodEntry;
  passengerName: string;
  onOpen: () => void;
  onImageClick: (url: string, title: string) => void;
}

// A single flight-log entry rendered as a boarding pass: barcode stub, image
// panel (photo or video link), perforation, and a small passenger data grid.
export function BoardingPass({
  entry,
  passengerName,
  onOpen,
  onImageClick,
}: BoardingPassProps) {
  const code = flightCode(entry.date);
  const miles = seededMiles(entry.date);
  const isVideo = entry.media_type === "video";

  return (
    <article
      className="@container group relative rounded-card overflow-hidden cursor-pointer transition-[transform,box-shadow] duration-250 ease-out hover:-translate-y-0.75 shadow-(--shadow-card) hover:shadow-(--shadow-card-hover)"
      style={{
        background: "var(--color-pass-paper)",
        borderLeft: "3px solid var(--color-core-orange)",
      }}
      onClick={onOpen}
    >
      <div className="flex" style={{ minHeight: 148 }}>
        {/* Stub: barcode strip */}
        <div
          className="shrink-0 flex flex-col items-center justify-between py-3"
          style={{
            width: "10.9%",
            minWidth: 32,
            background: "var(--color-dark-blue)",
            paddingLeft: 6,
            paddingRight: 6,
          }}
        >
          <Barcode seed={entry.date} height={72} />
          <span
            className="text-3xs whitespace-nowrap"
            style={{
              color: "rgba(245,242,236,0.9)",
              fontFamily: "var(--font-mono)",
              writingMode: "vertical-rl",
              transform: "rotate(180deg)",
              letterSpacing: "1.5px",
              marginTop: 8,
            }}
          >
            {code}
          </span>
        </div>

        {/* Image panel */}
        <div
          className="relative shrink-0 overflow-hidden w-23 @md:w-32.5"
          style={{ alignSelf: "stretch" }}
          role={isVideo ? undefined : "button"}
          tabIndex={isVideo ? undefined : 0}
          aria-label={isVideo ? undefined : `View full image: ${entry.title}`}
          onClick={(e) => {
            e.stopPropagation();
            if (!isVideo) onImageClick(entry.hdurl || entry.url, entry.title);
          }}
          onKeyDown={(e) => {
            if (!isVideo && (e.key === "Enter" || e.key === " ")) {
              e.preventDefault();
              e.stopPropagation();
              onImageClick(entry.hdurl || entry.url, entry.title);
            }
          }}
        >
          {isVideo ? (
            <a
              href={apodPageUrl(entry.date)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`View on NASA APOD: ${entry.title}`}
              onClick={(e) => e.stopPropagation()}
              className="group relative block w-full h-full"
              style={{ background: "var(--color-void)" }}
            >
              <VideoThumbnail
                url={entry.url}
                thumbnailUrl={entry.thumbnail_url}
                className="w-full h-full object-cover"
                style={{ filter: "brightness(0.6) saturate(0.7)" }}
              />
              <PlayPill size="sm" />
            </a>
          ) : (
            <>
              <img
                src={entry.url}
                alt={entry.title}
                className="w-full h-full object-cover absolute inset-0 transition-transform duration-300 group-hover:scale-105"
              />
              {/* Magnify hint */}
              <div
                className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: "rgba(0,0,0,0.35)" }}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  aria-hidden="true"
                >
                  <circle cx="8" cy="8" r="6" stroke="#fff" strokeWidth="1.5" />
                  <line
                    x1="13"
                    y1="13"
                    x2="18"
                    y2="18"
                    stroke="#fff"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <line
                    x1="5"
                    y1="8"
                    x2="11"
                    y2="8"
                    stroke="#fff"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                  />
                  <line
                    x1="8"
                    y1="5"
                    x2="8"
                    y2="11"
                    stroke="#fff"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </>
          )}
        </div>

        <Perforation
          orientation="vertical"
          holeColor="var(--color-deep-space)"
          dashColor="rgba(10,14,20,0.18)"
        />

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onOpen();
          }}
          aria-label={`Open flight log for ${entry.title}`}
          className="flex-1 flex flex-col justify-between py-3.5 pr-5 pl-3 min-w-0 text-left"
        >
          {/* Header row */}
          <div className="flex items-start justify-between gap-2 mb-1">
            <p
              className="text-label tracking-label font-bold leading-tight"
              style={{
                color: "var(--color-core-orange-on-paper)",
                fontFamily: "var(--font-mono)",
              }}
            >
              BOARDING PASS
            </p>
            <p
              className="text-label tracking-label shrink-0"
              style={{
                color: "var(--color-paper-label)",
                fontFamily: "var(--font-mono)",
              }}
            >
              {code}
            </p>
          </div>

          {/* Destination title */}
          <h3
            className="leading-tight mb-2 flex-1"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(11px, 1.8vw, 13px)",
              color: "var(--color-ink)",
              letterSpacing: "0.077em",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {entry.title}
          </h3>

          {/* Data grid */}
          <div
            className="grid grid-cols-1 @md:grid-cols-2 gap-x-4 gap-y-1.5 pt-2"
            style={{ borderTop: "1px solid rgba(26,26,26,0.12)" }}
          >
            <DataField label="PASSENGER" value={passengerName.toUpperCase()} />
            <DataField label="LOGGED" value={formatDisplayDate(entry.date)} />
            <DataField label="FROM" value="JEZERO CRATER" />
            <DataField label="MILES" value={miles} accent />
          </div>
        </button>
      </div>
    </article>
  );
}
