"use client";

import Image from "next/image";
import { useState } from "react";
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

  const [featured, setFeatured] = useState(0);
  const [held, setHeld] = useState<number | null>(null);

  if (items.length === 0) return null;

  const activeIndex = held ?? featured;
  const current = items[activeIndex]!;
  const canSwap = items.length >= 2;

  return (
    <div className="space-y-3">
      <div className="relative aspect-video w-full overflow-hidden bg-elevated">
        <Image
          key={current.src}
          src={current.src}
          alt={current.alt || title}
          fill
          className="object-cover"
          style={{ objectPosition: current.focal || "50% 50%" }}
          sizes="(max-width: 768px) 100vw, 720px"
          unoptimized={current.src.startsWith("http")}
        />
      </div>
      {canSwap ? (
        <ul className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {items.slice(0, 4).map((still, i) => (
            <li key={still.src}>
              <button
                type="button"
                className={`relative aspect-[16/10] w-full cursor-pointer overflow-hidden bg-elevated ${
                  activeIndex === i
                    ? "opacity-100"
                    : "opacity-45 hover:opacity-100"
                }`}
                onMouseEnter={() => setHeld(i)}
                onMouseLeave={() => setHeld(null)}
                onFocus={() => setHeld(i)}
                onBlur={() => setHeld(null)}
                onClick={() => setFeatured(i)}
                aria-label={`Show still ${i + 1}`}
              >
                <Image
                  src={still.src}
                  alt=""
                  fill
                  className="object-cover"
                  style={{ objectPosition: still.focal || "50% 50%" }}
                  sizes="180px"
                  unoptimized={still.src.startsWith("http")}
                />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
