import Image from "next/image";
import Link from "next/link";
import { getHubLinks, getSecondary } from "@/lib/content";

export const metadata = {
  title: "Music",
  description: "Music projects and releases by Eduardo Pesole.",
};

export default function MusicHubPage() {
  const hub = getSecondary("music");
  const portfolioMusic = getHubLinks("music");
  const hubItems = hub.items || [];
  const gallery = (hub.images || []).filter(
    (img) => img.local && !img.local.includes("984ee3bf58d04fdda67fe9f48d7d5003")
  );

  return (
    <div className="page page-wide">
      <h1 className="page-title">Music</h1>

      <ul className="hub-list">
        {portfolioMusic.map((item) => (
          <li key={item.title}>
            <a href={item.url} target="_blank" rel="noopener noreferrer">
              {item.title}
            </a>
          </li>
        ))}
      </ul>

      <section className="section">
        <ul className="hub-list">
          {hubItems.map((item) => (
            <li key={item.label}>
              {item.url ? (
                <a href={item.url} target="_blank" rel="noopener noreferrer">
                  {item.label}
                </a>
              ) : item.label === "STRAY BLADE" ? (
                <Link href="/stray-blade">{item.label}</Link>
              ) : item.label === "MOONGAZE" ? (
                <Link href="/games-moongaze">{item.label}</Link>
              ) : (
                <span>{item.label}</span>
              )}
            </li>
          ))}
        </ul>
      </section>

      {gallery.length > 0 ? (
        <div className="hub-grid">
          {gallery.map((img) => (
            <div key={img.local} className="hub-card">
              <Image
                src={img.local}
                alt={img.alt || "Music"}
                width={img.width || 800}
                height={img.height || 800}
                sizes="(max-width: 600px) 100vw, 300px"
              />
              {img.alt ? (
                <span>{img.alt.replace(/\.(jpeg|jpg|png|HEIC)$/i, "")}</span>
              ) : null}
            </div>
          ))}
        </div>
      ) : null}

      <Link href="/s-projects-basic" className="back-link">
        ← BACK
      </Link>
    </div>
  );
}
