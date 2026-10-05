import Image from "next/image";
import Link from "next/link";
import { getHubLinks, getSecondary } from "@/lib/content";

export const metadata = {
  title: "Art Collabs",
  description: "Art collaboration projects by Eduardo Pesole.",
};

const IMAGE_TO_SLUG = {
  "f9476d_778ce5e92bdc445c8064f2851a48fd28-mv2.jpg": "sound-art-unstable-matter",
  "f9476d_d6dd5bedbc8846afa57a824e1da874d5-mv2.jpg": "collabs-art",
  "f9476d_9fc97c63d2b6437f924ac90425a61696-mv2.jpg": "sound-art-wasch-collective",
  "f9476d_334ee59559c3461db16929403f1abeb2-mv2.png": "sound-art-the-veil",
};

export default function SoundArtHubPage() {
  const hub = getSecondary("sound_art_hub");
  const items = getHubLinks("sound-art");
  const gallery = (hub.images || []).filter(
    (img) => img.local && !img.local.includes("984ee3bf58d04fdda67fe9f48d7d5003")
  );

  return (
    <div className="page page-wide">
      <h1 className="page-title">Art collabs</h1>
      <ul className="hub-list">
        {items.map((item) => (
          <li key={item.slug}>
            <Link href={`/${item.slug}`}>{item.title}</Link>
          </li>
        ))}
      </ul>
      {gallery.length > 0 ? (
        <div className="hub-grid">
          {gallery.map((img) => {
            const file = img.local.split("/").pop();
            const slug = IMAGE_TO_SLUG[file];
            const inner = (
              <>
                <Image
                  src={img.local}
                  alt={img.alt || "Art collabs"}
                  width={img.width || 800}
                  height={img.height || 500}
                  sizes="(max-width: 600px) 100vw, 300px"
                />
                {img.alt ? <span>{img.alt.replace(/\.(JPG|jpg|png)$/, "")}</span> : null}
              </>
            );
            return slug ? (
              <Link key={img.local} href={`/${slug}`} className="hub-card">
                {inner}
              </Link>
            ) : (
              <div key={img.local} className="hub-card">
                {inner}
              </div>
            );
          })}
        </div>
      ) : null}
      <Link href="/s-projects-basic" className="back-link">
        ← BACK
      </Link>
    </div>
  );
}
