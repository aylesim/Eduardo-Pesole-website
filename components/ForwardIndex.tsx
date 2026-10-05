"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import FilterChips from "@/components/FilterChips";
import { forwardEase } from "@/components/SmoothScroll";
import {
  getCategoryFilters,
  getWorksByCategory,
  isExternalWork,
  plateSrc,
  workHref,
} from "@/lib/content";
import type { WorkCategory, WorkItem } from "@/lib/types";

const NOTCH_DESKTOP = 0.7;
const NOTCH_MOBILE = 0.6;

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function sampleDepth(a: number, values: number[]) {
  const clamped = Math.min(Math.max(a, 0), 3);
  const i = Math.floor(clamped);
  const f = clamped - i;
  const v0 = values[i] ?? values[values.length - 1]!;
  const v1 = values[Math.min(i + 1, values.length - 1)]!;
  return lerp(v0, v1, f);
}

function plateMetrics(d: number, mobile: boolean) {
  const a = Math.abs(d);
  const scale = sampleDepth(a, mobile ? [1, 0.78, 0.5, 0.38] : [1, 0.72, 0.5, 0.38]);
  const z = sampleDepth(a, mobile ? [0, -120, -360, -540] : [0, -180, -360, -540]);
  const yPct = sampleDepth(a, mobile ? [0, 0.52, 0.76, 0.96] : [0, 0.44, 0.76, 0.96]);
  const upcoming = sampleDepth(a, mobile ? [1, 0.4, 0.22, 0] : [1, 0.6, 0.22, 0]);
  const past = sampleDepth(a, mobile ? [1, 0.25, 0.1, 0] : [1, 0.4, 0.1, 0]);
  const overlay = sampleDepth(a, mobile ? [0, 0.45, 0.6, 0.8] : [0, 0.35, 0.6, 0.8]);
  const hiddenAt = mobile ? 1.5 : 2.5;
  return {
    a,
    scale,
    z,
    yPct: d > 0 ? -yPct : yPct,
    opacity: d >= 0 ? upcoming : past,
    overlay,
    hidden: a > hiddenAt,
  };
}

function PlateMedia({
  work,
  priority,
}: {
  work: WorkItem;
  priority?: boolean;
}) {
  const src = plateSrc(work);
  const scale = work.posterScale ?? 1;
  if (!src) {
    const gradient =
      work.posterPlaceholder === "secondary"
        ? "radial-gradient(circle at 40% 35%, var(--color-secondary), var(--color-base) 70%)"
        : "radial-gradient(circle at 40% 35%, var(--color-primary), var(--color-base) 70%)";
    return (
      <div
        className="flex h-full w-full items-center justify-center p-8 text-center"
        style={{ background: gradient }}
      >
        <span className="font-mono text-xs uppercase tracking-[0.08em] text-text/90">
          {work.title}
        </span>
      </div>
    );
  }
  return (
    <Image
      src={src}
      alt=""
      fill
      priority={priority}
      loading={priority ? "eager" : "lazy"}
      className="object-cover"
      style={{
        objectPosition: work.focal || "50% 50%",
        transform: scale !== 1 ? `scale(${scale})` : undefined,
      }}
      sizes="(min-width:768px) 36vw, 72vw"
      unoptimized={src.startsWith("http")}
    />
  );
}

