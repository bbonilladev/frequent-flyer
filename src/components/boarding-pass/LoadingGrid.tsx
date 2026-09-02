import { GalaxyLoader } from "../ui/GalaxyLoader";

interface LoadingGridProps {
  count?: number;
}

export function LoadingGrid({ count = 6 }: LoadingGridProps) {
  return (
    <div className="relative">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="rounded-xl" style={{ height: 148, background: "var(--color-panel)", opacity: 0.4 + (i % 3) * 0.1 }} />
        ))}
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
        <GalaxyLoader size={64} />
        {/* oxlint-disable-next-line jsx-a11y/prefer-tag-over-role -- swapping to <output> would change this paragraph's default styling/semantics. */}
        <p role="status" className="text-label tracking-label" style={{ color: "var(--color-navy-700)", fontFamily: "var(--font-mono)" }}>
          SCANNING THE LOG…
        </p>
      </div>
    </div>
  );
}
