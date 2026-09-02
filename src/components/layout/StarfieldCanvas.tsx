import { useEffect, useRef } from "react";

// Animated starfield + faint nebula glow, drawn imperatively on a canvas for per-frame control
export function StarfieldCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let raf: number;
    // Twinkling stars are purely decorative; render one static frame instead
    // of looping when the user has asked the OS for reduced motion.
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    function resize() {
      if (!canvas) return;
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }

    const stars = Array.from({ length: 220 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: Math.random() * 1.2 + 0.2,
      a: Math.random(),
      da: (Math.random() - 0.5) * 0.004,
    }));

    function draw() {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const W = canvas.width;
      const H = canvas.height;
      for (const s of stars) {
        s.a = Math.max(0.05, Math.min(1, s.a + s.da));
        if (s.a <= 0.05 || s.a >= 1) s.da *= -1;
        ctx.beginPath();
        ctx.arc(s.x * W, s.y * H, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200,215,240,${s.a})`;
        ctx.fill();
      }
      // Faint nebula glow
      const g1 = ctx.createRadialGradient(
        W * 0.2,
        H * 0.4,
        0,
        W * 0.2,
        H * 0.4,
        W * 0.35,
      );
      g1.addColorStop(0, "rgba(0,82,204,0.07)");
      g1.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g1;
      ctx.fillRect(0, 0, W, H);
      const g2 = ctx.createRadialGradient(
        W * 0.8,
        H * 0.6,
        0,
        W * 0.8,
        H * 0.6,
        W * 0.3,
      );
      g2.addColorStop(0, "rgba(255,77,0,0.05)");
      g2.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g2;
      ctx.fillRect(0, 0, W, H);
      if (!prefersReducedMotion) raf = requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener("resize", resize);
    draw();
    return () => {
      window.removeEventListener("resize", resize);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      aria-hidden="true"
    />
  );
}