function Plate({
  work,
  index,
  progress,
  mobile,
  active,
  onActivate,
}: {
  work: WorkItem;
  index: number;
  progress: MotionValue<number>;
  mobile: boolean;
  active: boolean;
  onActivate: () => void;
}) {
  const href = workHref(work);
  const external = isExternalWork(work);
  const transform = useTransform(progress, (p) => {
    const m = plateMetrics(index - p, mobile);
    if (m.hidden) return "translate3d(0,0,-999px) scale(0.01)";
    const plate = mobile ? Math.min(window.innerWidth * 0.72, 360) : Math.min(Math.max(window.innerWidth * 0.36, 280), 540);
    return `translate3d(0, ${m.yPct * plate}px, ${m.z}px) scale(${m.scale})`;
  });
  const opacity = useTransform(progress, (p) => {
    const m = plateMetrics(index - p, mobile);
    return m.hidden ? 0 : m.opacity;
  });
  const overlay = useTransform(progress, (p) => {
    const m = plateMetrics(index - p, mobile);
    return m.hidden ? 0.8 : m.overlay;
  });
  const visibility = useTransform(progress, (p) => {
    const m = plateMetrics(index - p, mobile);
    return m.hidden ? "hidden" : "visible";
  });
  const zIndex = useTransform(progress, (p) => {
    const m = plateMetrics(index - p, mobile);
    return 100 - Math.round(m.a * 10);
  });
  const willChange = useTransform(progress, (p) => {
    const m = plateMetrics(index - p, mobile);
    return m.a <= 2.5 ? "transform, opacity" : "auto";
  });

  const body = (
    <motion.div
      className={`relative aspect-square w-[clamp(280px,36vw,540px)] max-md:w-[min(72vw,360px)] overflow-hidden rounded-full ${
        active
          ? "shadow-[0_0_0_2px_color-mix(in_oklab,var(--color-primary)_70%,transparent)]"
          : "shadow-[0_0_0_1px_var(--color-border)]"
      } ${active ? "md:hover:scale-[1.03]" : ""}`}
      style={{
        transform,
        opacity,
        visibility,
        zIndex,
        willChange,
        transition: "box-shadow 180ms var(--ease-forward)",
      }}
    >
      <PlateMedia work={work} priority={index < 2} />
      <motion.span
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-base"
        style={{ opacity: overlay }}
      />
    </motion.div>
  );

  if (active) {
    if (external) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute left-[38%] top-1/2 -translate-x-1/2 -translate-y-1/2 max-md:left-1/2 max-md:top-[42%] no-underline"
          aria-label={`${work.title}${work.year ? `, ${work.year}` : ""}`}
        >
          {body}
        </a>
      );
    }
    return (
      <Link
        href={href}
        className="absolute left-[38%] top-1/2 -translate-x-1/2 -translate-y-1/2 max-md:left-1/2 max-md:top-[42%] no-underline"
        aria-label={`${work.title}${work.year ? `, ${work.year}` : ""}`}
      >
        {body}
      </Link>
    );
  }

  return (
    <button
      type="button"
      className="absolute left-[38%] top-1/2 -translate-x-1/2 -translate-y-1/2 max-md:left-1/2 max-md:top-[42%] cursor-pointer border-0 bg-transparent p-0"
      onClick={onActivate}
      tabIndex={-1}
      aria-label={`Go to ${work.title}`}
    >
      {body}
    </button>
  );
}

function TitleBlock({ work }: { work: WorkItem }) {
  const href = workHref(work);
  const external = isExternalWork(work);
  return (
    <motion.div
      key={work.slug}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
      className="max-w-[34ch]"
    >
      <p className="font-meta mb-3">
        {[work.year, work.categoryLabel].filter(Boolean).join(" · ")}
      </p>
      <h3 className="type-index-title mb-3 text-text">{work.title}</h3>
      {work.role ? (
        <p className="font-meta-value mb-4 text-muted">{work.role}</p>
      ) : null}
      {external ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-[0.75rem] font-medium uppercase tracking-[0.08em] text-primary"
        >
          Listen ↗
        </a>
      ) : (
        <Link
          href={href}
          className="font-mono text-[0.75rem] font-medium uppercase tracking-[0.08em] text-primary"
        >
          View project →
        </Link>
      )}
    </motion.div>
  );
}

