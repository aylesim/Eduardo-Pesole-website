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
  return [...site.works].sort((a, b) => a.order - b.order);
}

export function getWorkBySlug(slug: string): WorkItem | undefined {
  const decoded = decodeURIComponent(slug);
  return site.works.find(
    (w) =>
      w.slug === slug ||
      w.slug === decoded ||
      encodeURI(w.slug) === slug,
  );
}

export function getInternalWorks(): WorkItem[] {
  return getWorks().filter((w) => !w.externalUrl);
}

export function getMusicWorks(): WorkItem[] {
  return getWorks().filter((w) => w.category === "music");
}

export function getWorksByCategory(
  category: WorkCategory | "all",
): WorkItem[] {
  if (category === "all") return getWorks();
  return getWorks()
    .filter((w) => w.category === category)
    .sort((a, b) => {
      const ya = Number(a.year) || 0;
      const yb = Number(b.year) || 0;
      if (yb !== ya) return yb - ya;
      return a.order - b.order;
    });
}

export function getAdjacentWorks(slug: string): {
  prev: WorkItem | null;
  next: WorkItem | null;
} {
  const current = getWorkBySlug(slug);
  if (!current || current.externalUrl) return { prev: null, next: null };

  const sameCategory = getInternalWorks().filter(
    (w) => w.category === current.category,
  );
  const list =
    sameCategory.length > 1 ? sameCategory : getInternalWorks();
  const index = list.findIndex((w) => w.slug === slug);
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

export function plateSrc(work: WorkItem): string | null {
  if (work.stills[0]?.src) return work.stills[0].src;
  if (work.poster) return work.poster;
  return work.posterFallback ?? null;
}
