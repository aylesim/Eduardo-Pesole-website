"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "motion/react";
import FilterChips from "@/components/FilterChips";
import {
  getCategoryFilters,
  isExternalWork,
  workHref,
} from "@/lib/content";
import type { WorkCategory, WorkItem } from "@/lib/types";

type ForwardIndexProps = {
  works: WorkItem[];
};

function DiscItem({
  work,
  index,
  progress,
  count,
}: {
  work: WorkItem;
  index: number;
  progress: number;
  count: number;
}) {
  const active = progress * Math.max(count - 1, 1);
  const offset = index - active;
  const abs = Math.abs(offset);
  const z = -offset * 220;
  const y = offset * 28;
  const scale = Math.max(0.55, 1 - abs * 0.14);
  const opacity = Math.max(0, 1 - abs * 0.42);
  const blur = abs > 1.2 ? Math.min(6, (abs - 1.2) * 4) : 0;
  const isActive = abs < 0.55;
  const href = workHref(work);
  const external = isExternalWork(work);

  const content = (
    <>
      <div
        className={`relative aspect-square w-[min(58vw,340px)] overflow-hidden rounded-full border transition-[border-color,box-shadow] duration-(--duration-med) md:w-[380px] ${
          isActive
            ? "border-accent/70 shadow-[0_0_0_1px_color-mix(in_oklab,var(--color-accent)_30%,transparent)]"
            : "border-line"
        }`}
      >
        {work.poster ? (
          <Image
            src={work.poster}
            alt=""
            fill
            className="object-cover"
            sizes="380px"
            unoptimized={work.poster.startsWith("http")}
            priority={index < 2}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-surface-elevated font-meta">
            {work.categoryLabel}
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-base/50 via-transparent to-base/10" />
      </div>
      <div
        className={`absolute top-1/2 left-[calc(50%+min(32vw,210px))] hidden -translate-y-1/2 md:block ${
          isActive ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <p className="font-meta mb-2 text-accent-secondary">
          {work.categoryLabel}
          {work.year ? ` · ${work.year}` : ""}
        </p>
        <h3 className="max-w-[14rem] text-2xl leading-tight text-ink">
          {work.title}
        </h3>
      </div>
      <div
        className={`mt-5 text-center md:hidden ${
          isActive ? "opacity-100" : "opacity-0"
        }`}
      >
        <p className="font-meta mb-1 text-accent-secondary">
          {work.categoryLabel}
          {work.year ? ` · ${work.year}` : ""}
        </p>
        <h3 className="text-xl text-ink">{work.title}</h3>
      </div>
    </>
  );

  const style = {
    transform: `translate3d(0, ${y}px, ${z}px) scale(${scale})`,
    opacity,
    filter: blur ? `blur(${blur}px)` : undefined,
    zIndex: Math.round(100 - abs * 10),
  } as const;

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute inset-0 flex flex-col items-center justify-center no-underline focus-ring rounded-full"
        style={style}
        tabIndex={isActive ? 0 : -1}
        aria-label={`${work.title}${work.year ? ` (${work.year})` : ""}, opens external`}
      >
        {content}
      </a>
    );
  }

  return (
    <Link
      href={href}
      className="absolute inset-0 flex flex-col items-center justify-center no-underline focus-ring rounded-full"
      style={style}
      tabIndex={isActive ? 0 : -1}
      aria-label={`${work.title}${work.year ? ` (${work.year})` : ""}`}
    >
      {content}
    </Link>
  );
}

function MobileStack({ works }: { works: WorkItem[] }) {
  return (
    <ul className="space-y-8 px-1">
      {works.map((work, i) => {
        const href = workHref(work);
        const external = isExternalWork(work);
        const card = (
          <article className="group relative overflow-hidden rounded-2xl border border-line bg-surface">
            <div className="relative aspect-[4/3] overflow-hidden">
              {work.poster ? (
                <Image
                  src={work.poster}
                  alt=""
                  fill
                  className="object-cover transition-transform duration-(--duration-slow) group-hover:scale-[1.04] group-hover:translate-y-[-2%]"
                  sizes="(max-width: 768px) 100vw, 600px"
                  unoptimized={work.poster.startsWith("http")}
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-surface-elevated font-meta">
                  {work.categoryLabel}
                </div>
              )}
            </div>
            <div className="space-y-1 px-4 py-4">
              <p className="font-meta text-accent-secondary">
                {work.categoryLabel}
                {work.year ? ` · ${work.year}` : ""}
              </p>
              <h3 className="text-xl text-ink">{work.title}</h3>
            </div>
          </article>
        );

        return (
          <li key={work.slug} style={{ transform: `translateY(${(i % 3) * 4}px)` }}>
            {external ? (
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
            )}
          </li>
        );
      })}
    </ul>
  );
}

function ReducedList({ works }: { works: WorkItem[] }) {
  return (
    <ul className="divide-y divide-line border-y border-line">
      {works.map((work) => {
        const href = workHref(work);
        const external = isExternalWork(work);
        const inner = (
          <div className="flex items-center gap-4 py-4">
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full bg-surface">
              {work.poster ? (
                <Image
                  src={work.poster}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="64px"
                  unoptimized={work.poster.startsWith("http")}
                />
              ) : null}
            </div>
            <div>
              <p className="font-meta text-accent-secondary">
                {work.categoryLabel}
                {work.year ? ` · ${work.year}` : ""}
              </p>
              <h3 className="text-lg text-ink">{work.title}</h3>
            </div>
          </div>
        );
        return (
          <li key={work.slug}>
            {external ? (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="block no-underline hover:bg-surface/60"
              >
                {inner}
              </a>
            ) : (
              <Link
                href={href}
                className="block no-underline hover:bg-surface/60"
              >
                {inner}
              </Link>
            )}
          </li>
        );
      })}
    </ul>
  );
}

function DesktopParade({ works }: { works: WorkItem[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (v) => setProgress(v));

  const height = `${Math.max(works.length, 1) * 85}vh`;

  return (
    <div ref={trackRef} className="relative" style={{ height }}>
      <div
        className="sticky top-0 flex h-screen items-center justify-center overflow-hidden"
        style={{ perspective: "1200px", perspectiveOrigin: "50% 45%" }}
      >
        <div
          className="relative h-full w-full"
          style={{ transformStyle: "preserve-3d" }}
        >
          {works.map((work, index) => (
            <DiscItem
              key={work.slug}
              work={work}
              index={index}
              progress={progress}
              count={works.length}
            />
          ))}
        </div>
        <p className="pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2 font-meta text-muted">
          Scroll to advance
        </p>
      </div>
    </div>
  );
}

export default function ForwardIndex({ works }: ForwardIndexProps) {
  const filters = getCategoryFilters();
  const [active, setActive] = useState<"all" | WorkCategory>("all");
  const [isMobile, setIsMobile] = useState(false);
  const reduced = useReducedMotion();

  const filtered = useMemo(
    () =>
      active === "all" ? works : works.filter((w) => w.category === active),
    [works, active],
  );

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return (
    <section aria-label="Forward Index" className="relative">
      <div className="mx-auto max-w-7xl px-5 pb-6 md:px-8">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-meta mb-2 text-accent">Forward Index</p>
            <h2 className="text-3xl md:text-4xl">Selected work</h2>
          </div>
          <FilterChips
            filters={filters}
            active={active}
            onChange={setActive}
          />
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <noscript>
          <ReducedList works={works} />
        </noscript>
        {reduced ? (
          <ReducedList works={filtered} />
        ) : isMobile ? (
          <MobileStack works={filtered} />
        ) : (
          <DesktopParade works={filtered} />
        )}
      </div>

      {/* SSR-readable list for crawlers / no-js; visually hidden when JS stack renders */}
      <ul className="sr-only">
        {works.map((work) => (
          <li key={`ssr-${work.slug}`}>
            {isExternalWork(work) ? (
              <a href={workHref(work)}>{work.title}</a>
            ) : (
              <Link href={workHref(work)}>{work.title}</Link>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
