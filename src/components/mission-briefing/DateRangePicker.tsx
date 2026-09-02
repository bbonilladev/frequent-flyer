import { useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { DateRange } from "../../types";
import { APOD_MIN, MONTH_NAMES, TODAY, WEEKDAYS } from "../../constants";
import {
  addMonths,
  daysInMonth,
  firstDayOfWeek,
  rangeLabel,
} from "../../lib/format";
import { useClickOutside } from "../../hooks/useClickOutside";

interface DateRangePickerProps {
  value: DateRange;
  onChange: (r: DateRange) => void;
  onActivate?: () => void;
}

type HeaderMode = "days" | "months" | "years";

export function DateRangePicker({
  value,
  onChange,
  onActivate,
}: DateRangePickerProps) {
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState<string | null>(null);
  const [phase, setPhase] = useState<"start" | "end">("start");
  const [viewYM, setViewYM] = useState(() =>
    (value.start ?? TODAY).slice(0, 7),
  );
  const [headerMode, setHeaderMode] = useState<HeaderMode>("days");
  const [dropdownPos, setDropdownPos] = useState<{ top: number; left: number }>(
    { top: 0, left: 0 },
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  useClickOutside([containerRef, dropdownRef], () => setOpen(false), open);

  function openDropdown() {
    if (triggerRef.current) {
      const r = triggerRef.current.getBoundingClientRect();
      setDropdownPos({ top: r.bottom + 8, left: r.left });
    }
    setOpen((o) => {
      if (!o) onActivate?.();
      else setHeaderMode("days");
      return !o;
    });
  }

  function click(d: string) {
    if (phase === "start" || !value.start) {
      onChange({ start: d, end: null });
      setPhase("end");
      return;
    }
    if (d === value.start) {
      onChange({ start: d, end: d });
      setOpen(false);
      setPhase("start");
    } else if (d < value.start) {
      onChange({ start: d, end: null });
      setPhase("end");
    } else {
      onChange({ start: value.start, end: d });
      setOpen(false);
      setPhase("start");
    }
  }

  function isInRange(d: string) {
    const { start } = value;
    const eff = value.end ?? hover;
    if (!start || !eff) return false;
    const lo = start <= eff ? start : eff;
    const hi = start <= eff ? eff : start;
    return d > lo && d < hi;
  }

  const [year, month] = viewYM.split("-").map(Number);
  const total = daysInMonth(viewYM);
  const startDow = firstDayOfWeek(viewYM);

  const cells: (string | null)[] = [
    ...Array(startDow).fill(null),
    ...Array.from({ length: total }, (_, i) => {
      const d = String(i + 1).padStart(2, "0");
      return `${year}-${String(month).padStart(2, "0")}-${d}`;
    }),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const hasValue = value.start || value.end;

  return (
    <div ref={containerRef} className="relative" style={{ flex: "0 0 auto" }}>
      {/* Trigger — a styled row containing two independent buttons (open
          calendar / clear dates) rather than one button nested inside
          another: ARIA forbids nesting interactive controls. */}
      <div
        ref={triggerRef}
        className="flex items-center transition-colors rounded-lg"
        style={{
          height: 40,
          background: "var(--color-panel)",
          border: `1px solid ${open ? "var(--color-core-orange)" : "var(--color-navy-700)"}`,
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          whiteSpace: "nowrap",
          minWidth: 0,
          maxWidth: 280,
        }}
      >
        <button
          type="button"
          onClick={openDropdown}
          aria-haspopup="dialog"
          aria-expanded={open}
          className="flex items-center gap-2 px-3 flex-1 min-w-0 h-full text-left rounded-lg"
          style={{
            color: hasValue ? "var(--color-navy-200)" : "var(--color-navy-700)",
          }}
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            aria-hidden="true"
            style={{ flexShrink: 0 }}
          >
            <rect
              x="1"
              y="1.5"
              width="10"
              height="9.5"
              rx="1.5"
              stroke={
                hasValue ? "var(--color-core-orange)" : "var(--color-navy-700)"
              }
              strokeWidth="1.1"
            />
            <line
              x1="4"
              y1="0.5"
              x2="4"
              y2="3"
              stroke={
                hasValue ? "var(--color-core-orange)" : "var(--color-navy-700)"
              }
              strokeWidth="1.1"
              strokeLinecap="round"
            />
            <line
              x1="8"
              y1="0.5"
              x2="8"
              y2="3"
              stroke={
                hasValue ? "var(--color-core-orange)" : "var(--color-navy-700)"
              }
              strokeWidth="1.1"
              strokeLinecap="round"
            />
            <line
              x1="1"
              y1="5"
              x2="11"
              y2="5"
              stroke={
                hasValue ? "var(--color-core-orange)" : "var(--color-navy-700)"
              }
              strokeWidth="1.1"
            />
          </svg>
          <span className="flex-1 truncate" style={{ maxWidth: 180 }}>
            {rangeLabel(value)}
          </span>
        </button>
        {hasValue && (
          <button
            type="button"
            onClick={() => {
              onChange({ start: null, end: null });
              setPhase("start");
            }}
            aria-label="Clear dates"
            className="flex items-center justify-center rounded-full mr-1.5"
            style={{
              width: 24,
              height: 24,
              color: "var(--color-label-grey)",
              flexShrink: 0,
            }}
          >
            <svg
              width="7"
              height="7"
              viewBox="0 0 7 7"
              fill="none"
              aria-hidden="true"
            >
              <line
                x1="0.5"
                y1="0.5"
                x2="6.5"
                y2="6.5"
                stroke="currentColor"
                strokeWidth="1.1"
                strokeLinecap="round"
              />
              <line
                x1="6.5"
                y1="0.5"
                x2="0.5"
                y2="6.5"
                stroke="currentColor"
                strokeWidth="1.1"
                strokeLinecap="round"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Dropdown — portaled to <body> so it escapes any ancestor stacking context */}
      {open &&
        createPortal(
          <div
            ref={dropdownRef}
            className="rounded-xl p-4"
            style={{
              position: "fixed",
              top: dropdownPos.top,
              left: dropdownPos.left,
              zIndex: "var(--z-dropdown)",
              background: "var(--color-panel)",
              border: "1px solid var(--color-navy-800)",
              boxShadow: "var(--shadow-panel)",
              minWidth: 256,
            }}
          >
            {/* Hint */}
            <p
              className="text-label tracking-label mb-3"
              style={{
                color: "var(--color-navy-300)",
                fontFamily: "var(--font-mono)",
              }}
              aria-live="polite"
              aria-atomic="true"
            >
              {phase === "start" ? "SELECT START DATE" : "SELECT END DATE"}
            </p>

            {/* Month nav */}
            <div className="flex items-center justify-between mb-3">
              <button
                onClick={() =>
                  setViewYM(
                    addMonths(viewYM, headerMode === "years" ? -12 : -1),
                  )
                }
                className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:bg-white/5"
                style={{
                  color: "var(--color-label-grey)",
                  border: "1px solid var(--color-navy-800)",
                }}
                aria-label="Previous"
              >
                <svg
                  width="8"
                  height="8"
                  viewBox="0 0 8 8"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M6 1L2 4L6 7"
                    stroke="currentColor"
                    strokeWidth="1.3"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
              <button
                onClick={() =>
                  setHeaderMode((m) =>
                    m === "days" ? "months" : m === "months" ? "years" : "days",
                  )
                }
                className="flex items-center gap-1.5 px-2 py-2 rounded-lg transition-colors hover:bg-white/5"
                style={{
                  color: "var(--color-pass-paper)",
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  letterSpacing: "0.1em",
                }}
              >
                {headerMode === "years"
                  ? `${year - 5} – ${year + 6}`
                  : headerMode === "months"
                    ? String(year)
                    : `${MONTH_NAMES[month - 1].slice(0, 3).toUpperCase()} ${year}`}
                <svg
                  width="8"
                  height="8"
                  viewBox="0 0 8 8"
                  fill="none"
                  aria-hidden="true"
                  style={{
                    color: "var(--color-label-grey)",
                    transform:
                      headerMode !== "days" ? "rotate(180deg)" : "none",
                    transition: "transform 0.15s",
                  }}
                >
                  <path
                    d="M1 2.5L4 5.5L7 2.5"
                    stroke="currentColor"
                    strokeWidth="1.3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <button
                onClick={() =>
                  setViewYM(addMonths(viewYM, headerMode === "years" ? 12 : 1))
                }
                className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:bg-white/5"
                style={{
                  color: "var(--color-label-grey)",
                  border: "1px solid var(--color-navy-800)",
                }}
                aria-label="Next"
              >
                <svg
                  width="8"
                  height="8"
                  viewBox="0 0 8 8"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M2 1L6 4L2 7"
                    stroke="currentColor"
                    strokeWidth="1.3"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>

            {/* Month picker */}
            {headerMode === "months" && (
              <div className="grid grid-cols-3 gap-1 mb-1">
                {MONTH_NAMES.map((name: string, i: number) => {
                  const mi = i + 1;
                  const ym = `${year}-${String(mi).padStart(2, "0")}`;
                  const active = mi === month;
                  const disabled =
                    ym > TODAY.slice(0, 7) || ym < APOD_MIN.slice(0, 7);
                  return (
                    <button
                      key={name}
                      disabled={disabled}
                      onClick={() => {
                        setViewYM(ym);
                        setHeaderMode("days");
                      }}
                      className="rounded-lg py-1.5 text-caption tracking-wider transition-colors"
                      style={{
                        fontFamily: "var(--font-mono)",
                        background: active
                          ? "var(--color-core-orange)"
                          : "transparent",
                        color: disabled
                          ? "var(--color-navy-700)"
                          : active
                            ? "#000"
                            : "var(--color-navy-200)",
                        fontWeight: active ? 700 : 400,
                        cursor: disabled ? "not-allowed" : "pointer",
                      }}
                    >
                      {name.slice(0, 3).toUpperCase()}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Year picker */}
            {headerMode === "years" &&
              (() => {
                const base = year - 5;
                return (
                  <div className="grid grid-cols-3 gap-1 mb-1">
                    {Array.from({ length: 12 }, (_, i) => base + i).map((y) => {
                      const disabled = y > new Date().getFullYear() || y < 1995;
                      const active = y === year;
                      return (
                        <button
                          key={y}
                          disabled={disabled}
                          onClick={() => {
                            setViewYM(`${y}-${String(month).padStart(2, "0")}`);
                            setHeaderMode("months");
                          }}
                          className="rounded-lg py-1.5 text-caption tracking-wider transition-colors"
                          style={{
                            fontFamily: "var(--font-mono)",
                            background: active
                              ? "var(--color-core-orange)"
                              : "transparent",
                            color: disabled
                              ? "var(--color-navy-700)"
                              : active
                                ? "#000"
                                : "var(--color-navy-200)",
                            fontWeight: active ? 700 : 400,
                            cursor: disabled ? "not-allowed" : "pointer",
                          }}
                        >
                          {y}
                        </button>
                      );
                    })}
                  </div>
                );
              })()}

            {/* Day grid */}
            {headerMode === "days" && (
              <>
                <div className="grid grid-cols-7 mb-1">
                  {WEEKDAYS.map((w: string) => (
                    <div
                      key={w}
                      className="text-center"
                      style={{
                        fontSize: 9,
                        color: "var(--color-navy-700)",
                        fontFamily: "var(--font-mono)",
                        padding: "2px 0",
                      }}
                    >
                      {w}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7">
                  {cells.map((d: string | null, i: number) => {
                    if (!d) return <div key={`e${i}`} />;
                    const disabled = d < APOD_MIN || d > TODAY;
                    const isStart = d === value.start;
                    const isEnd =
                      d === value.end ||
                      (value.end === null &&
                        hover === d &&
                        value.start !== null &&
                        d !== value.start);
                    const inRange = isInRange(d);
                    const isToday = d === TODAY;
                    const sel = isStart || isEnd;
                    return (
                      <button
                        key={d}
                        disabled={disabled}
                        onClick={() => !disabled && click(d)}
                        onMouseEnter={() => !disabled && setHover(d)}
                        onMouseLeave={() => setHover(null)}
                        aria-disabled={disabled || undefined}
                        aria-pressed={sel || undefined}
                        className="relative flex items-center justify-center transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2"
                        style={{
                          height: 30,
                          fontSize: 11,
                          fontFamily: "var(--font-mono)",
                          color: disabled
                            ? "var(--color-navy-700)"
                            : sel
                              ? "#000"
                              : inRange
                                ? "var(--color-pass-paper)"
                                : "var(--color-navy-200)",
                          background: sel
                            ? "var(--color-core-orange)"
                            : inRange
                              ? "rgba(0,38,87,0.6)"
                              : "transparent",
                          borderRadius: isStart
                            ? "6px 0 0 6px"
                            : isEnd
                              ? "0 6px 6px 0"
                              : inRange
                                ? 0
                                : 6,
                          cursor: disabled ? "not-allowed" : "pointer",
                          fontWeight: sel ? 700 : 400,
                          outlineColor: "var(--color-core-orange)",
                        }}
                      >
                        {d.split("-")[2].replace(/^0/, "")}
                        {isToday && !sel && (
                          <span
                            className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                            style={{ background: "var(--color-core-orange)" }}
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              </>
            )}

            {/* Footer */}
            <div
              className="flex items-center justify-between mt-3 pt-3"
              style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
            >
              <button
                onClick={() => {
                  onChange({ start: null, end: null });
                  setPhase("start");
                }}
                className="text-label tracking-widest transition-colors -ml-2 px-2 py-2"
                style={{
                  color: "var(--color-navy-700)",
                  fontFamily: "var(--font-mono)",
                }}
              >
                CLEAR
              </button>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    onChange({ start: TODAY, end: TODAY });
                    setOpen(false);
                    setPhase("start");
                  }}
                  className="px-2.5 py-2 rounded text-label tracking-wider transition-colors hover:bg-white/5"
                  style={{
                    color: "var(--color-label-grey)",
                    fontFamily: "var(--font-mono)",
                    border: "1px solid var(--color-navy-800)",
                  }}
                >
                  TODAY
                </button>
                <button
                  onClick={() => {
                    const s = new Date();
                    s.setDate(s.getDate() - 6);
                    const start = s.toISOString().split("T")[0];
                    onChange({ start, end: TODAY });
                    setOpen(false);
                    setPhase("start");
                  }}
                  className="px-2.5 py-2 rounded text-label tracking-wider transition-colors hover:bg-white/5"
                  style={{
                    color: "var(--color-label-grey)",
                    fontFamily: "var(--font-mono)",
                    border: "1px solid var(--color-navy-800)",
                  }}
                >
                  LAST 7
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
