"use client";

import { useEffect, useRef } from "react";

/**
 * Subtle animated "signal node" field behind all content.
 * Performance guards: ~30 fps cap, DPR capped at 1.5, particle count scales
 * with viewport area (max 56), pauses when the tab is hidden, and renders a
 * single static frame when the user prefers reduced motion.
 */
export function BackgroundField() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    let w = 0;
    let h = 0;
    let raf = 0;
    let last = 0;
    type P = { x: number; y: number; vx: number; vy: number; r: number; jade: boolean };
    let pts: P[] = [];

    const seed = () => {
      const count = Math.min(56, Math.round((w * h) / 32000));
      pts = Array.from({ length: count }, (_, i) => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.12,
        vy: (Math.random() - 0.5) * 0.12,
        r: Math.random() * 1.1 + 0.5,
        jade: i % 23 === 0, // very occasional accent node
      }));
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
      draw();
    };

    const LINK = 130;
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < pts.length; i++) {
        const a = pts[i];
        for (let j = i + 1; j < pts.length; j++) {
          const b = pts[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < LINK * LINK) {
            const o = (1 - Math.sqrt(d2) / LINK) * 0.14;
            ctx.strokeStyle = `rgba(0, 211, 251, ${o})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            // Orthogonal "trace" routing instead of straight lines: reads as circuitry.
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      for (const p of pts) {
        ctx.fillStyle = p.jade ? "rgba(131, 253, 128, 0.55)" : "rgba(120, 190, 255, 0.45)";
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const step = (t: number) => {
      raf = requestAnimationFrame(step);
      if (t - last < 33) return; // ~30 fps
      last = t;
      for (const p of pts) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10;
        if (p.y > h + 10) p.y = -10;
      }
      draw();
    };

    const start = () => {
      cancelAnimationFrame(raf);
      if (!reduce.matches && !document.hidden) raf = requestAnimationFrame(step);
    };
    const onVis = () => (document.hidden ? cancelAnimationFrame(raf) : start());

    resize();
    start();
    let resizeTimer: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 150);
    };
    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVis);
    reduce.addEventListener("change", start);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVis);
      reduce.removeEventListener("change", start);
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_20%_-10%,rgb(0_66_172/0.35),transparent_70%),radial-gradient(ellipse_50%_40%_at_100%_20%,rgb(0_211_251/0.08),transparent_70%)]" />
      <div className="grid-backdrop absolute inset-0" />
      <canvas ref={ref} className="absolute inset-0 opacity-70" />
    </div>
  );
}
