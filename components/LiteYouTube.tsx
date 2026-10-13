"use client";

import Image from "next/image";
import { useState } from "react";
import { getEmbedSrc, youtubePosterUrl } from "@/lib/embeds";

type LiteYouTubeProps = {
  url: string;
  title?: string;
  poster?: string | null;
  kind?: string;
  autoPlay?: boolean;
  onPlayIntent?: () => void;
  caption?: string;
};

export default function LiteYouTube({
  url,
  title = "Video",
  poster,
  kind,
  autoPlay = false,
  onPlayIntent,
  caption,
}: LiteYouTubeProps) {
  const [playing, setPlaying] = useState(autoPlay);
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
        className="w-full"
      />
    );
  }

  if (embed.type !== "youtube") {
    return (
      <a href={url} target="_blank" rel="noopener noreferrer" className="text-accent">
        {title || url}
      </a>
    );
  }

  const posterSrc = poster || youtubePosterUrl(url) || "";

  if (!playing) {
    return (
      <button
        type="button"
        className="lite-yt group relative block aspect-video w-full cursor-pointer overflow-hidden bg-elevated text-left"
        onClick={() => {
          if (onPlayIntent) onPlayIntent();
          else setPlaying(true);
        }}
        aria-label={`Play ${title}`}
      >
        {posterSrc ? (
          <Image
            src={posterSrc}
            alt=""
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 70vw"
            unoptimized={posterSrc.startsWith("http")}
            priority
          />
        ) : null}
        <span className="absolute inset-0 bg-text/10 transition-colors group-hover:bg-transparent" />
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="lite-yt-play pointer-events-none">
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d="M8 5v14l11-7z" fill="currentColor" />
            </svg>
          </span>
        </span>
        {caption ? (
          <span className="lite-yt-caption pointer-events-none">{caption}</span>
        ) : null}
      </button>
    );
  }

  return (
    <div className="relative aspect-video w-full overflow-hidden bg-elevated">
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
