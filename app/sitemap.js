import { getProjects, getSite } from "@/lib/content";

export const dynamic = "force-static";

export default function sitemap() {
  const site = getSite();
  const base = "https://www.eduardopesole.com";
  const staticRoutes = [
    "",
    "/s-projects-basic",
    "/contact-8",
    "/music",
    "/games",
    "/sound-art",
    "/movies",
  ];
  const projectRoutes = getProjects().map((p) => `/${encodeURI(p.slug)}`);

  return [...staticRoutes, ...projectRoutes].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(site.extracted_at),
  }));
}
