import type { Metadata } from "next";
import WorksBrowser from "@/components/WorksBrowser";
import { getWorks } from "@/lib/content";

export const metadata: Metadata = {
  title: "Works",
  description:
    "Selected works by Eduardo Pesole — games, art collabs, movies, music.",
};

export default function WorksPage() {
  const works = getWorks();

  return (
    <div className="mx-auto max-w-7xl px-5 py-14 md:px-8 md:py-20">
      <header className="mb-10 space-y-3">
        <p className="font-meta text-primary">Works</p>
        <h1 className="type-sheet-title">All projects</h1>
      </header>
      <WorksBrowser works={works} />
    </div>
  );
}
