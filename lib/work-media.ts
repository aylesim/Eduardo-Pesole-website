import { youtubePosterUrl } from "@/lib/embeds";
import type { WorkItem, WorkMediaItem, WorkMediaKind } from "@/lib/types";

export function normalizeMediaKind(value: string | undefined): WorkMediaKind | null {
  if (value === "youtube" || value === "image" || value === "soundcloud") {
    return value;
  }
  return null;
}

export function normalizeMediaItem(raw: Partial<WorkMediaItem>): WorkMediaItem | null {
  const kind = normalizeMediaKind(raw.kind);
  if (!kind) return null;

  if (kind === "image") {
    const src = raw.src?.trim();
    if (!src) return null;
    return {
      kind,
      label: raw.label?.trim() || undefined,
      src,
      alt: raw.alt?.trim() || "",
      focal: raw.focal?.trim() || undefined,
    };
  }

  const url = raw.url?.trim();
  if (!url) return null;
  return {
    kind,
    label: raw.label?.trim() || undefined,
    url,
  };
}

type LegacyWorkFile = {
  primaryMedia?: WorkMediaItem | null;
  media?: WorkMediaItem[];
  primaryVideo?: { label?: string; url: string } | null;
  archiveVideos?: { label?: string; url: string }[];
  stills?: { src: string; alt: string; focal?: string }[];
  soundcloud?: string | null;
};

export function resolveWorkMedia(raw: LegacyWorkFile): {
  primaryMedia: WorkMediaItem | null;
  media: WorkMediaItem[];
} {
  if (raw.primaryMedia || (raw.media && raw.media.length > 0)) {
    const primary = raw.primaryMedia
      ? normalizeMediaItem(raw.primaryMedia)
      : null;
    const media = (raw.media ?? [])
      .map((item) => normalizeMediaItem(item))
      .filter((item): item is WorkMediaItem => Boolean(item));
    return { primaryMedia: primary, media };
  }

  let primaryMedia: WorkMediaItem | null = null;
  const media: WorkMediaItem[] = [];

  if (raw.primaryVideo?.url?.trim()) {
    primaryMedia = normalizeMediaItem({
      kind: "youtube",
      label: raw.primaryVideo.label,
      url: raw.primaryVideo.url,
    });
  }

  for (const video of raw.archiveVideos ?? []) {
    const item = normalizeMediaItem({
      kind: "youtube",
      label: video.label,
      url: video.url,
    });
    if (item) media.push(item);
  }

  const stills = raw.stills ?? [];
  if (!primaryMedia && stills[0]) {
    primaryMedia = normalizeMediaItem({
      kind: "image",
      src: stills[0].src,
      alt: stills[0].alt,
      focal: stills[0].focal,
    });
    for (const still of stills.slice(1)) {
      const item = normalizeMediaItem({
        kind: "image",
        src: still.src,
        alt: still.alt,
        focal: still.focal,
      });
      if (item) media.push(item);
    }
  } else {
    for (const still of stills) {
      const item = normalizeMediaItem({
        kind: "image",
        src: still.src,
        alt: still.alt,
        focal: still.focal,
      });
      if (item) media.push(item);
    }
  }

  if (raw.soundcloud?.trim()) {
    const sc = normalizeMediaItem({
      kind: "soundcloud",
      url: raw.soundcloud,
    });
    if (sc) {
      if (!primaryMedia) primaryMedia = sc;
      else media.push(sc);
    }
  }

  return { primaryMedia, media };
}

export function mediaItemKey(item: WorkMediaItem, index: number): string {
  if (item.kind === "image") return `image:${item.src}:${index}`;
  return `${item.kind}:${item.url}:${index}`;
}

export function plateSrc(work: WorkItem): string | null {
  if (work.poster) return work.poster;

  const primary = work.primaryMedia;
  if (primary?.kind === "image" && primary.src) return primary.src;
  if (primary?.kind === "youtube" && primary.url) {
    return youtubePosterUrl(primary.url) ?? null;
  }

  for (const item of work.media) {
    if (item.kind === "image" && item.src) return item.src;
    if (item.kind === "youtube" && item.url) {
      const thumb = youtubePosterUrl(item.url);
      if (thumb) return thumb;
    }
  }

  return null;
}

export function workCardFocal(work: WorkItem): string {
  if (work.focal) return work.focal;
  if (work.primaryMedia?.kind === "image" && work.primaryMedia.focal) {
    return work.primaryMedia.focal;
  }
  return "50% 50%";
}
