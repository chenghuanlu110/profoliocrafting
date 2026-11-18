"use client";

import { AnimatePresence, motion } from "motion/react";
import { useCallback, useRef } from "react";
import type { Category, Project } from "@/content/schema";
import type { CategoryMarker } from "@/lib/content";
import { CategoryRail, CategoryTabsMobile } from "./CategoryRail";
import { ProjectDetail } from "./ProjectDetail";
import { StackGallery } from "./StackGallery";
import { SwipeGallery } from "./SwipeGallery";
import { useProjectSelection } from "./useProjectSelection";

/**
 * The continuous Projects experience: gallery → bookmarks → case study.
 * The case study is keyed by the active slug inside AnimatePresence
 * mode="wait": on rapid switching the outgoing panel finishes its short fade
 * and only the *latest* selection mounts, so there is no flicker and no
 * stale content.
 */
export function ProjectsExperience({
  projects,
  categories,
  markers,
  initialIndex = 0,
  siteName,
  detailTitleAs = "h2",
  sectionHeadingAs: SectionHeading = "h2",
}: {
  projects: Project[];
  categories: Category[];
  markers: CategoryMarker[];
  initialIndex?: number;
  siteName: string;
  detailTitleAs?: "h1" | "h2";
  sectionHeadingAs?: "h1" | "h2" | "p";
}) {
  const { index, select, next, prev } = useProjectSelection(projects, initialIndex, siteName);
  const detailRef = useRef<HTMLDivElement>(null);
  const project = projects[index];
  const category = categories.find((c) => c.id === project?.categoryId);

  const openDetail = useCallback(() => {
    detailRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") { e.preventDefault(); next(); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); prev(); }
    else if (e.key === "Home") { e.preventDefault(); select(0); }
    else if (e.key === "End") { e.preventDefault(); select(projects.length - 1); }
  };

  if (!project) {
    return <p className="mx-auto max-w-7xl px-4 py-20 text-muted">No published projects yet.</p>;
  }

  const ctrl = "grid h-11 w-11 place-items-center rounded-full border border-line-strong text-muted transition-colors hover:border-ocean/60 hover:text-fg disabled:opacity-40";

  return (
    <section id="projects" aria-labelledby="projects-heading" className="scroll-mt-16">
      <div className="mx-auto max-w-7xl px-4 pt-14 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow mb-3">Projects</p>
            <SectionHeading id="projects-heading" className="font-display text-2xl font-semibold tracking-tight text-fg sm:text-3xl">
              Selected engineering work
            </SectionHeading>
          </div>
          <p className="hidden max-w-sm text-sm text-subtle md:block">
            Select a card, use <kbd className="rounded border border-line-strong px-1 font-mono text-[11px]">←</kbd>{" "}
            <kbd className="rounded border border-line-strong px-1 font-mono text-[11px]">→</kbd> when the gallery is focused, or swipe
            horizontally on a trackpad. The case study below follows the active card.
          </p>
        </div>

        {/* Screen-reader announcement of the active project */}
        <p aria-live="polite" className="sr-only">
          Project {index + 1} of {projects.length}: {project.title}
        </p>

        {/* Desktop */}
        <div className="hidden md:block">
          <div
            role="region"
            aria-roledescription="carousel"
            aria-label="Project gallery"
            tabIndex={0}
            onKeyDown={onKeyDown}
            className="rounded-[1.6rem] outline-offset-8"
          >
            <StackGallery projects={projects} categories={categories} index={index} onSelect={select} onOpenDetail={openDetail} />
          </div>
          <div className="mt-8 flex items-end gap-6">
            <div className="min-w-0 flex-1">
              <CategoryRail projects={projects} markers={markers} index={index} onSelect={select} />
            </div>
            <div className="flex shrink-0 items-center gap-2 pb-1">
              <button type="button" onClick={prev} className={ctrl} aria-label="Previous project">
                <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden><path d="M10 3 5 8l5 5" stroke="currentColor" strokeWidth="1.6" fill="none" /></svg>
              </button>
              <span className="w-16 text-center font-mono text-xs tracking-wider text-muted">
                <span className="text-fg">{String(index + 1).padStart(2, "0")}</span> / {String(projects.length).padStart(2, "0")}
              </span>
              <button type="button" onClick={next} className={ctrl} aria-label="Next project">
                <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden><path d="m6 3 5 5-5 5" stroke="currentColor" strokeWidth="1.6" fill="none" /></svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile */}
        <div className="md:hidden">
          <CategoryTabsMobile projects={projects} markers={markers} index={index} onSelect={select} />
          <div className="mt-5">
            <SwipeGallery projects={projects} categories={categories} index={index} onSelect={select} />
          </div>
          <div className="mt-4 flex justify-center gap-1.5" aria-hidden>
            {projects.map((p, i) => (
              <span key={p.id} className={`h-1.5 rounded-full transition-all duration-300 ${i === index ? "w-5 bg-jade" : "w-1.5 bg-subtle/40"}`} />
            ))}
          </div>
        </div>
      </div>

      {/* Synchronised case study */}
      <div ref={detailRef} id="project-detail" className="mx-auto mt-14 max-w-7xl scroll-mt-20 px-4 sm:px-6 lg:px-8">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={project.slug}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] } }}
            exit={{ opacity: 0, y: -6, transition: { duration: 0.16, ease: "easeIn" } }}
          >
            <ProjectDetail project={project} category={category} position={index} total={projects.length} titleAs={detailTitleAs} />
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
