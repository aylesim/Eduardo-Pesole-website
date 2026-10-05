"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useState, useSyncExternalStore } from "react";
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
    <div className="flex h-[100svh] items-center justify-center bg-[#eeeeee] text-[#151417]/50">
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

function usePreferFallback() {
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)", false);
  const narrow = useMediaQuery("(max-width: 900px)", true);
  const webgl = useSyncExternalStore(
    () => () => {},
    hasWebGL,
    () => false,
  );
  return reduced || narrow || !webgl;
}

export default function IndexGallery({ works, brandName }: Props) {
  const fallback = usePreferFallback();
  const [active, setActive] = useState(0);
  const work = works[active] ?? works[0];

  useEffect(() => {
    document.documentElement.classList.add("index-embraced");
    return () => document.documentElement.classList.remove("index-embraced");
  }, []);

  if (fallback) {
    return (
      <div className="index-gallery-root relative bg-[#eeeeee] text-[#151417]">
        <IndexGalleryFallback works={works} />
      </div>
    );
  }

  return (
    <div className="index-gallery-root relative h-[100svh] overflow-hidden bg-[#eeeeee] text-[#151417]">
      <IndexGalleryCanvas works={works} onActiveChange={setActive} />

      {work ? (
        <aside className="pointer-events-none absolute inset-y-0 right-0 z-10 flex w-[min(42vw,420px)] flex-col justify-center pr-[clamp(16px,4vw,56px)] pl-6">
          <p className="font-mono text-[0.6875rem] tracking-[0.14em] uppercase text-[#151417]/55">
            PR.{String(active + 1).padStart(2, "0")}/
            {String(works.length).padStart(2, "0")}
          </p>
          <h1 className="mt-3 font-display text-[clamp(2.5rem,6vw,5.5rem)] font-extrabold leading-[0.92] tracking-[-0.03em] text-[#151417]">
            {work.title}
          </h1>
          <p className="mt-4 font-mono text-[0.75rem] tracking-[0.1em] uppercase text-[#151417]/70">
            {[work.year, work.categoryLabel].filter(Boolean).join(" · ")}
          </p>
          <Link
            href={work.href}
            target={work.external ? "_blank" : undefined}
            rel={work.external ? "noopener noreferrer" : undefined}
            className="pointer-events-auto mt-8 w-fit font-mono text-[0.75rem] tracking-[0.12em] uppercase text-[#151417] underline-offset-4 hover:underline"
          >
            Open project{work.external ? " ↗" : " →"}
          </Link>
        </aside>
      ) : null}

      <p className="pointer-events-none absolute bottom-6 left-[clamp(16px,4vw,48px)] font-mono text-[0.625rem] tracking-[0.14em] uppercase text-[#151417]/45">
        {brandName} · scroll
      </p>
    </div>
  );
}
