import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import ProjectCard from "@/components/ProjectCard";
import { getHubLinks, getSecondary, isLogoMark } from "@/lib/content";

export const metadata: Metadata = {
  title: "Art Collabs",
  description: "Art collaboration projects by Eduardo Pesole.",
};

const IMAGE_TO_SLUG: Record<string, string> = {
  "f9476d_778ce5e92bdc445c8064f2851a48fd28-mv2.jpg":
    "sound-art-unstable-matter",
  "f9476d_d6dd5bedbc8846afa57a824e1da874d5-mv2.jpg": "collabs-art",
  "f9476d_9fc97c63d2b6437f924ac90425a61696-mv2.jpg":
    "sound-art-wasch-collective",
  "f9476d_334ee59559c3461db16929403f1abeb2-mv2.png": "sound-art-the-veil",
};

export default function SoundArtHubPage() {
  const hub = getSecondary("sound_art_hub");
  const items = getHubLinks("sound-art");
  const gallery = (hub.images || []).filter(
    (img) => img.local && !isLogoMark(img.local),
  );

  return (
    <PageShell wide>
      <h1 className="mb-6 text-3xl font-medium">Art collabs</h1>
      <ul className="mt-6 list-none space-y-2 p-0">
        {items.map((item) => (
          <li key={item.slug}>
            <Link href={`/${item.slug}`}>{item.title}</Link>
          </li>
        ))}
      </ul>
      {gallery.length > 0 ? (
        <div className="mt-6 grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-5">
          {gallery.map((img) => {
            const file = img.local?.split("/").pop() ?? "";
            const slug = IMAGE_TO_SLUG[file];
            const label = img.alt
              ? img.alt.replace(/\.(JPG|jpg|png)$/, "")
              : undefined;
            return (
              <ProjectCard
                key={img.local}
                image={img}
                href={slug ? `/${slug}` : undefined}
                label={label}
                fallbackAlt="Art collabs"
              />
            );
          })}
        </div>
      ) : null}
      <Link href="/s-projects-basic" className="mt-8 inline-block text-sm">
        ← BACK
      </Link>
    </PageShell>
  );
}
