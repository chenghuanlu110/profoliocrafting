import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site-config";

export default function robots(): MetadataRoute.Robots {
  // /studio (Phase 3) is private and must never be indexed.
  return { rules: [{ userAgent: "*", allow: "/", disallow: ["/studio", "/api/"] }], sitemap: `${siteUrl}/sitemap.xml` };
}
