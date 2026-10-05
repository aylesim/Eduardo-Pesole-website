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
      className="flex flex-wrap gap-2"
      role="tablist"
      aria-label="Filter by category"
    >
      {filters.map((filter) => {
        const selected = filter.id === active;
        return (
          <button
            key={filter.id}
            type="button"
            role="tab"
            aria-selected={selected}
            className={`focus-ring cursor-pointer rounded-sm border px-3 py-1.5 font-meta transition-colors duration-(--duration-fast) ${
              selected
                ? "border-accent bg-accent/15 text-accent"
                : "border-line text-muted hover:border-muted hover:text-ink"
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
