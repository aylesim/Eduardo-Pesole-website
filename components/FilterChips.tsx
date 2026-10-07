"use client";

import type { CategoryFilter, FilterId } from "@/lib/types";

type FilterChipsProps = {
  filters: CategoryFilter[];
  active: FilterId;
  onChange: (id: FilterId) => void;
};

export default function FilterChips({
  filters,
  active,
  onChange,
}: FilterChipsProps) {
  return (
    <div
      className="flex flex-nowrap gap-8 overflow-x-auto md:gap-12"
      role="radiogroup"
      aria-label="Filter by category"
    >
      {filters.map((filter) => {
        const selected = filter.id === active;
        return (
          <button
            key={filter.id}
            type="button"
            role="radio"
            aria-checked={selected}
            className={`type-h2 shrink-0 cursor-pointer border-b-2 py-1 transition-opacity duration-(--duration-ui) ${
              selected
                ? "border-text text-text"
                : "border-transparent text-text/42 hover:text-text"
            }`}
            onClick={() => onChange(filter.id)}
          >
            {filter.label}
          </button>
        );
      })}
    </div>
  );
}
