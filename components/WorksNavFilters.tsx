"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import FilterChips from "@/components/FilterChips";
import {
  categorySlugsFromFilters,
  parseFilterParam,
} from "@/lib/work-utils";
import type { CategoryFilter, FilterId } from "@/lib/types";

type WorksNavFiltersProps = {
  filters: CategoryFilter[];
};

export default function WorksNavFilters({ filters }: WorksNavFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const categorySlugs = categorySlugsFromFilters(filters);
  const active = parseFilterParam(searchParams.get("filter"), categorySlugs);

  function setFilter(id: FilterId) {
    const params = new URLSearchParams(searchParams.toString());
    if (id === "selected") params.delete("filter");
    else params.set("filter", id);
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  return (
    <div className="pointer-events-auto">
      <FilterChips
        variant="works"
        filters={filters}
        active={active}
        onChange={setFilter}
      />
    </div>
  );
}
