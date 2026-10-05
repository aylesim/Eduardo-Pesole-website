"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import FilterChips from "@/components/FilterChips";
import ScrollReveal from "@/components/ScrollReveal";
import {
  getCategoryFilters,
  getMusicWorks,
  isExternalWork,
  workHref,
} from "@/lib/content";
import type { WorkCategory, WorkItem } from "@/lib/types";

type WorksBrowserProps = {
  works: WorkItem[];
};

export default function WorksBrowser({ works }: WorksBrowserProps) {
  const filters = getCategoryFilters();
  const [active, setActive] = useState<"all" | WorkCategory>("all");
  const music = getMusicWorks();

  const gridWorks = useMemo(() => {
    const base =
      active === "all"
        ? works.filter((w) => w.category !== "music")
        : works.filter((w) => w.category === active);
    if (active === "music") return [];
    return base;
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
              const card = (
                <article className="group overflow-hidden rounded-sm">
                  <div className="relative aspect-[4/5] overflow-hidden bg-surface">
                    {work.poster ? (
                      <Image
                        src={work.poster}
                        alt=""
                        fill
                        className="object-cover transition-transform duration-(--duration-med) ease-(--ease-heavy) group-hover:-translate-y-1 group-hover:scale-[1.04]"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        unoptimized={work.poster.startsWith("http")}
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center font-meta">
                        {work.categoryLabel}
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-base via-base/10 to-transparent opacity-80 transition-opacity group-hover:opacity-95" />
                    <div className="absolute inset-x-0 bottom-0 p-4">
                      <p className="font-meta mb-1 text-accent-secondary">
                        {work.categoryLabel}
                        {work.year ? ` · ${work.year}` : ""}
                      </p>
                      <h2 className="text-xl text-ink transition-colors group-hover:text-accent">
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
              <h2 className="text-2xl">Music</h2>
              <p className="font-meta">External listens</p>
            </div>
            <div className="-mx-5 flex gap-4 overflow-x-auto px-5 pb-3 md:mx-0 md:px-0">
              {music.map((work) => (
                <a
                  key={work.slug}
                  href={workHref(work)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group w-[220px] shrink-0 no-underline sm:w-[260px]"
                >
                  <div className="relative mb-3 aspect-square overflow-hidden rounded-sm bg-surface">
                    {work.poster ? (
                      <Image
                        src={work.poster}
                        alt=""
                        fill
                        className="object-cover transition-transform duration-(--duration-med) group-hover:scale-105"
                        sizes="260px"
                        unoptimized={work.poster.startsWith("http")}
                      />
                    ) : null}
                  </div>
                  <p className="font-meta mb-1 text-accent-secondary">
                    {work.year || "Listen"}
                  </p>
                  <h3 className="text-lg text-ink group-hover:text-accent">
                    {work.title}
                  </h3>
                </a>
              ))}
            </div>
          </div>
        </ScrollReveal>
      ) : null}
    </div>
  );
}
