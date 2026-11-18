import { Hero } from "@/components/home/Hero";
import { About, EducationHonors, Expertise } from "@/components/home/ProfileSections";
import { ProjectsExperience } from "@/components/projects/ProjectsExperience";
import { site } from "@/content/site";
import { buildCategoryMarkers, getCategories, getPublishedProjects } from "@/lib/content";

export default function HomePage() {
  const projects = getPublishedProjects();
  const categories = getCategories();
  return (
    <>
      <Hero />
      <About />
      <EducationHonors />
      <Expertise />
      <ProjectsExperience
        projects={projects}
        categories={categories}
        markers={buildCategoryMarkers(projects, categories)}
        siteName={site.name}
      />
    </>
  );
}
