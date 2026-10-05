"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import type { WorkStill } from "@/lib/types";

type MediaSwitchProps = {
  stills: WorkStill[];
  fallbackPoster?: string | null;
  title: string;
};

export default function MediaSwitch({
  stills,
  fallbackPoster,
  title,
}: MediaSwitchProps) {
  const items =
    stills.length > 0
      ? stills
      : fallbackPoster
        ? [{ src: fallbackPoster, alt: title }]
        : [];

  const [index, setIndex] = useState(0);

  const prev = useCallback(() => {
    setIndex((i) => (i - 1 + items.length) % items.length);
  }, [items.length]);

  const next = useCallback(() => {
    setIndex((i) => (i + 1) % items.length);
  }, [items.length]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [prev, next]);

  if (items.length === 0) return null;

  const current = items[index]!;

  return (
    <div className="space-y-3">
      <button
        type="button"
        className="focus-ring relative block aspect-video w-full cursor-pointer overflow-hidden rounded-sm bg-surface"
        onClick={next}
        aria-label={
          items.length > 1
            ? `View next still (${index + 1} of ${items.length})`
            : title
        }
      >
        <Image
          key={current.src}
          src={current.src}
          alt={current.alt || title}
          fill
          className="object-cover"
          style={{ objectPosition: current.focal || "50% 50%" }}
          sizes="(max-width: 768px) 100vw, 900px"
          unoptimized={current.src.startsWith("http")}
        />
      </button>
      {items.length > 1 ? (
        <div className="flex items-center justify-between gap-3">
          <p className="font-meta">
            {index + 1} / {items.length}
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              className="focus-ring cursor-pointer border border-line px-3 py-1 font-meta text-muted hover:text-ink"
              onClick={prev}
              aria-label="Previous still"
            >
              Prev
            </button>
            <button
              type="button"
              className="focus-ring cursor-pointer border border-line px-3 py-1 font-meta text-muted hover:text-ink"
              onClick={next}
              aria-label="Next still"
            >
              Next
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
