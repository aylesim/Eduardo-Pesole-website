import Image from "next/image";
import Link from "next/link";
import { getHubLinks, getSecondary } from "@/lib/content";

export const metadata = {
  title: "Movies",
  description: "Audiovisual and film sound work by Eduardo Pesole.",
};

const IMAGE_TO_SLUG = {
  "f9476d_a46ac2fb6f4c48cc9afcb2dca11dd7fa-mv2.jpeg": "from-now-on",
  "f9476d_2269a57c8f1647d48743a6b7e724e32a-mv2.jpg":
    "movies-per-non-sparire-lentamente",
  "f9476d_cf812ead9127470299e772b3f0b21977-mv2.jpeg": "movies-balena-spiaggiata",
  "f9476d_d527d4d6932e459190b7eaff9be031ca-mv2.jpeg": "movies-anedonia",
  "f9476d_26d059a76ebd413881e4de959743907d-mv2.png": "movies-escape",
  "f9476d_fc300702ce9347b6ab7fc2905520cd0c-mv2.jpg": "movies-ori",
  "f9476d_20be61799b0a4dc4bc67e3d16e521a79-mv2.jpg": "movies-ineffable-qualitè",
  "f9476d_402ec9fc2d914a46aeccd835436e250f-mv2.jpg": "movies-petricore",
};

export default function MoviesHubPage() {
  const hub = getSecondary("movies_hub");
  const items = getHubLinks("movies");
  const gallery = (hub.images || []).filter(
    (img) => img.local && !img.local.includes("984ee3bf58d04fdda67fe9f48d7d5003")
  );

  return (
    <div className="page page-wide">
      <h1 className="page-title">{hub.heading || "Audiovisual"}</h1>
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
            const label =
              img.alt?.replace(/\.(jpeg|jpg|png|JPG)$/i, "") || "";
            const inner = (
              <>
                <Image
                  src={img.local}
                  alt={img.alt || "Audiovisual"}
                  width={img.width || 800}
                  height={img.height || 500}
                  sizes="(max-width: 600px) 100vw, 300px"
                />
                {label ? <span>{label}</span> : null}
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
