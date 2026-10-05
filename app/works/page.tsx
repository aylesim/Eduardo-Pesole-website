import type { Metadata } from "next";
import WorksBrowser from "@/components/WorksBrowser";
import { getWorks } from "@/lib/content";

export const metadata: Metadata = {
  title: "Works",
  description: "Selected works by Eduardo Pesole — games, art collabs, movies, music.",
};

export default function WorksPage() {
  const works = getWorks();

  return (
    <div className="mx-auto max-w-7xl px-5 py-14 md:px-8 md:py-20">
      <header className="mb-10 space-y-3">
        <p className="font-meta text-accent">Works</p>
        <h1 className="text-4xl md:text-5xl">All projects</h1>
        <p className="max-w-2xl text-muted">
          Flat browse of the same Forward Index — filter by category, or scroll
          the Music carousel for external listens.
        </p>
      </header>
      <WorksBrowser works={works} />
    </div>
  );
}
