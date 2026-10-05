export function youtubeEmbedUrl(url) {
  if (!url) return null;
  try {
    const u = new URL(url);
    let id = null;
    if (u.hostname.includes("youtu.be")) {
      id = u.pathname.replace("/", "");
    } else if (u.hostname.includes("youtube.com")) {
      id = u.searchParams.get("v");
      if (!id && u.pathname.startsWith("/embed/")) {
        id = u.pathname.split("/")[2];
      }
    }
    if (!id) return null;
    return `https://www.youtube.com/embed/${id}`;
  } catch {
    return null;
  }
}

export function soundcloudEmbedUrl(url) {
  if (!url) return null;
  const encoded = encodeURIComponent(url.split("?")[0]);
  return `https://w.soundcloud.com/player/?url=${encoded}&color=%23000000&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false`;
}

export function bandcampEmbedUrl(url) {
  return url;
}

export function getEmbedSrc(kind, url) {
  if (kind === "youtube" || (!kind && /youtu\.?be/.test(url))) {
    return { type: "youtube", src: youtubeEmbedUrl(url) };
  }
  if (kind === "soundcloud" || /soundcloud\.com/.test(url)) {
    return { type: "soundcloud", src: soundcloudEmbedUrl(url) };
  }
  if (kind === "spotify" || /spotify\.com/.test(url)) {
    const match = url.match(/artist\/([a-zA-Z0-9]+)/);
    if (match) {
      return {
        type: "spotify",
        src: `https://open.spotify.com/embed/artist/${match[1]}`,
      };
    }
  }
  return { type: "link", src: null, href: url };
}
