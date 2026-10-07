import fs from "node:fs";
import path from "node:path";
import { filterWorks } from "@/lib/work-utils";
import type {
  AboutContent,
  CategoryEntry,
  CategoryFilter,
  ContactContent,
  FilterId,
  ServiceOffer,
  SiteSettings,
  WorkCategory,
  WorkItem,
} from "@/lib/types";

export {
  filterWorks,
  getWorksByCategory as filterWorksByCategory,
  isExternalWork,
  parseFilterParam,
  plateSrc,
  workHref,
} from "@/lib/work-utils";

const contentDir = path.join(process.cwd(), "content");

type WorkFile = Omit<WorkItem, "categoryLabel"> & {
  category: WorkCategory | string;
  posterPlaceholder?: string;
  primaryVideo?: { label?: string; url: string } | null;
};

function readJson<T>(relativePath: string): T {
  const filePath = path.join(contentDir, relativePath);
  return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
}

function loadCategories(): CategoryEntry[] {
  const dir = path.join(contentDir, "categories");
  return fs
    .readdirSync(dir)
    .filter((name) => name.endsWith(".json"))
    .map((name) => readJson<CategoryEntry>(path.join("categories", name)))
    .sort((a, b) => a.order - b.order);
}

function normalizePlaceholder(
  value: string | undefined,
): "primary" | "secondary" | undefined {
  if (value === "primary" || value === "secondary") return value;
  return undefined;
}

function normalizeWork(
  raw: WorkFile,
  categoryLabel: string,
): WorkItem {
  const primary =
    raw.primaryVideo?.url?.trim() ?
      { label: raw.primaryVideo.label, url: raw.primaryVideo.url.trim() }
    : null;

  return {
    slug: raw.slug,
    title: raw.title,
    subtitle: raw.subtitle?.trim() || undefined,
    year: raw.year,
    date: raw.date,
    location: raw.location,
    type: raw.type,
    category: raw.category as WorkCategory,
    categoryLabel,
    role: raw.role,
    with: raw.with ?? [],
    short: raw.short,
    full: raw.full ?? "",
    primaryVideo: primary,
    stills: raw.stills ?? [],
    poster: raw.poster?.trim() || null,
    posterScale: raw.posterScale,
    posterQuality: raw.posterQuality?.trim() || undefined,
    posterFallback: raw.posterFallback?.trim() || undefined,
    posterPlaceholder: normalizePlaceholder(raw.posterPlaceholder),
    archiveVideos: raw.archiveVideos?.filter((v) => v.url?.trim()) ?? [],
    externalUrl: raw.externalUrl?.trim() || null,
    soundcloud: raw.soundcloud?.trim() || null,
    externalLinks: raw.externalLinks ?? [],
    order: raw.order,
    focal: raw.focal,
    selected: raw.selected,
  };
}

function loadWorks(categoryMap: Map<string, CategoryEntry>): WorkItem[] {
  const dir = path.join(contentDir, "works");
  return fs
    .readdirSync(dir)
    .filter((name) => name.endsWith(".json"))
    .map((name) => readJson<WorkFile>(path.join("works", name)))
    .map((raw) => {
      const cat = categoryMap.get(raw.category as string);
      const categoryLabel = cat?.label ?? String(raw.category);
      return normalizeWork(raw, categoryLabel);
    })
    .sort((a, b) => a.order - b.order);
}

let settingsCache: SiteSettings | null = null;
let aboutCache: AboutContent | null = null;
let contactCache: ContactContent | null = null;
let servicesCache: ServiceOffer[] | null = null;
let categoriesCache: CategoryEntry[] | null = null;
let worksCache: WorkItem[] | null = null;

export function getSiteSettings(): SiteSettings {
  settingsCache ??= readJson<SiteSettings>("site.json");
  return settingsCache;
}

export function getAbout(): AboutContent {
  aboutCache ??= readJson<AboutContent>("about.json");
  return aboutCache;
}

export function getContact(): ContactContent {
  contactCache ??= readJson<ContactContent>("contact.json");
  return contactCache;
}

export function getServices(): ServiceOffer[] {
  servicesCache ??= readJson<ServiceOffer[]>("services.json");
  return servicesCache;
}

export function getCategories(): CategoryEntry[] {
  categoriesCache ??= loadCategories();
  return categoriesCache;
}

export function getWorks(): WorkItem[] {
  if (!worksCache) {
    const categoryMap = new Map(
      getCategories().map((c) => [c.slug, c]),
    );
    worksCache = loadWorks(categoryMap);
  }
  return worksCache;
}

export function getWorkBySlug(slug: string): WorkItem | undefined {
  const decoded = decodeURIComponent(slug);
  return getWorks().find(
    (w) =>
      w.slug === slug ||
      w.slug === decoded ||
      encodeURI(w.slug) === slug,
  );
}

export function getInternalWorks(): WorkItem[] {
  return getWorks().filter((w) => !w.externalUrl);
}

export function getSelectedWorks(limit?: number): WorkItem[] {
  const list = filterWorks(getWorks(), "selected");
  return typeof limit === "number" ? list.slice(0, limit) : list;
}

export function getWorksByFilter(filter: FilterId): WorkItem[] {
  return filterWorks(getWorks(), filter);
}

export function getWorksByCategory(
  category: WorkCategory | "all",
): WorkItem[] {
  return getWorksByFilter(category);
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
  return getSiteSettings().nav;
}

export function getCategoryFilters(): CategoryFilter[] {
  const settings = getSiteSettings();
  const categories = getCategories();
  const usedSlugs = new Set(getWorks().map((w) => w.category));

  const filters: CategoryFilter[] = [
    { id: "selected", label: settings.works_filters.selected_label },
    { id: "all", label: settings.works_filters.all_label },
  ];

  for (const cat of categories) {
    if (usedSlugs.has(cat.slug)) {
      filters.push({ id: cat.slug, label: cat.label });
    }
  }

  return filters;
}

export function getWorksEmptyMessage(): string {
  return getSiteSettings().works_filters.empty_message;
}
