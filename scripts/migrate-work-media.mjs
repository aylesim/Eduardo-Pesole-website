import fs from "node:fs";
import path from "node:path";

const worksDir = path.join(process.cwd(), "content/works");

function normalizeMediaKind(value) {
  if (value === "youtube" || value === "image" || value === "soundcloud") {
    return value;
  }
  return null;
}

function normalizeMediaItem(raw) {
  const kind = normalizeMediaKind(raw.kind);
  if (!kind) return null;

  if (kind === "image") {
    const src = raw.src?.trim();
    if (!src) return null;
    return {
      kind,
      ...(raw.label?.trim() ? { label: raw.label.trim() } : {}),
      src,
      alt: raw.alt?.trim() || "",
      ...(raw.focal?.trim() ? { focal: raw.focal.trim() } : {}),
    };
  }

  const url = raw.url?.trim();
  if (!url) return null;
  return {
    kind,
    ...(raw.label?.trim() ? { label: raw.label.trim() } : {}),
    url,
  };
}

function resolveWorkMedia(raw) {
  if (raw.primaryMedia || (raw.media && raw.media.length > 0)) {
    const primary = raw.primaryMedia
      ? normalizeMediaItem(raw.primaryMedia)
      : null;
    const media = (raw.media ?? [])
      .map((item) => normalizeMediaItem(item))
      .filter(Boolean);
    return { primaryMedia: primary, media };
  }

  let primaryMedia = null;
  const media = [];

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

const legacyKeys = [
  "primaryVideo",
  "archiveVideos",
  "stills",
  "soundcloud",
  "posterScale",
  "posterQuality",
  "posterFallback",
  "posterPlaceholder",
];

for (const name of fs.readdirSync(worksDir)) {
  if (!name.endsWith(".json")) continue;
  const filePath = path.join(worksDir, name);
  const raw = JSON.parse(fs.readFileSync(filePath, "utf8"));
  const { primaryMedia, media } = resolveWorkMedia(raw);

  const next = { ...raw };
  for (const key of legacyKeys) delete next[key];
  if (primaryMedia) next.primaryMedia = primaryMedia;
  else delete next.primaryMedia;
  if (media.length > 0) next.media = media;
  else delete next.media;

  fs.writeFileSync(filePath, `${JSON.stringify(next, null, 2)}\n`, "utf8");
  console.log(name);
}
