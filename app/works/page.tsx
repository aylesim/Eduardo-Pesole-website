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
    <div className="page-gutter mx-auto max-w-[1536px] py-14 md:py-20">
      <header className="mb-10 space-y-3">
        <h1 className="type-sheet-title">Works</h1>
      </header>
      <Suspense fallback={<div className="h-40" />}>
        <WorksBrowser works={works} />
      </Suspense>
    </div>
  );
}
