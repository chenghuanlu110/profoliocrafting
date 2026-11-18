"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Project } from "@/content/schema";
import { projectPath, slugFromPath } from "@/lib/content";

/**
 * Single source of truth for the active project.
 *
 * Gallery, bookmarks, detail panel, document title and URL all derive from
 * `index`; nothing else stores "which project is active". That is what keeps
 * the detail panel synchronised and prevents race conditions: a rapid series
 * of selections simply overwrites one integer, and the detail panel renders
 * whatever that integer is once its exit transition completes.
 *
 * URL policy:
 *  - Selecting a project writes /projects/{slug} via the History API (Next.js
 *    integrates native pushState with its router, so no route reload occurs).
 *  - Bursts of selections (< 700 ms apart, e.g. holding an arrow key) replace
 *    the current entry instead of flooding history.
 *  - Back/forward (popstate) re-selects the project encoded in the URL.
 */
export function useProjectSelection(projects: Project[], initialIndex: number, siteName: string) {
  const [index, setIndex] = useState(initialIndex);
  const lastPush = useRef(0);
  const interacted = useRef(false);
  const n = projects.length;

  const select = useCallback(
    (target: number) => {
      if (n === 0) return;
      const next = ((target % n) + n) % n; // wrap
      interacted.current = true;
      setIndex(next);
      const path = projectPath(projects[next].slug);
      if (window.location.pathname !== path) {
        const now = performance.now();
        if (now - lastPush.current < 700) window.history.replaceState(null, "", path);
        else window.history.pushState(null, "", path);
        lastPush.current = now;
      }
    },
    [n, projects],
  );

  // Back / forward navigation.
  useEffect(() => {
    const onPop = () => {
      const slug = slugFromPath(window.location.pathname);
      const i = slug ? projects.findIndex((p) => p.slug === slug) : initialIndex;
      if (i >= 0) setIndex(i);
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [projects, initialIndex]);

  // Keep the tab title meaningful once the visitor starts browsing projects.
  useEffect(() => {
    if (!interacted.current || !projects[index]) return;
    document.title = `${projects[index].title} — ${siteName}`;
  }, [index, projects, siteName]);

  return { index, select, next: () => select(index + 1), prev: () => select(index - 1) };
}
