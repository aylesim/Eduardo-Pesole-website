import type { FilterId, WorkCategory, WorkItem } from "@/lib/types";

export function parseFilterParam(
  value: string | null,
  categorySlugs: string[] = [],
): FilterId {
  if (value === "all") return "all";
  if (!value || value === "selected") return "selected";
  if (categorySlugs.includes(value)) return value;
  return "selected";
}

export function categorySlugsFromFilters(
  filters: { id: string }[],
): string[] {
  return filters
    .map((f) => f.id)
    .filter((id) => id !== "selected" && id !== "all");
}

export function filterWorks(works: WorkItem[], filter: FilterId): WorkItem[] {
  if (filter === "selected") {
    return [...works]
      .filter((w) => w.selected)
      .sort((a, b) => a.order - b.order);
  }
  if (filter === "all") {
    return [...works].sort((a, b) => a.order - b.order);
  }
  return works
    .filter((w) => w.category === filter)
    .sort((a, b) => {
      const ya = Number(a.year) || 0;
      const yb = Number(b.year) || 0;
      if (yb !== ya) return yb - ya;
      return a.order - b.order;
    });
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

export function getWorksByCategory(
  works: WorkItem[],
  category: WorkCategory | "all",
): WorkItem[] {
  return filterWorks(works, category);
}
