import type { MetadataRoute } from "next";
import { getPublishedProjects, projectPath } from "@/lib/content";
import { siteUrl } from "@/lib/site-config";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${siteUrl}/` },
    { url: `${siteUrl}/projects` },
    ...getPublishedProjects().map((p) => ({ url: `${siteUrl}${projectPath(p.slug)}` })),
  ];
}
