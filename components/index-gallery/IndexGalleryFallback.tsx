"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import type { GalleryWork } from "@/lib/gallery-works";

type Props = {
  works: GalleryWork[];
};

export default function IndexGalleryFallback({ works }: Props) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  return (
    <div className="flex h-[100svh] flex-col bg-[#eeeeec] text-[#151417]">
      <div
        ref={scrollerRef}
        className="flex flex-1 items-center gap-8 overflow-x-auto px-[clamp(16px,6vw,72px)] py-16 scroll-smooth snap-x snap-mandatory"
        style={{ scrollbarWidth: "thin" }}
      >
        {works.map((work) => {
          const inner = (
            <article className="snap-center shrink-0 w-[min(78vw,420px)]">
              <div className="relative aspect-video overflow-hidden bg-[#ddd]">
                <Image
                  src={work.poster}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="380px"
                  unoptimized={work.poster.startsWith("http")}
                />
              </div>
              <div className="mt-4 space-y-1">
                <p className="font-mono text-[0.6875rem] tracking-[0.1em] uppercase text-[#151417]/70">
                  {[work.year, work.categoryLabel].filter(Boolean).join(" · ")}
                </p>
                <h2 className="font-display text-xl font-bold tracking-[-0.02em]">
                  {work.title}
                  {work.external ? " ↗" : ""}
                </h2>
              </div>
            </article>
          );

          return work.external ? (
            <a
              key={work.slug}
              href={work.href}
              target="_blank"
              rel="noopener noreferrer"
              className="no-underline text-inherit"
            >
              {inner}
            </a>
          ) : (
            <Link
              key={work.slug}
              href={work.href}
              className="no-underline text-inherit"
            >
              {inner}
            </Link>
          );
        })}
      </div>
      <p className="pb-6 text-center font-mono text-[0.6875rem] tracking-[0.12em] uppercase text-[#151417]/55">
        Scroll sideways · {String(works.length).padStart(2, "0")} works
      </p>
    </div>
  );
}
