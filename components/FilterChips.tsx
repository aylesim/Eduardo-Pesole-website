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
      className="flex flex-nowrap gap-2 overflow-x-auto"
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
            className={`shrink-0 cursor-pointer rounded-sm border px-3 py-1.5 font-ui transition-colors duration-(--duration-ui) ease-(--ease-ui) ${
              selected
                ? "border-accent bg-accent text-accent-ink"
                : "border-border text-muted hover:text-text"
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
