"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useInView, useReducedMotion } from "motion/react";
import { useRef } from "react";
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
  const reduced = useReducedMotion();

  const body = (
    <article
      ref={ref}
      className="group relative border border-transparent transition-[border-color,transform] duration-(--duration-ui) ease-(--ease-ui) hover:border-accent"
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
            className="object-cover"
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
      <div className="space-y-1 pt-3 transition-transform duration-(--duration-ui) ease-(--ease-ui) group-hover:translate-x-1">
        <p className="font-meta">
          {[work.year, work.categoryLabel].filter(Boolean).join(" · ")}
        </p>
        <h3 className="type-h2 text-text">
          {work.title}
          {external ? " ↗" : ""}
        </h3>
        {work.role ? (
          <p className="font-meta-value text-muted">{work.role}</p>
        ) : null}
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
