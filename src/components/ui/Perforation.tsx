interface PerforationProps {
  orientation: "vertical" | "horizontal";
  holeColor: string;
  dashColor?: string;
  className?: string;
}

// Dashed tear-line with two "hole punch" circles at each end, standing in for
// where a boarding pass would be perforated. `holeColor` must match whatever
// sits behind the card (page background, modal backdrop, etc.) so the holes
// read as punched through rather than as opaque dots.
export function Perforation({ orientation, holeColor, dashColor = "rgba(26,26,26,0.2)", className }: PerforationProps) {
  if (orientation === "vertical") {
    return (
      <div className={`relative shrink-0 ${className ?? ""}`} style={{ width: 12 }}>
        <div className="absolute inset-y-0 left-1/2 -translate-x-1/2" style={{ borderLeft: `1.5px dashed ${dashColor}` }} />
        <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full" style={{ background: holeColor }} />
        <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full" style={{ background: holeColor }} />
      </div>
    );
  }

  return (
    <div className={`relative shrink-0 ${className ?? ""}`} style={{ height: 18 }}>
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2" style={{ borderTop: `1.5px dashed ${dashColor}` }} />
      <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full" style={{ background: holeColor }} />
      <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full" style={{ background: holeColor }} />
    </div>
  );
}
