import Image from "next/image";
import Link from "next/link";
import { getHubLinks, getSecondary } from "@/lib/content";

export const metadata = {
  title: "Games",
  description: "Game sound design projects by Eduardo Pesole.",
};

export default function GamesHubPage() {
  const hub = getSecondary("games_hub");
  const items = getHubLinks("games");
  const gallery = (hub.images || []).filter(
    (img) => img.local && !img.local.includes("984ee3bf58d04fdda67fe9f48d7d5003")
  );

  return (
    <div className="page page-wide">
      <h1 className="page-title">Games</h1>
      <ul className="hub-list">
        {items.map((item) => (
          <li key={item.slug}>
            <Link href={`/${item.slug}`}>{item.title}</Link>
          </li>
        ))}
      </ul>
      {gallery.length > 0 ? (
        <div className="hub-grid">
          {gallery.map((img) => (
            <div key={img.local} className="hub-card">
              <Image
                src={img.local}
                alt={img.alt || "Games"}
                width={img.width || 800}
                height={img.height || 500}
                sizes="(max-width: 600px) 100vw, 300px"
              />
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
