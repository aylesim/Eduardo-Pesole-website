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
    <div className="flex h-[100svh] flex-col bg-[#eeeeec] pt-40 text-[#151417]">
      <div
        ref={scrollerRef}
        className="flex flex-1 snap-x snap-mandatory items-center gap-8 overflow-x-auto scroll-smooth px-[clamp(16px,6vw,72px)] py-16"
        style={{ scrollbarWidth: "thin" }}
      >
        {works.map((work) => {
          const inner = (
            <article className="w-[min(78vw,420px)] shrink-0 snap-center">
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
                <p className="font-mono text-[0.6875rem] tracking-[0.1em] text-[#151417]/70 uppercase">
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
              className="text-inherit no-underline"
            >
              {inner}
            </a>
          ) : (
            <Link
              key={work.slug}
              href={work.href}
              className="text-inherit no-underline"
            >
              {inner}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
