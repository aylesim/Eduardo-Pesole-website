import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import ProjectCard from "@/components/ProjectCard";
import { getHubLinks, getSecondary, isLogoMark } from "@/lib/content";

export const metadata: Metadata = {
  title: "Games",
  description: "Game sound design projects by Eduardo Pesole.",
};

export default function GamesHubPage() {
  const hub = getSecondary("games_hub");
  const items = getHubLinks("games");
  const gallery = (hub.images || []).filter(
    (img) => img.local && !isLogoMark(img.local),
  );

  return (
    <PageShell wide>
      <h1 className="mb-6 text-3xl font-medium">Games</h1>
      <ul className="mt-6 list-none space-y-2 p-0">
        {items.map((item) => (
          <li key={item.slug}>
            <Link href={`/${item.slug}`}>{item.title}</Link>
          </li>
        ))}
      </ul>
      {gallery.length > 0 ? (
        <div className="mt-6 grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-5">
          {gallery.map((img) => (
            <ProjectCard
              key={img.local}
              image={img}
              fallbackAlt="Games"
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
