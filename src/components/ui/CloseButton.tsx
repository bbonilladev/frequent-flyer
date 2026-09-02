import type { Ref } from "react";

interface CloseButtonProps {
  onClick: () => void;
  label: string;
  size?: "sm" | "lg";
  className?: string;
  ref?: Ref<HTMLButtonElement>;
}

const SIZES = {
  sm: { button: 36, icon: 12, background: "rgba(255,255,255,0.07)", color: "var(--color-navy-300)" },
  lg: { button: 40, icon: 14, background: "rgba(255,255,255,0.08)", color: "var(--color-navy-200)" },
};

// Circular × dismiss button used by every full-screen modal (Lightbox, ArrivalModal).
export function CloseButton({ onClick, label, size = "sm", className, ref }: CloseButtonProps) {
  const { button, icon, background, color } = SIZES[size];
  return (
    <button
      ref={ref}
      onClick={onClick}
      aria-label={label}
      className={`flex items-center justify-center rounded-full transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 ${className ?? ""}`}
      style={{ width: button, height: button, background, color, outlineColor: "var(--color-core-orange)" }}
    >
      <svg width={icon} height={icon} viewBox="0 0 14 14" fill="none" aria-hidden="true">
        <line x1="1" y1="1" x2="13" y2="13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="13" y1="1" x2="1" y2="13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </button>
  );
}
