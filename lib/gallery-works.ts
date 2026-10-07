import { getWorks } from "@/lib/content";
import { isExternalWork, plateSrc, workHref } from "@/lib/work-utils";
import type { WorkItem } from "@/lib/types";

export type GalleryWork = {
  slug: string;
  title: string;
  year: string;
  categoryLabel: string;
  poster: string;
  href: string;
  external: boolean;
};

/** ~17 poster-backed projects for the Index plane parade. */
export function getGalleryWorks(limit = 17): GalleryWork[] {
  const works = getWorks()
    .map((work) => toGalleryWork(work))
    .filter((w): w is GalleryWork => Boolean(w));
  return works.slice(0, limit);
}

function toGalleryWork(work: WorkItem): GalleryWork | null {
  const poster = plateSrc(work);
  if (!poster) return null;
  return {
    slug: work.slug,
    title: work.title,
    year: work.year,
    categoryLabel: work.categoryLabel,
    poster,
    href: workHref(work),
    external: isExternalWork(work),
  };
}
