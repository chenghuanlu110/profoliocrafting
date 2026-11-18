"use client";

import type { Project } from "@/content/schema";
import type { CategoryMarker } from "@/lib/content";

/**
 * Notebook-style bookmark tabs over an index rail.
 *
 * The rail has one tick per project (in owner order). Each category's tab sits
 * where that category begins and its bracket spans until the next category
 * begins, so the tab both *labels* and *locates* the section of the deck.
 * Selecting a tab jumps to the first project of that category.
 */
export function CategoryRail({
  projects,
  markers,
  index,
  onSelect,
}: {
  projects: Project[];
  markers: CategoryMarker[];
  index: number;
  onSelect: (i: number) => void;
}) {
  const n = projects.length;
  const activeCat = projects[index]?.categoryId;

  return (
    <div className="w-full">
      {/* Tabs */}
      <div className="relative grid h-9" style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }}>
        {markers.map((m, mi) => {
          const end = markers[mi + 1]?.firstIndex ?? n;
          const span = Math.max(1, end - m.firstIndex);
          const active = m.category.id === activeCat;
          return (
            <div key={m.category.id} className="relative flex items-end" style={{ gridColumn: `${m.firstIndex + 1} / span ${span}` }}>
              <button
                type="button"
                onClick={() => onSelect(m.firstIndex)}
                aria-current={active ? "true" : undefined}
                aria-label={`${m.category.label} — ${m.count} project${m.count === 1 ? "" : "s"}, go to first`}
                className={`relative z-10 -mb-px ml-1 rounded-t-lg border border-b-0 px-3.5 pb-1.5 pt-1 font-mono text-[11px] uppercase tracking-[0.14em] transition-colors duration-300 ${
                  active
                    ? "border-ocean/50 bg-sapphire text-white"
                    : "border-line-strong bg-ink-800/80 text-muted hover:border-ocean/40 hover:text-fg"
                }`}
              >
                {m.category.label}
                <span className={`ml-2 ${active ? "text-ocean" : "text-subtle"}`}>{m.count}</span>
              </button>
              {/* bracket showing the category's span */}
              <span aria-hidden className={`absolute bottom-0 left-1 right-1 h-px transition-colors duration-300 ${active ? "bg-ocean/70" : "bg-line-strong"}`} />
            </div>
          );
        })}
      </div>

      {/* Ticks */}
      <ol className="grid border-t border-line" style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }} aria-label="All projects">
        {projects.map((p, i) => {
          const active = i === index;
          return (
            <li key={p.id} className="flex justify-start">
              <button
                type="button"
                onClick={() => onSelect(i)}
                aria-current={active ? "true" : undefined}
                aria-label={`Project ${i + 1}: ${p.title}`}
                className="group flex min-h-11 items-center gap-2 px-1.5 py-2"
              >
                <span
                  className={`h-2 w-2 rounded-full transition-all duration-300 ${
                    active ? "scale-125 bg-jade shadow-[0_0_10px_rgb(131_253_128/0.6)]" : "bg-subtle/50 group-hover:bg-ocean"
                  }`}
                />
                <span className={`font-mono text-[11px] tracking-wider transition-colors ${active ? "text-fg" : "text-subtle group-hover:text-muted"}`}>
                  {String(i + 1).padStart(2, "0")}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

/** Compact bookmark chips for small screens. */
export function CategoryTabsMobile({
  projects,
  markers,
  index,
  onSelect,
}: {
  projects: Project[];
  markers: CategoryMarker[];
  index: number;
  onSelect: (i: number) => void;
}) {
  const activeCat = projects[index]?.categoryId;
  return (
    <div className="no-scrollbar -mx-4 flex gap-1 overflow-x-auto border-b border-line px-4">
      {markers.map((m) => {
        const active = m.category.id === activeCat;
        return (
          <button
            key={m.category.id}
            type="button"
            onClick={() => onSelect(m.firstIndex)}
            aria-current={active ? "true" : undefined}
            className={`-mb-px min-h-11 shrink-0 rounded-t-lg border border-b-0 px-4 font-mono text-[11px] uppercase tracking-[0.14em] transition-colors ${
              active ? "border-ocean/50 bg-sapphire text-white" : "border-line bg-ink-800/70 text-muted"
            }`}
          >
            {m.category.label} <span className={active ? "text-ocean" : "text-subtle"}>{m.count}</span>
          </button>
        );
      })}
    </div>
  );
}
