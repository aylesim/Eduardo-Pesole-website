"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useLayoutEffect, useState, useSyncExternalStore } from "react";
import HomeNote from "@/components/index-gallery/HomeNote";
import IndexGalleryFallback from "@/components/index-gallery/IndexGalleryFallback";
import type { GalleryWork } from "@/lib/gallery-works";

const IndexGalleryCanvas = dynamic(
  () => import("@/components/index-gallery/IndexGalleryCanvas"),
  { ssr: false, loading: () => <GallerySkeleton /> },
);

type Props = {
  works: GalleryWork[];
};

function GallerySkeleton() {
  return <div className="h-[100svh] bg-[#eeeeec]" />;
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
  const webgl = useSyncExternalStore(
    () => () => {},
    hasWebGL,
    () => false,
  );
  return !webgl;
}

export default function IndexGallery({ works }: Props) {
  const client = useIsClient();
  const fallback = usePreferFallback();
  const compact = useMediaQuery("(max-width: 767px)", false);
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
      <div className="absolute inset-0 overflow-hidden">
        <IndexGalleryCanvas
          works={works}
          compact={compact}
          onActiveChange={setActive}
        />
      </div>

      <HomeNote className="pointer-events-none absolute top-[4.6rem] left-[clamp(18px,4vw,48px)] z-30" />

      {work ? (
        <aside
          className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex h-[58%] flex-col justify-end px-[clamp(18px,5vw,32px)] pb-7 md:inset-y-0 md:right-0 md:left-auto md:h-auto md:w-[48%] md:justify-center md:pr-[clamp(30px,5vw,72px)] md:pl-[14%]"
          style={{
            background: compact
              ? "linear-gradient(to top, #eeeeec 0%, rgba(238,238,236,.96) 42%, rgba(238,238,236,0) 100%)"
              : "linear-gradient(to left, #eeeeec 0%, rgba(238,238,236,.96) 58%, rgba(238,238,236,0) 100%)",
          }}
          aria-live="polite"
        >
          <div key={work.slug} className="flex flex-col items-start">
            <p className="font-mono text-[0.625rem] tracking-[0.13em] text-[#151417]/60 uppercase">
              {[work.year, work.categoryLabel].filter(Boolean).join(" · ")}
            </p>

            <h1
              className={`font-display mt-3 max-w-[13ch] leading-[0.88] font-extrabold tracking-[-0.05em] text-balance break-words ${
                work.title.length > 24
                  ? "text-[clamp(1.9rem,9vw,2.75rem)] md:text-[clamp(2.4rem,4vw,4rem)]"
                  : "text-[clamp(2.25rem,11vw,3.5rem)] md:text-[clamp(2.75rem,4.8vw,5rem)]"
              }`}
            >
              <Link
                href={work.href}
                target={work.external ? "_blank" : undefined}
                rel={work.external ? "noopener noreferrer" : undefined}
                className="pointer-events-auto text-[#151417] no-underline"
              >
                {work.title}
              </Link>
            </h1>
          </div>
        </aside>
      ) : null}
    </div>
  );
}
