import type { Metadata } from "next";
import { Suspense } from "react";
import WorksBrowser from "@/components/WorksBrowser";
import {
  getCategoryFilters,
  getSiteSettings,
  getWorks,
  getWorksEmptyMessage,
} from "@/lib/content";

const settings = getSiteSettings();

export const metadata: Metadata = {
  title: "Works",
  description: settings.meta.works_description,
};

export default function WorksPage() {
  const works = getWorks();
  const filters = getCategoryFilters();
  const emptyMessage = getWorksEmptyMessage();

  return (
    <div className="editorial-page">
      <h1 className="sr-only">Works</h1>
      <Suspense fallback={<div className="h-40" />}>
        <WorksBrowser
          works={works}
          filters={filters}
          emptyMessage={emptyMessage}
        />
      </Suspense>
    </div>
  );
}
