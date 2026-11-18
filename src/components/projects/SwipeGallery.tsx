"use client";

import { useEffect, useRef } from "react";
import type { Category, Project } from "@/content/schema";
import { Media } from "@/components/media/Media";
import { statusLabel } from "@/lib/content";

/**
 * Mobile gallery: native CSS scroll-snap carousel. Native scrolling gives the
 * platform's own swipe physics and never blocks vertical page scroll.
 * Scroll position → index is reported after the scroll settles; index changes
 * from elsewhere (bookmarks, back/forward) scroll the matching card into view.
 */
export function SwipeGallery({
  projects,
  categories,
  index,
  onSelect,
}: {
  projects: Project[];
  categories: Category[];
  index: number;
  onSelect: (i: number) => void;
}) {
  const track = useRef<HTMLDivElement>(null);
  const programmatic = useRef(false);
  const settle = useRef<ReturnType<typeof setTimeout>>(undefined);
  const indexRef = useRef(index);
  indexRef.current = index;

  const nearest = () => {
    const el = track.current;
    if (!el) return 0;
    const center = el.scrollLeft + el.clientWidth / 2;
    let best = 0;
    let dist = Infinity;
    Array.from(el.children).forEach((c, i) => {
      const node = c as HTMLElement;
      const d = Math.abs(node.offsetLeft + node.offsetWidth / 2 - center);
      if (d < dist) {
        dist = d;
        best = i;
      }
    });
    return best;
  };

  // External index change → scroll card into view.
  useEffect(() => {
    const el = track.current;
    const card = el?.children[index] as HTMLElement | undefined;
    if (!el || !card || el.offsetParent === null) return; // hidden on desktop
    if (nearest() === index) return;
    programmatic.current = true;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollTo({ left: card.offsetLeft - (el.clientWidth - card.offsetWidth) / 2, behavior: reduce ? "auto" : "smooth" });
  }, [index]);

  const onScroll = () => {
    clearTimeout(settle.current);
    settle.current = setTimeout(() => {
      const i = nearest();
      if (programmatic.current) {
        programmatic.current = false;
        return;
      }
      if (i !== indexRef.current) onSelect(i);
    }, 110);
  };

  const catLabel = (id: string) => categories.find((c) => c.id === id)?.label ?? id;

  return (
    <div
      ref={track}
      onScroll={onScroll}
      className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-px-4 px-[8%] pb-2"
      role="group"
      aria-label="Project gallery — swipe to browse"
    >
      {projects.map((p, i) => {
        const active = i === index;
        return (
          <button
            key={p.id}
            type="button"
            onClick={() => onSelect(i)}
            aria-current={active ? "true" : undefined}
            aria-label={`Project ${i + 1}: ${p.title}`}
            className={`relative aspect-[4/5] w-[84%] shrink-0 snap-center overflow-hidden rounded-3xl border text-left transition-[opacity,border-color,transform] duration-500 ${
              active ? "border-ocean/40 opacity-100" : "scale-[0.96] border-line-strong opacity-60"
            }`}
          >
            <Media media={p.cover} variant="cover" priority={i === 0} sizes="85vw" />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink-950 via-ink-950/75 to-transparent p-5 pt-20">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-ocean/40 bg-ocean/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-ocean">{catLabel(p.categoryId)}</span>
                {p.isPlaceholder && <span className="placeholder-tag">Placeholder</span>}
              </div>
              <h3 className="mt-2.5 font-display text-xl font-semibold leading-snug text-fg">{p.title}</h3>
              <p className="mt-1 text-sm text-muted">{statusLabel[p.meta.status]}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
