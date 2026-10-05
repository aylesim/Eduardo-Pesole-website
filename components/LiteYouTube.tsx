"use client";

import Image from "next/image";
import { useState } from "react";
import { getEmbedSrc, youtubePosterUrl } from "@/lib/embeds";

type LiteYouTubeProps = {
  url: string;
  title?: string;
  poster?: string | null;
  kind?: string;
};

export default function LiteYouTube({
  url,
  title = "Video",
  poster,
  kind,
}: LiteYouTubeProps) {
  const [playing, setPlaying] = useState(false);
  const embed = getEmbedSrc(kind, url);

  if (embed.type === "soundcloud") {
    return (
      <iframe
        title={title}
        width="100%"
        height="166"
        scrolling="no"
        frameBorder="no"
        allow="autoplay"
        src={embed.src}
        className="w-full rounded-sm"
      />
    );
  }

  if (embed.type !== "youtube") {
    return (
      <a href={url} target="_blank" rel="noopener noreferrer" className="text-primary">
        {title || url}
      </a>
    );
  }

  const posterSrc = poster || youtubePosterUrl(url) || "";

  if (!playing) {
    return (
      <button
        type="button"
        className="group relative block aspect-video w-full cursor-pointer overflow-hidden rounded-sm bg-surface-elevated"
        onClick={() => setPlaying(true)}
        aria-label={`Play ${title}`}
      >
        {posterSrc ? (
          <Image
            src={posterSrc}
            alt=""
            fill
            className="object-cover transition-transform duration-(--duration-base) group-hover:scale-[1.03]"
            sizes="(max-width: 768px) 100vw, 800px"
            unoptimized={posterSrc.startsWith("http")}
          />
        ) : null}
        <span className="absolute inset-0 bg-base/35" />
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-base transition-transform duration-(--duration-fast) group-hover:scale-105">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </span>
      </button>
    );
  }

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-sm bg-surface-elevated">
      <iframe
        title={title}
        src={`${embed.src}?autoplay=1&rel=0`}
        className="absolute inset-0 h-full w-full border-0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    </div>
  );
}
