import { useEffect, useRef, useState } from "react";
import { useClickOutside } from "../../hooks/useClickOutside";
import { useEscapeKey } from "../../hooks/useEscapeKey";

interface UserMenuProps {
  name: string;
  onEditName: () => void;
  onSignOut: () => void;
}

export function UserMenu({ name, onSignOut }: UserMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const firstItemRef = useRef<HTMLButtonElement>(null);

  const close = () => setOpen(false);
  useClickOutside(ref, close, open);
  useEscapeKey(close, open);

  useEffect(() => {
    if (open) firstItemRef.current?.focus();
  }, [open]);

  return (
    <div ref={ref} className="relative hidden sm:block">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Passenger menu for ${name}`}
        className="flex items-center gap-2 px-3 py-2 rounded-lg transition-colors hover:bg-white/5 focus-visible:outline-2 focus-visible:outline-offset-2"
        style={{
          background: "var(--color-panel)",
          border: "1px solid var(--color-navy-800)",
          outlineColor: "var(--color-core-orange)",
        }}
      >
        <svg
          width="11"
          height="11"
          viewBox="0 0 12 12"
          fill="none"
          aria-hidden="true"
        >
          <circle
            cx="6"
            cy="4"
            r="2.5"
            stroke="var(--color-label-grey)"
            strokeWidth="1.2"
          />
          <path
            d="M1 11c0-2.5 2.2-4 5-4s5 1.5 5 4"
            stroke="var(--color-label-grey)"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        </svg>
        <span
          className="text-label tracking-label uppercase truncate font-bold"
          style={{
            color: "var(--color-navy-200)",
            fontFamily: "var(--font-mono)",
            maxWidth: 120,
          }}
        >
          {name}
        </span>
        <svg
          width="8"
          height="8"
          viewBox="0 0 8 8"
          fill="none"
          aria-hidden="true"
          style={{
            color: "var(--color-navy-700)",
            transition: "transform 0.15s",
            transform: open ? "rotate(180deg)" : "none",
          }}
        >
          <path
            d="M1 2.5L4 5.5L7 2.5"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open && (
        <div
          role="menu"
          aria-label="Passenger options"
          className="absolute right-0 mt-2 rounded-xl overflow-hidden"
          style={{
            background: "var(--color-panel)",
            border: "1px solid var(--color-navy-800)",
            boxShadow: "var(--shadow-panel)",
            minWidth: 200,
            zIndex: "var(--z-dropdown)",
            top: "100%",
          }}
        >
          {/* Items */}
          <div className="py-1.5">
            <button
              role="menuitem"
              onClick={() => {
                setOpen(false);
                onSignOut();
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-white/5 focus-visible:bg-white/5 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-orange-500"
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 10,
                color: "var(--color-core-orange-hover)",
                letterSpacing: "0.12em",
              }}
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M5 2H2.5C2 2 1.5 2.5 1.5 3V9C1.5 9.5 2 10 2.5 10H5"
                  stroke="currentColor"
                  strokeWidth="1.1"
                  strokeLinecap="round"
                />
                <path
                  d="M8 4L10.5 6L8 8"
                  stroke="currentColor"
                  strokeWidth="1.1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <line
                  x1="4.5"
                  y1="6"
                  x2="10.5"
                  y2="6"
                  stroke="currentColor"
                  strokeWidth="1.1"
                  strokeLinecap="round"
                />
              </svg>
              SIGN OUT
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
