interface GalaxyLoaderProps {
  size?: number;
}

// Three counter-rotating elliptical rings around a nucleus, standing in for a spinner.
export function GalaxyLoader({ size = 56 }: GalaxyLoaderProps) {
  const cx = size / 2;
  const cy = size / 2;
  const rx1 = size * 0.43;
  const ry1 = size * 0.14;
  const rx2 = size * 0.27;
  const ry2 = size * 0.09;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none" role="status" aria-label="Loading">
      {/* Outer ring — orange, clockwise */}
      <ellipse cx={cx} cy={cy} rx={rx1} ry={ry1} stroke="var(--color-core-orange)" strokeWidth="0.9" strokeDasharray="7 4" opacity="0.65">
        <animateTransform attributeName="transform" type="rotate" from={`0 ${cx} ${cy}`} to={`360 ${cx} ${cy}`} dur="4s" repeatCount="indefinite" />
      </ellipse>
      {/* Mid ring — blue, counter-clockwise, 60° offset */}
      <ellipse cx={cx} cy={cy} rx={rx1} ry={ry1} stroke="#1E52A0" strokeWidth="0.9" strokeDasharray="5 5" opacity="0.5">
        <animateTransform attributeName="transform" type="rotate" from={`60 ${cx} ${cy}`} to={`-300 ${cx} ${cy}`} dur="3.2s" repeatCount="indefinite" />
      </ellipse>
      {/* Inner ring — gold, clockwise, 120° offset */}
      <ellipse cx={cx} cy={cy} rx={rx2} ry={ry2} stroke="var(--color-alachua-gold)" strokeWidth="0.9" strokeDasharray="4 4" opacity="0.55">
        <animateTransform attributeName="transform" type="rotate" from={`120 ${cx} ${cy}`} to={`480 ${cx} ${cy}`} dur="2.4s" repeatCount="indefinite" />
      </ellipse>
      {/* Nucleus */}
      <circle cx={cx} cy={cy} r={size * 0.038} fill="var(--color-core-orange)" opacity="0.9" />
    </svg>
  );
}
