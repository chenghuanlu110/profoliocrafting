"use client";

import { motion } from "motion/react";
import { useEffect, useRef } from "react";
import type { Category, Project } from "@/content/schema";
import { Media } from "@/components/media/Media";
import { statusLabel } from "@/lib/content";

/**
 * Desktop five-card stack.
 *
 * Geometry (container width C):
 *   front card width  W = 0.68·C, height = W·10/16
 *   strip step        s = (C − W) / 4
 *   card at depth k   x = k·s, scale = 1 − 0.06k, transform-origin: right
 * Scaling from the right edge keeps every card's right edge at k·s + W, so
 * each background card exposes exactly one strip of width s — a sliver of its
 * cover, never the whole image — while shrinking vertically for depth.
 *
 * Depth k is the circular distance from the active index. With more than five
 * projects the card at k = N−1 is treated as k = −1 and parked off to the left
 * (faded), so advancing slides the old front card out to the left and the deck
 * moves horizontally; cards with k ≥ 5 wait, hidden, behind the last strip.
 *
 * Inactive cards share one fixed dim level (DIM) rather than a progressive
 * fade; depth is communicated by scale, position and shadow instead.
 */

const VISIBLE = 5;
const DIM = 0.5; // fixed overlay opacity for every inactive card
const SPRING = { type: "spring", stiffness: 240, damping: 32, mass: 0.9 } as const;

