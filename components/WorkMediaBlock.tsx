import type { CSSProperties } from "react";
import Image from "next/image";
import LiteYouTube from "@/components/LiteYouTube";
import { readPublicImageSize } from "@/lib/image-size";
import type { WorkMediaItem } from "@/lib/types";

type MeasuredImage = {
  item: WorkMediaItem;
  width: number;
  height: number;
  kind: "portrait" | "square" | "landscape";
};

type WorkMediaBlockProps = {
  item: WorkMediaItem;
  title: string;
  poster?: string | null;
  priority?: boolean;
};

export function measureWorkMediaImage(item: WorkMediaItem): MeasuredImage | null {
  if (item.kind !== "image" || !item.src) return null;
  const size = readPublicImageSize(item.src) ?? {
    width: 1600,
    height: 1000,
  };
  const ratio = size.height / size.width;
  const kind =
    ratio > 1.12 ? "portrait" : ratio > 0.9 ? "square" : "landscape";
  return { item, width: size.width, height: size.height, kind };
}

export default function WorkMediaBlock({
  item,
  title,
  poster,
  priority,
}: WorkMediaBlockProps) {
  if (item.kind === "youtube" && item.url) {
    return (
      <div className="sheet-video">
        <div className="sheet-hero">
          <LiteYouTube
            url={item.url}
            title={item.label || title}
            poster={poster}
            kind="youtube"
          />
        </div>
        {item.label ? <p className="font-meta">{item.label}</p> : null}
      </div>
    );
  }

  if (item.kind === "soundcloud" && item.url) {
    return (
      <div className="sheet-player">
        {item.label ? <p className="font-meta">{item.label}</p> : null}
        <LiteYouTube url={item.url} title={item.label || title} kind="soundcloud" />
      </div>
    );
  }

  if (item.kind === "image" && item.src) {
    const measured = measureWorkMediaImage(item);
    if (!measured) return null;
    return (
      <div
        className={`sheet-frame sheet-frame--${measured.kind}`}
        style={
          {
            "--still-w": measured.width,
            "--still-h": measured.height,
          } as CSSProperties
        }
      >
        <Image
          src={item.src}
          alt={item.alt || title}
          width={measured.width}
          height={measured.height}
          priority={priority}
          sizes={
            measured.kind === "landscape"
              ? "(max-width: 768px) 100vw, 1400px"
              : "(max-width: 768px) 100vw, 520px"
          }
          className="sheet-frame-img"
          style={{
            width: "100%",
            height: "auto",
            objectPosition: item.focal || "50% 50%",
          }}
          unoptimized={item.src.startsWith("http")}
        />
      </div>
    );
  }

  return null;
}
