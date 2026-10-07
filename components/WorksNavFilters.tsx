"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import FilterChips from "@/components/FilterChips";
import { getCategoryFilters, parseFilterParam } from "@/lib/content";
import type { FilterId } from "@/lib/types";

export default function WorksNavFilters() {
  const filters = getCategoryFilters();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const active = parseFilterParam(searchParams.get("filter"));

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
