"use client";

import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import CueCard from "@/components/CueCard";
import WorksNavFilters from "@/components/WorksNavFilters";
import {
  categorySlugsFromFilters,
  filterWorks,
  parseFilterParam,
} from "@/lib/work-utils";
import type { CategoryFilter, WorkItem } from "@/lib/types";

type WorksBrowserProps = {
  works: WorkItem[];
  filters: CategoryFilter[];
  emptyMessage: string;
};

const SPANS = [
  "col-span-12 lg:col-span-7",
  "col-span-12 lg:col-span-5",
  "col-span-12 lg:col-span-5 lg:col-start-2",
  "col-span-12 lg:col-span-6 lg:col-start-7",
] as const;

export default function WorksBrowser({
  works,
  filters,
  emptyMessage,
}: WorksBrowserProps) {
  const searchParams = useSearchParams();
  const categorySlugs = categorySlugsFromFilters(filters);
  const active = parseFilterParam(searchParams.get("filter"), categorySlugs);

  const gridWorks = useMemo(() => {
    if (active === "all") return works;
    return filterWorks(works, active);
  }, [works, active]);

  return (
    <div>
      <div className="works-filters-bar">
        <WorksNavFilters filters={filters} />
      </div>

      {gridWorks.length === 0 ? (
        <p className="font-meta">{emptyMessage}</p>
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
