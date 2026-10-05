import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import ProjectCard from "@/components/ProjectCard";
import { getHubLinks, getSecondary, isLogoMark } from "@/lib/content";

export const metadata: Metadata = {
  title: "Music",
  description: "Music projects and releases by Eduardo Pesole.",
};

export default function MusicHubPage() {
  const hub = getSecondary("music");
  const portfolioMusic = getHubLinks("music");
  const hubItems = hub.items || [];
  const gallery = (hub.images || []).filter(
    (img) => img.local && !isLogoMark(img.local),
  );

  return (
    <PageShell wide>
      <h1 className="mb-6 text-3xl font-medium">Music</h1>

      <ul className="mt-6 list-none space-y-2 p-0">
        {portfolioMusic.map((item) => (
          <li key={item.title}>
            <a href={item.url} target="_blank" rel="noopener noreferrer">
              {item.title}
            </a>
          </li>
        ))}
      </ul>

      <section className="py-10">
        <ul className="list-none space-y-2 p-0">
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
        <div className="mt-6 grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-5">
          {gallery.map((img) => (
            <ProjectCard
              key={img.local}
              image={img}
              label={
                img.alt
                  ? img.alt.replace(/\.(jpeg|jpg|png|HEIC)$/i, "")
                  : undefined
              }
              fallbackAlt="Music"
            />
          ))}
        </div>
      ) : null}

      <Link href="/s-projects-basic" className="mt-8 inline-block text-sm">
        ← BACK
      </Link>
    </PageShell>
  );
}
