import { categories as allCategories, projects as allProjects } from "@/content/projects";
import type { Category, Project, ProjectContext, ProjectStatus } from "@/content/schema";

/**
 * Public read layer. Phase 1 reads static data; Phase 2 swaps the bodies of
 * these functions for Supabase queries against *published* snapshots only.
 * UI code must call these functions instead of importing content directly.
 */

export function getPublishedProjects(): Project[] {
  return allProjects
    .filter((p) => p.publication === "published")
    .sort((a, b) => a.order - b.order);
}

export function getPublishedProject(slug: string): Project | undefined {
  return getPublishedProjects().find((p) => p.slug === slug);
}

export function getCategories(): Category[] {
  return [...allCategories].sort((a, b) => a.order - b.order);
}

export interface CategoryMarker {
  category: Category;
  /** Index of the first project of this category in the ordered collection. */
  firstIndex: number;
  count: number;
}

/**
 * Bookmark positions. Categories with no published projects are omitted so no
 * empty tab is ever rendered. Markers follow the owner's project order.
 */
export function buildCategoryMarkers(projects: Project[], categories: Category[]): CategoryMarker[] {
  return categories
    .map((category) => {
      const firstIndex = projects.findIndex((p) => p.categoryId === category.id);
      const count = projects.filter((p) => p.categoryId === category.id).length;
      return { category, firstIndex, count };
    })
    .filter((m) => m.count > 0)
    .sort((a, b) => a.firstIndex - b.firstIndex);
}

export const statusLabel: Record<ProjectStatus, string> = {
  completed: "Completed",
  "in-progress": "In progress",
  "concluded-with-limitations": "Concluded · known limitations",
  paused: "Paused",
};

export const contextLabel: Record<ProjectContext, string> = {
  academic: "Academic",
  research: "Research",
  professional: "Professional",
  independent: "Independent",
};

export function teamLabel(team: Project["meta"]["team"]): string {
  if (team.type === "individual") return "Individual";
  const size = team.size ? `${team.size}-person team` : "Team";
  return team.role ? `${size} · ${team.role}` : size;
}

export const projectPath = (slug: string) => `/projects/${slug}`;

/** Parses /projects/{slug} → slug. Returns null for any other path. */
export function slugFromPath(pathname: string): string | null {
  const m = pathname.match(/^\/projects\/([^/?#]+)\/?$/);
  return m ? decodeURIComponent(m[1]) : null;
}
