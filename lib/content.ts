import siteData from "@/content/site.json";
import type {
  HubKey,
  PortfolioGroup,
  PortfolioItem,
  Project,
  SecondaryKey,
  SecondaryPages,
  SiteContent,
} from "@/lib/types";

const site = siteData as SiteContent;

export function getSite(): SiteContent {
  return site;
}

export function getProjects(): Project[] {
  return site.projects;
}

export function getProjectBySlug(slug: string): Project | undefined {
  const decoded = decodeURIComponent(slug);
  return site.projects.find(
    (p) => p.slug === slug || p.slug === decoded || encodeURI(p.slug) === slug,
  );
}

export function getPortfolio(): PortfolioGroup[] {
  return site.portfolio;
}

export function getNav() {
  return site.global.nav;
}

export function getProjectCategory(slug: string): string | null {
  for (const group of site.portfolio) {
    for (const item of group.items) {
      if (item.slug === slug || item.slug === decodeURIComponent(slug)) {
        return group.category;
      }
    }
  }
  return null;
}

export function getHubLinks(hubKey: HubKey): PortfolioItem[] {
  const portfolio = site.portfolio;
  if (hubKey === "games") {
    return portfolio.find((g) => g.category === "Games")?.items ?? [];
  }
  if (hubKey === "sound-art") {
    return portfolio.find((g) => g.category === "Art Collabs")?.items ?? [];
  }
  if (hubKey === "movies") {
    return portfolio.find((g) => g.category === "Movies")?.items ?? [];
  }
  if (hubKey === "music") {
    return portfolio.find((g) => g.category === "Music")?.items ?? [];
  }
  return [];
}

export function getSecondary<K extends SecondaryKey>(
  hubKey: K,
): SecondaryPages[K] {
  return site.secondary[hubKey];
}

export function isLogoMark(localPath: string | undefined): boolean {
  return Boolean(localPath?.includes("984ee3bf58d04fdda67fe9f48d7d5003"));
}
