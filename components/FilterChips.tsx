"use client";

import type { CategoryFilter, WorkCategory } from "@/lib/types";

type FilterChipsProps = {
  filters: CategoryFilter[];
  active: "all" | WorkCategory;
  onChange: (id: "all" | WorkCategory) => void;
};

export default function FilterChips({
  filters,
  active,
  onChange,
}: FilterChipsProps) {
  return (
    <div
      className="flex flex-nowrap gap-2 overflow-x-auto md:flex-wrap"
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
            className={`shrink-0 cursor-pointer rounded-sm border px-3 py-1.5 font-body text-[0.6875rem] font-medium tracking-[0.1em] uppercase transition-colors duration-(--duration-fast) ease-(--ease-oxide) ${
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
