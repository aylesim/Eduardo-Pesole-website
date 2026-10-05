"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import FilterChips from "@/components/FilterChips";
import {
  getCategoryFilters,
  getWorksByCategory,
  isExternalWork,
  plateSrc,
  workHref,
} from "@/lib/content";
import type { WorkCategory, WorkItem } from "@/lib/types";

type WorksBrowserProps = {
  works: WorkItem[];
};

const SPAN_PATTERN = [7, 5, 5, 7, 4, 4, 4] as const;

const SPAN_CLASS: Record<(typeof SPAN_PATTERN)[number], string> = {
  7: "col-span-12 lg:col-span-7",
  5: "col-span-12 lg:col-span-5",
  4: "col-span-12 lg:col-span-4",
};

function mosaicSpan(index: number) {
  return SPAN_PATTERN[index % SPAN_PATTERN.length]!;
}

function mosaicAspect(index: number) {
  return index % 3 === 1
    ? "aspect-[16/10] max-lg:aspect-[16/10]"
    : "aspect-[4/5] max-lg:aspect-[16/10]";
}

function PlatePlaceholder({ work }: { work: WorkItem }) {
  return (
    <div
      className="flex h-full w-full items-center justify-center p-6 text-center"
      style={{
        background:
          "radial-gradient(circle at 40% 35%, color-mix(in oklab, var(--color-accent) 50%, var(--color-elevated)), var(--color-base) 72%)",
      }}
    >
      <span className="font-meta text-text/90">{work.title}</span>
    </div>
  );
}

function MosaicTile({
  work,
  index,
}: {
  work: WorkItem;
  index: number;
}) {
  const href = workHref(work);
  const external = isExternalWork(work);
  const src = plateSrc(work);
  const span = mosaicSpan(index);

  const card = (
    <article className="group relative bg-surface">
      <div className={`relative overflow-hidden bg-elevated ${mosaicAspect(index)}`}>
        {src ? (
          <Image
            src={src}
            alt=""
            fill
            className="object-cover transition-transform duration-(--duration-base) ease-(--ease-oxide) group-hover:scale-[1.03]"
            style={{ objectPosition: work.focal }}
            sizes="(max-width: 1024px) 100vw, 58vw"
            unoptimized={src.startsWith("http")}
          />
        ) : (
          <PlatePlaceholder work={work} />
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-base/80 via-transparent to-transparent opacity-0 transition-opacity duration-(--duration-fast) group-hover:opacity-100 max-lg:hidden" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 hidden p-4 opacity-0 transition-opacity duration-(--duration-fast) group-hover:opacity-100 lg:block">
          <p className="font-meta mb-1 text-text/80">
            {[work.year, work.categoryLabel].filter(Boolean).join(" · ")}
          </p>
          <h2 className="font-display text-xl font-semibold text-text">
            {work.title}
            {external ? " ↗" : ""}
          </h2>
        </div>
      </div>
      <div className="space-y-1 pt-3 lg:hidden">
        <p className="font-meta">
          {[work.year, work.categoryLabel].filter(Boolean).join(" · ")}
        </p>
        <h2 className="font-display text-lg font-semibold text-text">
          {work.title}
          {external ? " ↗" : ""}
        </h2>
      </div>
    </article>
  );

  return (
    <li className={SPAN_CLASS[span]}>
      {external ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="block no-underline"
        >
          {card}
        </a>
      ) : (
        <Link href={href} className="block no-underline">
          {card}
        </Link>
      )}
    </li>
  );
}

export default function WorksBrowser({ works }: WorksBrowserProps) {
  const filters = getCategoryFilters();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const filterParam = searchParams.get("filter");
  const active: "all" | WorkCategory =
    filterParam === "games" ||
    filterParam === "art-collabs" ||
    filterParam === "movies" ||
    filterParam === "music"
      ? filterParam
      : "all";

  const gridWorks = useMemo(() => {
    if (active === "all") return works;
    return getWorksByCategory(active);
  }, [works, active]);

  function setFilter(id: "all" | WorkCategory) {
    const params = new URLSearchParams(searchParams.toString());
    if (id === "all") params.delete("filter");
    else params.set("filter", id);
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  return (
    <div className="space-y-10">
      <div className="sticky top-[57px] z-20 -mx-[clamp(16px,4vw,48px)] border-b border-border bg-base/95 px-[clamp(16px,4vw,48px)] py-3">
        <FilterChips filters={filters} active={active} onChange={setFilter} />
      </div>

      {gridWorks.length === 0 ? (
        <p className="type-body text-muted">No projects in this filter.</p>
      ) : (
        <ul className="grid grid-cols-12 gap-3 md:gap-4 lg:gap-5">
          {gridWorks.map((work, index) => (
            <MosaicTile key={work.slug} work={work} index={index} />
          ))}
        </ul>
      )}
    </div>
  );
}
