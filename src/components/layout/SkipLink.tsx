// WCAG 2.4.1 Bypass Blocks: lets keyboard users jump past the repeated
// header straight to the current screen's content. Visually hidden until
// it receives focus (the first Tab stop on any authenticated screen).
export function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:px-4 focus:py-2.5 focus:rounded-lg focus:outline-2 focus:outline-offset-2"
      style={{
        zIndex: "var(--z-lightbox)",
        background: "var(--color-core-orange)",
        color: "#000",
        fontFamily: "var(--font-mono)",
        fontSize: "var(--text-body-sm)",
        fontWeight: 700,
        letterSpacing: "var(--tracking-snug)",
        outlineColor: "var(--color-pass-paper)",
      }}
    >
      Skip to main content
    </a>
  );
}
