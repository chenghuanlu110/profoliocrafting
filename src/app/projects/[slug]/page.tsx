import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectsExperience } from "@/components/projects/ProjectsExperience";
import { site } from "@/content/site";
import { buildCategoryMarkers, getCategories, getPublishedProject, getPublishedProjects, projectPath } from "@/lib/content";

type Params = Promise<{ slug: string }>;

/** Only published projects get a route; drafts 404. */
export function generateStaticParams() {
  return getPublishedProjects().map((p) => ({ slug: p.slug }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const p = getPublishedProject(slug);
  if (!p) return {};
  return {
    title: p.title,
    description: p.overview,
    alternates: { canonical: projectPath(p.slug) },
    openGraph: { type: "article", title: p.title, description: p.overview, url: projectPath(p.slug) },
  };
}

/**
 * Deep link: renders the full Projects experience server-side with this
 * project already active, so the shared URL shows the right card and case
 * study even before JavaScript loads.
 */
export default async function ProjectPage({ params }: { params: Params }) {
  const { slug } = await params;
  const projects = getPublishedProjects();
  const initialIndex = projects.findIndex((p) => p.slug === slug);
  if (initialIndex < 0) notFound();
  const categories = getCategories();
  return (
    <ProjectsExperience
      projects={projects}
      categories={categories}
      markers={buildCategoryMarkers(projects, categories)}
      initialIndex={initialIndex}
      siteName={site.name}
      detailTitleAs="h1"
      sectionHeadingAs="p"
    />
  );
}
