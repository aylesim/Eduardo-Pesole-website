"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import FilterChips from "@/components/FilterChips";
import ScrollReveal from "@/components/ScrollReveal";
import {
  getCategoryFilters,
  getMusicWorks,
  getWorksByCategory,
  isExternalWork,
  plateSrc,
  workHref,
} from "@/lib/content";
import type { WorkCategory, WorkItem } from "@/lib/types";

type WorksBrowserProps = {
  works: WorkItem[];
};

function PlatePlaceholder({ work }: { work: WorkItem }) {
  const gradient =
    work.posterPlaceholder === "secondary"
      ? "radial-gradient(circle at 40% 35%, var(--color-secondary), var(--color-base) 70%)"
      : "radial-gradient(circle at 40% 35%, var(--color-primary), var(--color-base) 70%)";
  return (
    <div
      className="flex h-full w-full items-center justify-center p-6 text-center"
      style={{ background: gradient }}
    >
      <span className="font-mono text-xs uppercase tracking-[0.08em] text-text/90">
        {work.title}
      </span>
    </div>
  );
}

export default function WorksBrowser({ works }: WorksBrowserProps) {
  const filters = getCategoryFilters();
  const [active, setActive] = useState<"all" | WorkCategory>("all");
  const music = getMusicWorks();

  const gridWorks = useMemo(() => {
    if (active === "music") return [];
    const list =
      active === "all"
        ? works.filter((w) => w.category !== "music")
        : getWorksByCategory(active);
    return list;
  }, [works, active]);

  const showMusic = active === "all" || active === "music";

  return (
    <div className="space-y-12">
      <FilterChips filters={filters} active={active} onChange={setActive} />

      {active !== "music" ? (
        <ScrollReveal>
          <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {gridWorks.map((work) => {
              const href = workHref(work);
              const external = isExternalWork(work);
              const src = plateSrc(work);
              const card = (
                <article className="group overflow-hidden rounded-sm bg-surface">
                  <div className="relative aspect-[4/5] overflow-hidden bg-surface-elevated">
                    {src ? (
                      <Image
                        src={src}
                        alt=""
                        fill
                        className="object-cover transition-transform duration-(--duration-base) ease-(--ease-forward) group-hover:-translate-y-1 group-hover:scale-[1.04]"
                        style={{ objectPosition: work.focal }}
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        unoptimized={src.startsWith("http")}
                      />
                    ) : (
                      <PlatePlaceholder work={work} />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-base via-base/20 to-transparent opacity-80 transition-opacity group-hover:opacity-95" />
                    <div className="absolute inset-0 bg-secondary/0 transition-colors group-hover:bg-secondary/10" />
                    <div className="absolute inset-x-0 bottom-0 p-4">
                      <p className="font-meta mb-1">
                        {[work.year, work.categoryLabel]
                          .filter(Boolean)
                          .join(" · ")}
                      </p>
                      <h2 className="text-xl font-bold text-text transition-colors group-hover:text-primary">
                        {work.title}
                      </h2>
                    </div>
                  </div>
                </article>
              );

              return (
                <li key={work.slug}>
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
            })}
          </ul>
        </ScrollReveal>
      ) : null}

      {showMusic ? (
        <ScrollReveal>
          <div className="space-y-4">
            <div className="flex items-end justify-between gap-4">
              <h2 className="type-h2">Music</h2>
              <p className="font-meta text-secondary">External listens</p>
            </div>
            <div className="-mx-5 flex gap-4 overflow-x-auto px-5 pb-3 [scroll-snap-type:x_mandatory] md:mx-0 md:px-0">
              {music.map((work) => {
                const src = plateSrc(work);
                return (
                  <a
                    key={work.slug}
                    href={workHref(work)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group w-[280px] shrink-0 no-underline max-md:w-[64vw] [scroll-snap-align:start]"
                  >
                    <div className="relative mb-3 aspect-square overflow-hidden rounded-sm bg-surface-elevated transition-transform duration-(--duration-fast) group-hover:-translate-y-1.5">
                      {src ? (
                        <Image
                          src={src}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="280px"
                          unoptimized={src.startsWith("http")}
                        />
                      ) : (
                        <PlatePlaceholder work={work} />
                      )}
                      <span className="absolute right-3 bottom-3 hidden border border-secondary bg-base/80 px-2 py-1 font-mono text-[0.7rem] uppercase tracking-[0.08em] text-secondary group-hover:inline-block">
                        Listen ↗
                      </span>
                    </div>
                    {work.year ? (
                      <p className="font-meta mb-1 text-secondary">{work.year}</p>
                    ) : null}
                    <h3 className="text-lg font-bold text-text group-hover:text-primary">
                      {work.title}
                    </h3>
                  </a>
                );
              })}
            </div>
          </div>
        </ScrollReveal>
      ) : null}
    </div>
  );
}
