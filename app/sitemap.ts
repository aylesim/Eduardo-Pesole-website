import type { MetadataRoute } from "next";
import { getInternalWorks } from "@/lib/content";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://www.eduardopesole.com";
  const staticRoutes = ["", "/works", "/services", "/about"];
  const projectRoutes = getInternalWorks().map(
    (w) => `/works/${encodeURI(w.slug)}`,
  );

  return [...staticRoutes, ...projectRoutes].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
  }));
}
