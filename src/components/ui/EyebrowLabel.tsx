import type { ReactNode } from "react";

interface EyebrowLabelProps {
  children: ReactNode;
  tone?: "orange" | "grey";
  size?: number;
  tracking?: string;
  bold?: boolean;
  className?: string;
}

const TONE_COLOR = {
  orange: "var(--color-core-orange)",
  grey: "var(--color-navy-700)",
};

// Small wide-tracking Space Mono label used above headings throughout the app
// (e.g. "BOARDING PASS", "✦ FLIGHT LOG ✦").
export function EyebrowLabel({
  children,
  tone = "orange",
  size = 9,
  tracking = "var(--tracking-label)",
  bold = true,
  className,
}: EyebrowLabelProps) {
  return (
    <p
      className={className}
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: size,
        letterSpacing: tracking,
        color: TONE_COLOR[tone],
        fontWeight: bold ? 700 : 400,
      }}
    >
      {children}
    </p>
  );
}