function ReducedStrip({ works }: { works: WorkItem[] }) {
  return (
    <div className="overflow-x-auto px-5 pb-6 [scroll-snap-type:x_mandatory]">
      <ul className="flex gap-8">
        {works.map((work) => {
          const href = workHref(work);
          const external = isExternalWork(work);
          const card = (
            <div className="w-[240px] [scroll-snap-align:center]">
              <div className="relative mb-4 aspect-square overflow-hidden rounded-full bg-surface-elevated shadow-[0_0_0_1px_var(--color-border)]">
                <PlateMedia work={work} />
              </div>
              <p className="font-meta mb-1">
                {[work.year, work.categoryLabel].filter(Boolean).join(" · ")}
              </p>
              <h3 className="text-lg font-bold text-text">{work.title}</h3>
            </div>
          );
          return (
            <li key={work.slug}>
              {external ? (
                <a href={href} target="_blank" rel="noopener noreferrer" className="block no-underline">
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
    </div>
  );
}

type ForwardIndexProps = {
  works: WorkItem[];
};

export default function ForwardIndex({ works }: ForwardIndexProps) {
  const filters = getCategoryFilters();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [mobile, setMobile] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [stageOpacity, setStageOpacity] = useState(1);
  const idleTimer = useRef<number | null>(null);

  const filterParam = searchParams.get("filter");
  const activeFilter: "all" | WorkCategory =
    filterParam === "games" ||
    filterParam === "art-collabs" ||
    filterParam === "movies" ||
    filterParam === "music"
      ? filterParam
      : "all";

  const filtered = useMemo(
    () => getWorksByCategory(activeFilter),
    [activeFilter],
  );

  const count = Math.max(filtered.length, 1);
  const notch = mobile ? NOTCH_MOBILE : NOTCH_DESKTOP;
  const sectionHeight = `calc(${(count - 1) * notch * 100}svh + 100svh)`;

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const raw = useTransform(scrollYProgress, (v) => v * (count - 1));
  const spring = useSpring(raw, { stiffness: 120, damping: 22, mass: 1 });
  const progress = mobile || reduced ? raw : spring;
  const progressValue = useMotionValue(0);

  useMotionValueEvent(progress, "change", (v) => {
    progressValue.set(v);
    setActiveIndex(Math.round(v));
  });

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const scrollToIndex = useCallback(
    (index: number, immediate = false) => {
      const section = sectionRef.current;
      if (!section) return;
      const max = Math.max(count - 1, 1);
      const k = Math.min(Math.max(index, 0), count - 1);
      const top =
        section.offsetTop +
        (k / max) * (section.offsetHeight - window.innerHeight);
      const lenis = window.__lenis;
      if (lenis && !immediate && !mobile) {
        lenis.scrollTo(top, { duration: 0.65, easing: forwardEase });
      } else {
        window.scrollTo({ top, behavior: immediate ? "auto" : "smooth" });
      }
    },
    [count, mobile],
  );

  useEffect(() => {
    if (reduced || mobile) return;
    const unsub = scrollYProgress.on("change", () => {
      if (idleTimer.current) window.clearTimeout(idleTimer.current);
      idleTimer.current = window.setTimeout(() => {
        const p = progressValue.get();
        const base = Math.floor(p);
        const frac = p - base;
        const target = frac >= 0.18 ? base + 1 : base;
        scrollToIndex(target);
      }, 120);
    });
    return () => {
      unsub();
      if (idleTimer.current) window.clearTimeout(idleTimer.current);
    };
  }, [reduced, mobile, scrollYProgress, progressValue, scrollToIndex]);

  function setFilter(id: "all" | WorkCategory) {
    setStageOpacity(0);
    window.setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (id === "all") params.delete("filter");
      else params.set("filter", id);
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
      const section = sectionRef.current;
      if (section) {
        const lenis = window.__lenis;
        if (lenis) lenis.scrollTo(section.offsetTop, { immediate: true });
        else window.scrollTo({ top: section.offsetTop });
      }
      window.setTimeout(() => setStageOpacity(1), 40);
    }, 180);
  }

  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    const nextKeys = ["ArrowDown", "ArrowRight", "PageDown", "j", "J"];
    const prevKeys = ["ArrowUp", "ArrowLeft", "PageUp", "k", "K"];
    if (nextKeys.includes(e.key)) {
      e.preventDefault();
      scrollToIndex(activeIndex + 1);
    } else if (prevKeys.includes(e.key)) {
      e.preventDefault();
      scrollToIndex(activeIndex - 1);
    } else if (e.key === "Home") {
      e.preventDefault();
      scrollToIndex(0);
    } else if (e.key === "End") {
      e.preventDefault();
      scrollToIndex(count - 1);
    } else if (e.key === "Enter") {
      const work = filtered[activeIndex];
      if (!work) return;
      const href = workHref(work);
      if (isExternalWork(work)) window.open(href, "_blank", "noopener");
      else router.push(href);
    }
  }

  const activeWork = filtered[Math.min(activeIndex, filtered.length - 1)];
  const railPct =
    count <= 1 ? 100 : (Math.min(Math.max(activeIndex, 0), count - 1) / (count - 1)) * 100;

  if (reduced) {
    return (
      <section id="index" aria-label="Forward Index" className="relative py-10">
        <div className="mx-auto mb-6 flex max-w-7xl flex-col gap-4 px-5 md:px-8">
          <p className="font-meta text-primary">Forward Index</p>
          <FilterChips
            filters={filters}
            active={activeFilter}
            onChange={setFilter}
          />
        </div>
        <ReducedStrip works={filtered.length ? filtered : works} />
      </section>
    );
  }

  return (
    <section
      id="index"
      ref={sectionRef}
      aria-label="Forward Index"
      className="relative"
      style={{ height: sectionHeight }}
    >
      <div
        ref={stageRef}
        tabIndex={0}
        onKeyDown={onKeyDown}
        className="sticky top-0 h-[100svh] overflow-hidden outline-none"
        style={{
          perspective: "1200px",
          perspectiveOrigin: "38% 50%",
          opacity: stageOpacity,
          transition: "opacity 320ms var(--ease-forward)",
        }}
      >
        <div className="absolute inset-x-0 top-0 z-30 border-b border-border/60 bg-base/70 px-5 py-3 backdrop-blur-md md:px-8">
          <div className="mx-auto flex max-w-7xl flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <p className="font-meta text-primary">Forward Index</p>
            <div className="overflow-x-auto">
              <FilterChips
                filters={filters}
                active={activeFilter}
                onChange={setFilter}
              />
            </div>
          </div>
        </div>

        <div
          className="relative h-full w-full"
          style={{ transformStyle: "preserve-3d" }}
        >
          {filtered.map((work, index) => (
            <Plate
              key={work.slug}
              work={work}
              index={index}
              progress={progress}
              mobile={mobile}
              active={index === activeIndex}
              onActivate={() => scrollToIndex(index)}
            />
          ))}
        </div>

        <div className="pointer-events-none absolute top-1/2 left-[58%] hidden w-[min(34ch,38vw)] -translate-y-1/2 md:pointer-events-auto md:block">
          <AnimatePresence mode="wait">
            {activeWork ? <TitleBlock work={activeWork} /> : null}
          </AnimatePresence>
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-10 flex flex-col items-center gap-3 md:hidden">
          <AnimatePresence mode="wait">
            {activeWork ? (
              <div className="pointer-events-auto px-5 text-center">
                <TitleBlock work={activeWork} />
              </div>
            ) : null}
          </AnimatePresence>
          <p className="font-mono text-[0.75rem] text-secondary">
            {String(activeIndex + 1).padStart(2, "0")} /{" "}
            {String(count).padStart(2, "0")}
          </p>
        </div>

        <div className="pointer-events-none absolute top-20 right-6 hidden md:block">
          <p className="font-mono text-[0.75rem] text-secondary">
            {String(activeIndex + 1).padStart(2, "0")} /{" "}
            {String(count).padStart(2, "0")}
          </p>
        </div>

        <div
          aria-hidden
          className="absolute top-[20%] right-3 bottom-[20%] hidden w-0.5 overflow-hidden bg-border md:block"
        >
          <div
            className="w-full bg-secondary transition-[height] duration-(--duration-fast)"
            style={{ height: `${railPct}%` }}
          />
        </div>

        <div className="sr-only" aria-live="polite">
          {activeWork
            ? `${activeIndex + 1} of ${count}. ${activeWork.title}${
                activeWork.year ? `, ${activeWork.year}` : ""
              }, ${activeWork.categoryLabel}.`
            : null}
        </div>
      </div>

      {mobile
        ? Array.from({ length: count }).map((_, i) => (
            <div
              key={`snap-${i}`}
              className="pointer-events-none absolute left-0 w-px opacity-0"
              style={{
                top: `calc(${i * notch * 100}svh)`,
                height: "1px",
                scrollSnapAlign: "start",
              }}
            />
          ))
        : null}

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
