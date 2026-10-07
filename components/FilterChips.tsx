"use client";

import type { CategoryFilter, FilterId } from "@/lib/types";

const WORKS_SCOPE_IDS = new Set<FilterId>(["selected", "all"]);

type FilterChipsProps = {
  filters: CategoryFilter[];
  active: FilterId;
  onChange: (id: FilterId) => void;
  variant?: "default" | "nav" | "works";
};

function chipClass(
  variant: "default" | "nav" | "works",
  selected: boolean,
): string {
  if (variant === "works") {
    return `works-filter-chip${selected ? " works-filter-chip--active" : ""}`;
  }
  if (variant === "nav") {
    return `shrink-0 cursor-pointer font-ui py-1 transition-opacity duration-(--duration-ui) ${
      selected
        ? "text-text underline decoration-1 underline-offset-[7px]"
        : "text-text/45 hover:text-text"
    }`;
  }
  return `type-h2 shrink-0 cursor-pointer border-b-2 py-1 transition-opacity duration-(--duration-ui) ${
    selected
      ? "border-text text-text"
      : "border-transparent text-text/42 hover:text-text"
  }`;
}

export default function FilterChips({
  filters,
  active,
  onChange,
  variant = "default",
}: FilterChipsProps) {
  const isNav = variant === "nav";
  const isWorks = variant === "works";

  const renderChip = (filter: CategoryFilter) => {
    const selected = filter.id === active;
    return (
      <button
        key={filter.id}
        type="button"
        role="radio"
        aria-checked={selected}
        className={chipClass(variant, selected)}
        onClick={() => onChange(filter.id)}
      >
        {filter.label}
      </button>
    );
  };

  if (isWorks) {
    const scopeFilters = filters.filter((f) =>
      WORKS_SCOPE_IDS.has(f.id),
    );
    const categoryFilters = filters.filter(
      (f) => !WORKS_SCOPE_IDS.has(f.id),
    );

    return (
      <div className="works-filters" role="radiogroup" aria-label="Filter works">
        <div className="works-filters-group">{scopeFilters.map(renderChip)}</div>
        <span className="works-filters-divider" aria-hidden="true" />
        <div className="works-filters-group">
          {categoryFilters.map(renderChip)}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex flex-nowrap overflow-x-auto ${
        isNav ? "gap-6 md:gap-7" : "gap-8 md:gap-12"
      }`}
      role="radiogroup"
      aria-label="Filter by category"
    >
      {filters.map(renderChip)}
    </div>
  );
}
