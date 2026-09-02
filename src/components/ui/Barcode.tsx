interface BarcodeProps {
  seed: string;
  height?: number;
}

// Deterministic pseudo-barcode: the bar pattern is derived from a hash of
// `seed` so the same date always renders the same barcode.
export function Barcode({ seed, height = 80 }: BarcodeProps) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  const pattern = [2, 1, 3, 1, 2, 1, 3, 2, 1, 3, 1, 2, 1, 3, 2, 1, 2, 1, 3, 1];
  const bars: { x: number; w: number }[] = [];
  let x = 0;
  for (let i = 0; i < pattern.length; i++) {
    const w = pattern[(i + Math.abs(hash % 7)) % pattern.length];
    if (i % 2 === 0) bars.push({ x, w });
    x += w + 1.5;
  }
  const totalW = x;

  return (
    <svg
      width={totalW}
      height={height}
      viewBox={`0 0 ${totalW} ${height}`}
      aria-hidden="true"
      style={{ display: "block" }}
    >
      {bars.map((b, i) => (
        <rect key={i} x={b.x} y={0} width={b.w} height={height} fill="var(--color-pass-paper)" opacity={0.85} />
      ))}
    </svg>
  );
}
