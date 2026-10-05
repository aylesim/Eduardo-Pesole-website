import { getEmbedSrc } from "@/lib/embeds";

export default function Embed({ url, kind, title, label }) {
  const { type, src, href } = getEmbedSrc(kind, url);
  const caption = title || label || "";

  if (type === "link" || !src) {
    return (
      <p className="embed-fallback">
        <a href={href || url} target="_blank" rel="noopener noreferrer">
          {caption || url}
        </a>
      </p>
    );
  }

  if (type === "soundcloud") {
    return (
      <div className="embed embed-soundcloud">
        {caption ? <p className="embed-caption">{caption}</p> : null}
        <iframe
          title={caption || "SoundCloud player"}
          width="100%"
          height="166"
          scrolling="no"
          frameBorder="no"
          allow="autoplay"
          src={src}
        />
      </div>
    );
  }

  if (type === "spotify") {
    return (
      <div className="embed embed-spotify">
        {caption ? <p className="embed-caption">{caption}</p> : null}
        <iframe
          title={caption || "Spotify player"}
          src={src}
          width="100%"
          height="152"
          frameBorder="0"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
        />
      </div>
    );
  }

  return (
    <div className="embed embed-video">
      {caption ? <p className="embed-caption">{caption}</p> : null}
      <div className="embed-video-frame">
        <iframe
          title={caption || "Video"}
          src={src}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          loading="lazy"
        />
      </div>
    </div>
  );
}
