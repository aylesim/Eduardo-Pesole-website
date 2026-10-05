import { getEmbedSrc } from "@/lib/embeds";

type EmbedProps = {
  url: string;
  kind?: string;
  title?: string;
  label?: string;
};

export default function Embed({ url, kind, title, label }: EmbedProps) {
  const result = getEmbedSrc(kind, url);
  const caption = title || label || "";

  if (result.type === "link") {
    return (
      <p>
        <a href={result.href} target="_blank" rel="noopener noreferrer">
          {caption || url}
        </a>
      </p>
    );
  }

  if (result.type === "soundcloud") {
    return (
      <div>
        {caption ? (
          <p className="mb-2 text-sm text-muted">{caption}</p>
        ) : null}
        <iframe
          title={caption || "SoundCloud player"}
          width="100%"
          height="166"
          scrolling="no"
          frameBorder="no"
          allow="autoplay"
          src={result.src}
        />
      </div>
    );
  }

  if (result.type === "spotify") {
    return (
      <div>
        {caption ? (
          <p className="mb-2 text-sm text-muted">{caption}</p>
        ) : null}
        <iframe
          title={caption || "Spotify player"}
          src={result.src}
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
    <div>
      {caption ? <p className="mb-2 text-sm text-muted">{caption}</p> : null}
      <div className="relative h-0 w-full overflow-hidden bg-neutral-900 pb-[56.25%]">
        <iframe
          title={caption || "Video"}
          src={result.src}
          className="absolute inset-0 h-full w-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          loading="lazy"
        />
      </div>
    </div>
  );
}
