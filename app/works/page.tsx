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
        <h1 className="type-sheet-title">
          Selected
          <br />
          Works
        </h1>
      </header>
      <Suspense fallback={<div className="h-40" />}>
        <WorksBrowser works={works} />
      </Suspense>
    </div>
  );
}
