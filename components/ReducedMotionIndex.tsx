"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useCallback,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import FilterChips from "@/components/FilterChips";
import {
  isExternalWork,
  plateSrc,
  workHref,
} from "@/lib/content";
import type { CategoryFilter, WorkCategory, WorkItem } from "@/lib/types";

type ReducedMotionIndexProps = {
  works: WorkItem[];
  filters: CategoryFilter[];
  activeFilter: "all" | WorkCategory;
  onFilterChange: (id: "all" | WorkCategory) => void;
};

export default function ReducedMotionIndex({
  works,
  filters,
  activeFilter,
  onFilterChange,
}: ReducedMotionIndexProps) {
  const [active, setActive] = useState(0);
  const scrollerRef = useRef<HTMLUListElement>(null);

  const scrollTo = useCallback((index: number) => {
    const el = scrollerRef.current;
    if (!el) return;
    const child = el.children[index] as HTMLElement | undefined;
    child?.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" });
    setActive(index);
  }, []);

  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (["ArrowRight", "ArrowDown", "j", "J", "PageDown"].includes(e.key)) {
      e.preventDefault();
      scrollTo(Math.min(active + (e.key === "PageDown" ? 3 : 1), works.length - 1));
    } else if (["ArrowLeft", "ArrowUp", "k", "K", "PageUp"].includes(e.key)) {
      e.preventDefault();
      scrollTo(Math.max(active - (e.key === "PageUp" ? 3 : 1), 0));
    } else if (e.key === "Home") {
      e.preventDefault();
      scrollTo(0);
    } else if (e.key === "End") {
      e.preventDefault();
      scrollTo(works.length - 1);
    } else if (e.key === "Enter") {
      const work = works[active];
      if (!work) return;
      const href = workHref(work);
      if (isExternalWork(work)) window.open(href, "_blank", "noopener");
      else window.location.href = href;
    }
  }

  const activeWork = works[active];

  return (
    <div
      className="flex h-full flex-col outline-none"
      tabIndex={0}
      onKeyDown={onKeyDown}
    >
      <div className="page-gutter shrink-0 pt-16 pb-4">
        <FilterChips
          filters={filters}
          active={activeFilter}
          onChange={onFilterChange}
        />
      </div>

      {works.length === 0 ? (
        <p className="page-gutter type-body text-muted">
          No projects in this filter.
        </p>
      ) : (
        <>
          <ul
            ref={scrollerRef}
            className="flex flex-1 items-center gap-5 overflow-x-auto px-[clamp(16px,4vw,48px)] pb-6 [scroll-snap-type:x_mandatory]"
          >
            {works.map((work, index) => {
              const href = workHref(work);
              const external = isExternalWork(work);
              const src = plateSrc(work);
              const selected = index === active;
              const card = (
                <div
                  className={`w-[min(56vw,240px)] [scroll-snap-align:center] ${
                    selected ? "opacity-100" : "opacity-55"
                  }`}
                >
                  <div
                    className={`relative mb-3 aspect-[4/5] overflow-hidden bg-elevated ${
                      selected
                        ? "outline outline-2 outline-offset-2 outline-focus"
                        : ""
                    }`}
                    style={{ borderRadius: "12%" }}
                  >
                    {src ? (
                      <Image
                        src={src}
                        alt=""
                        fill
                        className="object-cover"
                        style={{ objectPosition: work.focal || "50% 50%" }}
                        sizes="240px"
                        unoptimized={src.startsWith("http")}
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center p-4 text-center">
                        <span className="font-meta">{work.title}</span>
                      </div>
                    )}
                  </div>
                  <p className="mb-1 line-clamp-2 font-body text-[0.9375rem] font-semibold tracking-[-0.01em] text-text">
                    {work.title}
                  </p>
                  <p className="font-body text-[0.75rem] text-muted">
                    {[work.year, work.categoryLabel].filter(Boolean).join(" · ")}
                  </p>
                </div>
              );

              return (
                <li key={work.slug}>
                  {selected ? (
                    external ? (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block no-underline"
                      >
                        {card}
                      </a>
                    ) : (
                      <Link href={href} className="block no-underline">
                        {card}
                      </Link>
                    )
                  ) : (
                    <button
                      type="button"
                      className="block cursor-pointer border-0 bg-transparent p-0 text-left"
                      onClick={() => scrollTo(index)}
                    >
                      {card}
                    </button>
                  )}
                </li>
              );
            })}
          </ul>

          <div className="page-gutter flex items-end justify-between gap-4 pb-24 md:pb-28">
            <p className="font-meta text-rail">
              {String(active + 1).padStart(2, "0")} /{" "}
              {String(works.length).padStart(2, "0")}
            </p>
            {activeWork ? (
              <div className="max-w-[28ch] text-right" aria-live="polite">
                <p className="font-body text-[0.9375rem] font-semibold tracking-[-0.01em]">
                  {activeWork.title}
                </p>
                <p className="font-body text-[0.75rem] text-muted">
                  {[activeWork.year, activeWork.categoryLabel]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
              </div>
            ) : null}
          </div>
        </>
      )}
    </div>
  );
}
