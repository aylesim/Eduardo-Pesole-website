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
            className={`cursor-pointer rounded-sm border px-3 py-1.5 font-mono text-[0.75rem] font-medium uppercase tracking-[0.08em] transition-colors duration-(--duration-fast) ${
              selected
                ? "border-primary bg-primary text-base"
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
