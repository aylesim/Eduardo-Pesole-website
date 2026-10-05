export type EmbedResult =
  | { type: "youtube"; src: string; id: string }
  | { type: "soundcloud"; src: string }
  | { type: "spotify"; src: string }
  | { type: "link"; src: null; href: string };

export function youtubeId(url: string): string | null {
  if (!url) return null;
  try {
    const u = new URL(url);
    let id: string | null = null;
    if (u.hostname.includes("youtu.be")) {
      id = u.pathname.replace("/", "").split("/")[0] ?? null;
    } else if (u.hostname.includes("youtube.com")) {
      id = u.searchParams.get("v");
      if (!id && u.pathname.startsWith("/embed/")) {
        id = u.pathname.split("/")[2] ?? null;
      }
    }
    return id;
  } catch {
    return null;
  }
}

export function youtubePosterUrl(
  url: string,
  quality: "maxresdefault" | "sddefault" | "hqdefault" = "maxresdefault",
): string | null {
  const id = youtubeId(url);
  return id ? `https://i.ytimg.com/vi/${id}/${quality}.jpg` : null;
}

export function youtubeEmbedUrl(url: string): string | null {
  const id = youtubeId(url);
  if (!id) return null;
  return `https://www.youtube.com/embed/${id}`;
}

export function soundcloudEmbedUrl(url: string): string | null {
  if (!url) return null;
  const encoded = encodeURIComponent(url.split("?")[0] ?? url);
  return `https://w.soundcloud.com/player/?url=${encoded}&color=%23000000&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false`;
}

export function getEmbedSrc(
  kind: string | undefined,
  url: string,
): EmbedResult {
  if (kind === "youtube" || (!kind && /youtu\.?be/.test(url))) {
    const id = youtubeId(url);
    const src = youtubeEmbedUrl(url);
    if (src && id) return { type: "youtube", src, id };
  }
  if (kind === "soundcloud" || /soundcloud\.com/.test(url)) {
    const src = soundcloudEmbedUrl(url);
    if (src) return { type: "soundcloud", src };
  }
  if (kind === "spotify" || /spotify\.com/.test(url)) {
    const match = url.match(/artist\/([a-zA-Z0-9]+)/);
    if (match?.[1]) {
      return {
        type: "spotify",
        src: `https://open.spotify.com/embed/artist/${match[1]}`,
      };
    }
  }
  return { type: "link", src: null, href: url };
}
