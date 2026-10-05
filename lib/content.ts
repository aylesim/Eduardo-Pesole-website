import siteData from "@/content/site.json";
import type {
  CategoryFilter,
  ServiceOffer,
  SiteContent,
  WorkCategory,
  WorkItem,
} from "@/lib/types";

const site = siteData as SiteContent;

export function getSite(): SiteContent {
  return site;
}

export function getWorks(): WorkItem[] {
  return site.works;
}

export function getWorkBySlug(slug: string): WorkItem | undefined {
  const decoded = decodeURIComponent(slug);
  return site.works.find(
    (w) =>
      w.slug === slug ||
      w.slug === decoded ||
      encodeURI(w.slug) === slug ||
      w.legacySlug === slug ||
      w.legacySlug === decoded,
  );
}

export function getInternalWorks(): WorkItem[] {
  return site.works.filter((w) => !w.externalUrl);
}

export function getMusicWorks(): WorkItem[] {
  return site.works.filter((w) => w.category === "music");
}

export function getWorksByCategory(
  category: WorkCategory | "all",
): WorkItem[] {
  if (category === "all") return site.works;
  return site.works.filter((w) => w.category === category);
}

export function getAdjacentWorks(slug: string): {
  prev: WorkItem | null;
  next: WorkItem | null;
} {
  const list = getInternalWorks();
  const index = list.findIndex(
    (w) => w.slug === slug || w.legacySlug === slug,
  );
  if (index === -1) return { prev: null, next: null };
  return {
    prev: list[(index - 1 + list.length) % list.length] ?? null,
    next: list[(index + 1) % list.length] ?? null,
  };
}

export function getNav() {
  return site.global.nav;
}

export function getServices(): ServiceOffer[] {
  return site.services;
}

export function getCategoryFilters(): CategoryFilter[] {
  return site.category_filters;
}

export function workHref(work: WorkItem): string {
  if (work.externalUrl) return work.externalUrl;
  return `/works/${encodeURI(work.slug)}`;
}

export function isExternalWork(work: WorkItem): boolean {
  return Boolean(work.externalUrl);
}
