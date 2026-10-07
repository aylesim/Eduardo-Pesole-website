"use client";

import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import CueCard from "@/components/CueCard";
import WorksNavFilters from "@/components/WorksNavFilters";
import { getWorksByFilter, parseFilterParam } from "@/lib/content";
import type { WorkItem } from "@/lib/types";

type WorksBrowserProps = {
  works: WorkItem[];
};

const SPANS = [
  "col-span-12 lg:col-span-7",
  "col-span-12 lg:col-span-5",
  "col-span-12 lg:col-span-5 lg:col-start-2",
  "col-span-12 lg:col-span-6 lg:col-start-7",
] as const;

export default function WorksBrowser({ works }: WorksBrowserProps) {
  const searchParams = useSearchParams();
  const active = parseFilterParam(searchParams.get("filter"));

  const gridWorks = useMemo(() => {
    if (active === "all") return works;
    return getWorksByFilter(active);
  }, [works, active]);

  return (
    <div>
      <div className="works-filters-bar">
        <WorksNavFilters />
      </div>

      {gridWorks.length === 0 ? (
        <p className="font-meta">Nothing in this category.</p>
      ) : (
        <ul className="grid grid-cols-12 gap-x-5 gap-y-16 md:gap-x-8 md:gap-y-24">
          {gridWorks.map((work, index) => (
            <CueCard
              key={work.slug}
              work={work}
              spanClass={SPANS[index % SPANS.length]}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
