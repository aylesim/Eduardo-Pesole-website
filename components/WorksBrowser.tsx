"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import CueCard from "@/components/CueCard";
import FilterChips from "@/components/FilterChips";
import {
  getCategoryFilters,
  getWorksByFilter,
  parseFilterParam,
} from "@/lib/content";
import type { FilterId, WorkItem } from "@/lib/types";

type WorksBrowserProps = {
  works: WorkItem[];
};

const SPANS = [
  "col-span-12 lg:col-span-7",
  "col-span-10 col-start-3 lg:col-span-4 lg:col-start-9 lg:mt-36",
  "col-span-11 lg:col-span-5 lg:col-start-2",
  "col-span-12 lg:col-span-6 lg:col-start-7 lg:mt-28",
  "col-span-12 lg:col-span-10 lg:col-start-2",
  "col-span-11 col-start-2 lg:col-span-5 lg:col-start-1",
  "col-span-12 lg:col-span-5 lg:col-start-8 lg:mt-32",
  "col-span-12 lg:col-span-7 lg:col-start-2",
  "col-span-10 col-start-3 lg:col-span-4 lg:col-start-9 lg:mt-40",
  "col-span-12 lg:col-span-10 lg:col-start-2",
] as const;

export default function WorksBrowser({ works }: WorksBrowserProps) {
  const filters = getCategoryFilters();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const active = parseFilterParam(searchParams.get("filter"));

  const gridWorks = useMemo(() => {
    if (active === "all") return works;
    return getWorksByFilter(active);
  }, [works, active]);

  function setFilter(id: FilterId) {
    const params = new URLSearchParams(searchParams.toString());
    if (id === "selected") params.delete("filter");
    else params.set("filter", id);
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  return (
    <div className="space-y-16 md:space-y-24">
      <div className="sticky top-[55px] z-20 -mx-[clamp(18px,4.2vw,72px)] flex flex-col gap-3 border-y border-border bg-base/95 px-[clamp(18px,4.2vw,72px)] py-3 backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between">
        <FilterChips filters={filters} active={active} onChange={setFilter} />
        <p className="font-meta shrink-0 text-muted">
          {String(gridWorks.length).padStart(2, "0")}
        </p>
      </div>

      {gridWorks.length === 0 ? (
        <p className="font-meta">No works in this family.</p>
      ) : (
        <ul className="grid grid-cols-12 gap-x-5 gap-y-20 md:gap-x-8 md:gap-y-32">
          {gridWorks.map((work, index) => (
            <CueCard
              key={work.slug}
              work={work}
              spanClass={SPANS[index % SPANS.length]}
              aspect={index % 4 === 2 ? "portrait" : "video"}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