export function StackGallery({
  projects,
  categories,
  index,
  onSelect,
  onOpenDetail,
}: {
  projects: Project[];
  categories: Category[];
  index: number;
  onSelect: (i: number) => void;
  onOpenDetail: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const n = projects.length;
  const visible = Math.min(VISIBLE, n);

  // Trackpad: horizontal two-finger swipes step through projects. Vertical
  // scrolling is never intercepted — we only act (and preventDefault) when the
  // gesture is predominantly horizontal.
  const indexRef = useRef(index);
  indexRef.current = index;
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let acc = 0;
    let locked = false;
    let idle: ReturnType<typeof setTimeout>;
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY) * 1.2) return;
      e.preventDefault(); // also stops browser back-swipe navigation
      clearTimeout(idle);
      idle = setTimeout(() => (acc = 0), 180);
      if (locked) return;
      acc += e.deltaX;
      if (Math.abs(acc) > 45) {
        onSelect(indexRef.current + (acc > 0 ? 1 : -1));
        acc = 0;
        locked = true;
        setTimeout(() => (locked = false), 480);
      }
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      el.removeEventListener("wheel", onWheel);
      clearTimeout(idle);
    };
  }, [onSelect]);

  // Layout: with fewer than five cards, the front card grows to use the room.
  const frontRatio = visible >= 5 ? 0.68 : visible === 1 ? 1 : 0.68 + (5 - visible) * 0.05;
  // Everything is expressed relative to the front card's width, so the stack
  // renders identically on the server (no measurement) and at any viewport.
  // Motion's percentage x is relative to the element's own width (= W).
  const stepOfW = visible > 1 ? (1 - frontRatio) / (visible - 1) / frontRatio : 0;
  const catLabel = (id: string) => categories.find((c) => c.id === id)?.label ?? id;

  function depthOf(i: number) {
    let k = (((i - index) % n) + n) % n;
    if (n > VISIBLE && k === n - 1) k = -1;
    return k;
  }

  return (
    <div
      ref={ref}
      className="relative w-full select-none"
      style={{ aspectRatio: `${16 / frontRatio} / 10` }}
    >
      {projects.map((p, i) => {
          const k = depthOf(i);
          const shown = k >= 0 && k < visible;
          const active = k === 0;
          const scale = k < 0 ? 0.96 : 1 - Math.min(k, VISIBLE) * 0.06;
          const x = k < 0 ? "-35%" : `${(Math.min(k, VISIBLE) * stepOfW + (k >= VISIBLE ? 0.03 : 0)) * 100}%`;
          const stripW = k > 0 ? `${(stepOfW / scale) * 100}%` : "0%";
          return (
            <motion.div
              key={p.id}
              className="absolute left-0 top-0"
              style={{
                width: `${frontRatio * 100}%`,
                height: "100%",
                transformOrigin: "100% 50%",
                zIndex: k < 0 ? 60 : 50 - k,
                pointerEvents: shown ? "auto" : "none",
              }}
              initial={false}
              animate={{ x, scale, opacity: shown ? 1 : 0 }}
              transition={SPRING}
              aria-hidden={!shown}
            >
              <button
                type="button"
                tabIndex={shown ? 0 : -1}
                onClick={() => (active ? onOpenDetail() : onSelect(i))}
                aria-label={active ? `${p.title} — read case study below` : `Show project ${i + 1}: ${p.title}`}
                aria-current={active ? "true" : undefined}
                className={`group relative block h-full w-full overflow-hidden rounded-[1.4rem] border text-left transition-[border-color,box-shadow] duration-500 ${
                  active
                    ? "border-ocean/35 shadow-[0_30px_80px_-30px_rgb(0_0_0/0.9),0_0_0_1px_rgb(0_211_251/0.08),0_0_60px_-20px_rgb(0_66_172/0.7)]"
                    : "border-line-strong shadow-[0_20px_50px_-25px_rgb(0_0_0/0.9)] hover:border-ocean/40"
                } ${shown ? "" : "pointer-events-none"}`}
              >
                <Media media={p.cover} variant="cover" priority={i === index} sizes="(min-width: 768px) 60vw, 100vw" />

                {/* Fixed dim level for every inactive card */}
                <motion.div
                  aria-hidden
                  className="absolute inset-0 bg-ink-950"
                  initial={false}
                  animate={{ opacity: active ? 0 : DIM }}
                  transition={{ duration: 0.35 }}
                />

                {/* Front card caption */}
                <motion.div
                  className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink-950/95 via-ink-950/60 to-transparent p-7 pt-24"
                  initial={false}
                  animate={{ opacity: active ? 1 : 0, y: active ? 0 : 10 }}
                  transition={{ duration: 0.35, delay: active ? 0.12 : 0 }}
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-ocean/40 bg-ocean/10 px-2.5 py-0.5 font-mono text-[11px] uppercase tracking-[0.14em] text-ocean">
                      {catLabel(p.categoryId)}
                    </span>
                    <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">{statusLabel[p.meta.status]}</span>
                    {p.isPlaceholder && <span className="placeholder-tag">Placeholder</span>}
                  </div>
                  <h3 className="mt-3 max-w-[90%] font-display text-2xl font-semibold leading-tight tracking-tight text-fg lg:text-[1.75rem]">
                    {p.title}
                  </h3>
                  <p className="mt-1.5 max-w-[85%] text-[15px] text-muted">{p.subtitle}</p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm text-ocean opacity-80 transition-opacity group-hover:opacity-100">
                    Case study below
                    <svg width="12" height="12" viewBox="0 0 16 16" aria-hidden><path d="M8 3v10M4 9l4 4 4-4" stroke="currentColor" strokeWidth="1.6" fill="none" /></svg>
                  </span>
                </motion.div>

                {/* Exposed strip label for background cards */}
                {k > 0 && (
                  <div
                    aria-hidden
                    className="absolute inset-y-0 right-0 flex flex-col items-center justify-between border-l border-white/5 py-5"
                    style={{ width: stripW }}
                  >
                    <span className="font-mono text-xs tracking-wider text-fg/90">{String(i + 1).padStart(2, "0")}</span>
                    <span className="max-h-[70%] overflow-hidden text-ellipsis whitespace-nowrap font-display text-[13px] tracking-wide text-fg/85 [writing-mode:vertical-rl] rotate-180">
                      {p.title.replace(/^Sample Project:\s*/, "")}
                    </span>
                    <span className="h-1.5 w-1.5 rounded-full bg-ocean/70" />
                  </div>
                )}
              </button>
            </motion.div>
          );
        })}
    </div>
  );
}
