"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useLayoutEffect, useState, useSyncExternalStore } from "react";
import IndexGalleryFallback from "@/components/index-gallery/IndexGalleryFallback";
import type { GalleryWork } from "@/lib/gallery-works";

const IndexGalleryCanvas = dynamic(
  () => import("@/components/index-gallery/IndexGalleryCanvas"),
  { ssr: false, loading: () => <GallerySkeleton /> },
);

type Props = {
  works: GalleryWork[];
  brandName: string;
};

function GallerySkeleton() {
  return (
    <div className="flex h-[100svh] items-center justify-center bg-[#eeeeec] text-[#151417]/50">
      <p className="font-mono text-[0.75rem] tracking-[0.12em] uppercase">
        Loading gallery…
      </p>
    </div>
  );
}

function subscribeMedia(query: string, onChange: () => void) {
  const mql = window.matchMedia(query);
  mql.addEventListener("change", onChange);
  return () => mql.removeEventListener("change", onChange);
}

function useMediaQuery(query: string, serverValue = false) {
  return useSyncExternalStore(
    (onChange) => subscribeMedia(query, onChange),
    () => window.matchMedia(query).matches,
    () => serverValue,
  );
}

function hasWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

function useIsClient() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

function usePreferFallback() {
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)", false);
  const webgl = useSyncExternalStore(
    () => () => {},
    hasWebGL,
    () => false,
  );
  return reduced || !webgl;
}

export default function IndexGallery({ works, brandName }: Props) {
  const client = useIsClient();
  const fallback = usePreferFallback();
  const compact = useMediaQuery("(max-width: 760px)", false);
  const [active, setActive] = useState(0);
  const work = works[active] ?? works[0];

  useLayoutEffect(() => {
    document.documentElement.classList.add("index-embraced");
    return () => document.documentElement.classList.remove("index-embraced");
  }, []);

  if (!client) {
    return (
      <div className="index-gallery-root relative bg-[#eeeeec] text-[#151417]">
        <GallerySkeleton />
      </div>
    );
  }

  if (fallback) {
    return (
      <div className="index-gallery-root relative bg-[#eeeeec] text-[#151417]">
        <IndexGalleryFallback works={works} />
      </div>
    );
  }

  return (
    <div className="index-gallery-root relative h-[100svh] overflow-hidden bg-[#eeeeec] text-[#151417]">
      <div className="absolute inset-x-0 top-0 h-[58svh] overflow-hidden md:inset-y-0 md:right-[38%] md:h-auto">
        <IndexGalleryCanvas
          works={works}
          compact={compact}
          onActiveChange={setActive}
        />
      </div>

      {work ? (
        <aside
          className="pointer-events-none absolute inset-x-0 top-[58svh] bottom-0 z-20 flex flex-col border-t border-[#c9c8c4] bg-[#eeeeec] px-[clamp(18px,4vw,56px)] pt-5 pb-5 md:inset-y-0 md:right-0 md:left-auto md:w-[38%] md:border-t-0 md:border-l md:pt-[clamp(110px,16vh,180px)] md:pb-[clamp(32px,6vh,72px)]"
          aria-live="polite"
        >
          <div className="flex items-baseline justify-between gap-4 border-b border-[#c9c8c4] pb-3 font-mono text-[0.625rem] tracking-[0.13em] uppercase">
            <p className="text-[#151417]/55">
              PR.{String(active + 1).padStart(2, "0")}/
              {String(works.length).padStart(2, "0")}
            </p>
            <p className="truncate text-right text-[#151417]/65">
              {[work.year, work.categoryLabel].filter(Boolean).join(" · ")}
            </p>
          </div>

          <div
            key={work.slug}
            className="flex min-h-0 flex-1 flex-col justify-center py-4 md:py-8"
          >
            <h1 className="font-display max-w-[13ch] text-[clamp(2rem,8vw,3.25rem)] leading-[0.88] font-extrabold tracking-[-0.045em] text-balance break-words text-[#151417] md:text-[clamp(2.5rem,4.5vw,4.75rem)]">
              {work.title}
            </h1>
          </div>

          <div className="flex items-end justify-between gap-6 border-t border-[#c9c8c4] pt-3">
            <p className="hidden max-w-[18ch] font-mono text-[0.625rem] leading-relaxed tracking-[0.1em] text-[#151417]/50 uppercase sm:block">
              Scroll or drag to rotate
            </p>
            <Link
              href={work.href}
              target={work.external ? "_blank" : undefined}
              rel={work.external ? "noopener noreferrer" : undefined}
              className="pointer-events-auto ml-auto font-mono text-[0.6875rem] font-medium tracking-[0.12em] text-[#151417] uppercase underline decoration-1 underline-offset-4"
            >
              View project{work.external ? " ↗" : " →"}
            </Link>
          </div>
        </aside>
      ) : null}

      <p className="pointer-events-none absolute top-[78px] left-[clamp(16px,4vw,48px)] z-10 font-mono text-[0.625rem] tracking-[0.14em] text-[#151417]/45 uppercase md:top-auto md:bottom-6">
        {brandName} · circular index
      </p>
    </div>
  );
}
