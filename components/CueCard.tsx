"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { useClientReducedMotion } from "@/lib/use-client-reduced-motion";
import { isExternalWork, plateSrc, workHref } from "@/lib/content";
import type { WorkItem } from "@/lib/types";

type CueCardProps = {
  work: WorkItem;
  spanClass?: string;
  aspect?: "video" | "portrait";
  priority?: boolean;
};

export default function CueCard({
  work,
  spanClass = "col-span-12 md:col-span-6",
  aspect = "video",
  priority,
}: CueCardProps) {
  const href = workHref(work);
  const external = isExternalWork(work);
  const src = plateSrc(work);
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const reduced = useClientReducedMotion();

  const body = (
    <article
      ref={ref}
      className="group relative"
    >
      <motion.div
        className={`relative overflow-hidden bg-elevated ${
          aspect === "portrait" ? "aspect-[4/5]" : "aspect-video"
        }`}
        initial={reduced ? false : { clipPath: "inset(0 0 100% 0)" }}
        animate={
          reduced || inView
            ? { clipPath: "inset(0 0 0% 0)" }
            : { clipPath: "inset(0 0 100% 0)" }
        }
        transition={{ duration: 0.42, ease: [0.77, 0, 0.175, 1] }}
      >
        {src ? (
          <Image
            src={src}
            alt=""
            fill
            priority={priority}
            className="object-cover transition-transform duration-700 ease-(--ease-ui) group-hover:scale-[1.015]"
            style={{ objectPosition: work.focal || "50% 50%" }}
            sizes="(max-width: 768px) 100vw, 60vw"
            unoptimized={src.startsWith("http")}
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-elevated p-6 text-center">
            <span className="font-meta">{work.title}</span>
          </div>
        )}
      </motion.div>
      <div className="grid grid-cols-12 gap-3 border-b border-border py-4">
        <p className="font-meta col-span-4">
          {[work.year, work.categoryLabel].filter(Boolean).join(" · ")}
        </p>
        <div className="col-span-8">
          <h3 className="font-display text-[clamp(1.35rem,2.2vw,2.6rem)] font-bold leading-[0.95] tracking-[-0.04em] text-text">
            {work.title}
            {external ? " ↗" : ""}
          </h3>
          {work.role ? (
            <p className="font-meta-value mt-2 text-muted">{work.role}</p>
          ) : null}
        </div>
      </div>
    </article>
  );

  return (
    <li className={spanClass}>
      {external ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="block no-underline"
        >
          {body}
        </a>
      ) : (
        <Link href={href} className="block no-underline">
          {body}
        </Link>
      )}
    </li>
  );
}
