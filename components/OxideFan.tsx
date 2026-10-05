"use client";

import { Canvas } from "@react-three/fiber";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useReducedMotion } from "motion/react";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import FanScene from "@/components/fan/FanScene";
import FilterChips from "@/components/FilterChips";
import ReducedMotionIndex from "@/components/ReducedMotionIndex";
import SiteDock from "@/components/SiteDock";
import {
  getCategoryFilters,
  getSite,
  getWorksByCategory,
  isExternalWork,
  workHref,
} from "@/lib/content";
import { FAN, clampScroll } from "@/lib/fan";
import { fanScroll, resetFanScroll } from "@/lib/fan-scroll";
import type { WorkCategory, WorkItem } from "@/lib/types";

function detectWebGL() {
  if (typeof document === "undefined") return true;
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      canvas.getContext("webgl2") ||
        canvas.getContext("webgl") ||
        canvas.getContext("experimental-webgl"),
    );
  } catch {
    return false;
  }
}

type OxideFanProps = {
  works: WorkItem[];
};

export default function OxideFan({ works }: OxideFanProps) {
  const site = getSite();
  const filters = getCategoryFilters();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const reduced = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const [mobile, setMobile] = useState(false);
  const [webglOk, setWebglOk] = useState(detectWebGL);
  const [activeIndex, setActiveIndex] = useState(0);
  const [ready, setReady] = useState(false);
  const [filterEpoch, setFilterEpoch] = useState(0);

  const filterParam = searchParams.get("filter");
  const activeFilter: "all" | WorkCategory =
    filterParam === "games" ||
    filterParam === "art-collabs" ||
    filterParam === "movies" ||
    filterParam === "music"
      ? filterParam
      : "all";

  const items = useMemo(
    () => (activeFilter === "all" ? works : getWorksByCategory(activeFilter)),
    [works, activeFilter],
  );

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const prevHtml = document.documentElement.style.overflow;
    const prevBody = document.body.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = prevHtml;
      document.body.style.overflow = prevBody;
    };
  }, []);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const onWheelNative = (e: WheelEvent) => {
      e.preventDefault();
      const max = Math.max(items.length - 1, 0);
      fanScroll.target = clampScroll(
        fanScroll.target + e.deltaY * FAN.wheelScale,
        max,
      );
    };

    let lastY: number | null = null;

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      lastY = e.touches[0]!.clientY;
      fanScroll.grabbing = true;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (lastY == null || e.touches.length !== 1) return;
      e.preventDefault();
      const y = e.touches[0]!.clientY;
      const dy = lastY - y;
      lastY = y;
      const max = Math.max(items.length - 1, 0);
      fanScroll.target = clampScroll(
        fanScroll.target + dy * FAN.touchScale,
        max,
      );
    };
    const onTouchEnd = () => {
      lastY = null;
      fanScroll.grabbing = false;
    };

    el.addEventListener("wheel", onWheelNative, { passive: false });
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    el.addEventListener("touchend", onTouchEnd);
    el.addEventListener("touchcancel", onTouchEnd);

    return () => {
      el.removeEventListener("wheel", onWheelNative);
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onTouchEnd);
      el.removeEventListener("touchcancel", onTouchEnd);
    };
  }, [items.length]);

  const openWork = useCallback(
    (work: WorkItem) => {
      const href = workHref(work);
      if (isExternalWork(work)) window.open(href, "_blank", "noopener");
      else router.push(href);
    },
    [router],
  );

  const onPlaneClick = useCallback(
    (index: number) => {
      const current = Math.round(fanScroll.current);
      if (index === current) {
        const work = items[index];
        if (work) openWork(work);
        return;
      }
      fanScroll.target = index;
    },
    [items, openWork],
  );

  const onActiveChange = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  function setFilter(id: "all" | WorkCategory) {
    resetFanScroll();
    setActiveIndex(0);
    setFilterEpoch((n) => n + 1);
    const params = new URLSearchParams(searchParams.toString());
    if (id === "all") params.delete("filter");
    else params.set("filter", id);
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  function onKeyDown(e: ReactKeyboardEvent<HTMLDivElement>) {
    const max = Math.max(items.length - 1, 0);
    if (["ArrowDown", "ArrowRight", "j", "J"].includes(e.key)) {
      e.preventDefault();
      fanScroll.target = clampScroll(Math.round(fanScroll.target) + 1, max);
    } else if (["ArrowUp", "ArrowLeft", "k", "K"].includes(e.key)) {
      e.preventDefault();
      fanScroll.target = clampScroll(Math.round(fanScroll.target) - 1, max);
    } else if (e.key === "PageDown") {
      e.preventDefault();
      fanScroll.target = clampScroll(Math.round(fanScroll.target) + 3, max);
    } else if (e.key === "PageUp") {
      e.preventDefault();
      fanScroll.target = clampScroll(Math.round(fanScroll.target) - 3, max);
    } else if (e.key === "Home") {
      e.preventDefault();
      fanScroll.target = 0;
    } else if (e.key === "End") {
      e.preventDefault();
      fanScroll.target = max;
    } else if (e.key === "Enter") {
      e.preventDefault();
      const work = items[activeIndex];
      if (work) openWork(work);
    }
  }

  const activeWork = items[Math.min(activeIndex, Math.max(items.length - 1, 0))];
  const useFallback = Boolean(reduced) || !webglOk;
  const mailHref = `mailto:${site.contact.email}`;
  const count = Math.max(items.length, 1);

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-0 overflow-hidden bg-base outline-none"
      tabIndex={0}
      onKeyDown={onKeyDown}
      aria-label="Oxide Fan project index"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 page-gutter flex items-start justify-between gap-4 pt-4">
        <Link
          href="/"
          className="pointer-events-auto font-display text-[clamp(0.9375rem,1.2vw,1.125rem)] font-bold tracking-[-0.02em] no-underline hover:text-text"
        >
          {site.global.brand_name}
        </Link>
        <div className="pointer-events-auto hidden max-w-[min(100%,42rem)] flex-1 justify-center md:flex">
          <FilterChips
            filters={filters}
            active={activeFilter}
            onChange={setFilter}
          />
        </div>
        <p className="pointer-events-none font-meta shrink-0 text-rail">
          {String(Math.min(activeIndex + 1, count)).padStart(2, "0")} /{" "}
          {String(count).padStart(2, "0")}
        </p>
      </div>

      <div className="pointer-events-auto absolute inset-x-0 top-14 z-20 page-gutter md:hidden">
        <FilterChips
          filters={filters}
          active={activeFilter}
          onChange={setFilter}
        />
      </div>

      {useFallback ? (
        <div className="absolute inset-0 z-10 pt-2">
          <ReducedMotionIndex
            key={`${activeFilter}-${filterEpoch}`}
            works={items}
          />
        </div>
      ) : (
        <div className="absolute inset-0 z-0 cursor-grab touch-none">
          {!ready ? (
            <p className="pointer-events-none absolute right-6 bottom-28 z-10 font-meta">
              Loading
            </p>
          ) : null}
          {items.length === 0 ? (
            <p className="absolute inset-0 z-10 flex items-center justify-center type-body text-muted">
              No projects in this filter.
            </p>
          ) : (
            <Canvas
              key={`${activeFilter}-${filterEpoch}`}
              className="h-full w-full"
              camera={{ position: [0, 0, 8], fov: 34, near: 0.1, far: 80 }}
              dpr={mobile ? [1, 1.5] : [1, 1.75]}
              gl={{
                antialias: true,
                powerPreference: "high-performance",
                alpha: false,
              }}
              frameloop="always"
              onCreated={({ gl }) => {
                setReady(true);
                gl.domElement.addEventListener(
                  "webglcontextlost",
                  (ev) => {
                    ev.preventDefault();
                    setWebglOk(false);
                  },
                  false,
                );
              }}
            >
              <FanScene
                items={items}
                mobile={mobile}
                onActiveChange={onActiveChange}
                onPlaneClick={onPlaneClick}
              />
            </Canvas>
          )}
        </div>
      )}

      {!useFallback && activeWork && items.length > 0 ? (
        <div
          className="pointer-events-none absolute right-[clamp(16px,4vw,48px)] bottom-24 z-20 max-w-[28ch] text-right md:bottom-28"
          aria-live="polite"
        >
          <p className="font-body text-[clamp(0.9375rem,1.4vw,1.125rem)] font-semibold leading-[1.15] tracking-[-0.01em] text-text">
            {activeWork.title}
          </p>
          <p className="mt-1 font-body text-[0.75rem] text-muted">
            {[activeWork.year, activeWork.categoryLabel]
              .filter(Boolean)
              .join(" · ")}
          </p>
          <button
            type="button"
            className="pointer-events-auto btn-text mt-2 text-accent"
            onClick={() => openWork(activeWork)}
          >
            {isExternalWork(activeWork) ? "Listen ↗" : "Open →"}
          </button>
        </div>
      ) : null}

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 page-gutter flex items-end justify-between gap-4 pb-4">
        <div className="pointer-events-auto">
          <SiteDock className="origin-bottom-left max-md:scale-90" />
        </div>
        <a
          href={mailHref}
          className="pointer-events-auto btn-text hidden text-muted md:inline-flex"
        >
          Mail
        </a>
      </div>

      <ul className="sr-only">
        {items.map((work, index) => (
          <li key={`proxy-${work.slug}`}>
            <button
              type="button"
              onFocus={() => {
                fanScroll.target = index;
              }}
              onClick={() => onPlaneClick(index)}
            >
              {work.title}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
