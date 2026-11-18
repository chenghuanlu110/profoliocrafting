import type { Metadata } from "next";
import { ProjectsExperience } from "@/components/projects/ProjectsExperience";
import { site } from "@/content/site";
import { buildCategoryMarkers, getCategories, getPublishedProjects } from "@/lib/content";

export const metadata: Metadata = {
  title: "Projects",
  description: "Engineering and research case studies: problem, contributions, methodology, evidence and limitations.",
  alternates: { canonical: "/projects" },
};

export default function ProjectsPage() {
  const projects = getPublishedProjects();
  const categories = getCategories();
  return (
    <ProjectsExperience
      projects={projects}
      categories={categories}
      markers={buildCategoryMarkers(projects, categories)}
      siteName={site.name}
      sectionHeadingAs="h1"
    />
  );
}
