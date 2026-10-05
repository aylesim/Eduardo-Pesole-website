import type { Metadata } from "next";
import { Suspense } from "react";
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
    <div className="editorial-page">
      <header className="mb-14 pt-10 md:mb-20 md:pt-16">
        <div className="grid grid-cols-12 gap-x-5">
          <p className="editorial-kicker col-span-12 mb-6 md:col-span-3">
            Archive · 2019—2025
          </p>
          <h1 className="type-sheet-title col-span-12 md:col-span-9">
            Selected
            <br />
            Works
          </h1>
          <p className="type-body col-span-12 mt-8 text-muted md:col-span-4 md:col-start-8">
            Sound design, spatial audio and composition across games,
            installations, moving image and music.
          </p>
        </div>
      </header>
      <Suspense fallback={<div className="h-40" />}>
        <WorksBrowser works={works} />
      </Suspense>
    </div>
  );
}
