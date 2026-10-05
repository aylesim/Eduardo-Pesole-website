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
      className="flex flex-nowrap gap-5 overflow-x-auto md:gap-8"
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
            className={`shrink-0 cursor-pointer border-b py-2 font-ui transition-opacity duration-(--duration-ui) ${
              selected
                ? "border-text text-text"
                : "border-transparent text-muted hover:text-text"
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
