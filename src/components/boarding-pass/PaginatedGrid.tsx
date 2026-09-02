import { useState } from "react";
import type { ApodEntry } from "../../types";
import { usePageSize } from "../../hooks/usePageSize";
import { BoardingPass } from "./BoardingPass";

interface PaginatedGridProps {
  flights: ApodEntry[];
  passengerName: string;
  onOpen: (entry: ApodEntry) => void;
  onImageClick: (src: string, alt: string) => void;
}

export function PaginatedGrid({
  flights,
  passengerName,
  onOpen,
  onImageClick,
}: PaginatedGridProps) {
  const pageSize = usePageSize();
  const [page, setPage] = useState(0);

  const [resetKey, setResetKey] = useState({ flights, pageSize });
  if (resetKey.flights !== flights || resetKey.pageSize !== pageSize) {
    setResetKey({ flights, pageSize });
    setPage(0);
  }

  const totalPages = Math.ceil(flights.length / pageSize);
  const slice = flights.slice(page * pageSize, page * pageSize + pageSize);
  const cols = pageSize === 2 ? 1 : 2;

  return (
    <div>
      <div
        className="grid gap-4"
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
      >
        {slice.map((entry) => (
          <BoardingPass
            key={entry.date}
            entry={entry}
            passengerName={passengerName}
            onOpen={() => onOpen(entry)}
            onImageClick={onImageClick}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div
          className="flex items-center justify-between mt-8 pt-6"
          style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
        >
          {/* Prev */}
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 9,
              letterSpacing: "var(--tracking-label)",
              color:
                page === 0 ? "var(--color-navy-700)" : "var(--color-navy-200)",
              background: page === 0 ? "transparent" : "rgba(255,255,255,0.04)",
              border: "1px solid var(--color-navy-800)",
              cursor: page === 0 ? "not-allowed" : "pointer",
              outlineColor: "var(--color-core-orange)",
            }}
            aria-label="Previous page"
          >
            <svg
              width="10"
              height="10"
              viewBox="0 0 10 10"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M7 1L3 5L7 9"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            PREV
          </button>

          {/* Page dots — each button's hit area is 24x24 (WCAG 2.5.8 target
              size minimum) even though the visible dot itself stays small */}
          <div className="flex items-center" role="group" aria-label="Pages">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                aria-label={`Page ${i + 1}`}
                aria-current={i === page ? "page" : undefined}
                className="flex items-center justify-center shrink-0"
                style={{
                  width: 24,
                  height: 24,
                  cursor: "pointer",
                  border: "none",
                  padding: 0,
                  background: "transparent",
                }}
              >
                <span
                  aria-hidden="true"
                  className="block transition-all"
                  style={{
                    width: i === page ? 20 : 6,
                    height: 6,
                    borderRadius: 3,
                    background:
                      i === page
                        ? "var(--color-core-orange)"
                        : "var(--color-navy-800)",
                  }}
                />
              </button>
            ))}
          </div>

          {/* Next */}
          <button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page === totalPages - 1}
            className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 9,
              letterSpacing: "var(--tracking-label)",
              color:
                page === totalPages - 1
                  ? "var(--color-navy-700)"
                  : "var(--color-navy-200)",
              background:
                page === totalPages - 1
                  ? "transparent"
                  : "rgba(255,255,255,0.04)",
              border: "1px solid var(--color-navy-800)",
              cursor: page === totalPages - 1 ? "not-allowed" : "pointer",
              outlineColor: "var(--color-core-orange)",
            }}
            aria-label="Next page"
          >
            NEXT
            <svg
              width="10"
              height="10"
              viewBox="0 0 10 10"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M3 1L7 5L3 9"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
