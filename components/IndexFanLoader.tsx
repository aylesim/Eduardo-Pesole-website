"use client";

import dynamic from "next/dynamic";
import type { WorkItem } from "@/lib/types";

const OxideFan = dynamic(() => import("@/components/OxideFan"), {
  ssr: false,
  loading: () => <div className="fixed inset-0 bg-base" aria-hidden />,
});

export default function IndexFanLoader({ works }: { works: WorkItem[] }) {
  return <OxideFan works={works} />;
}
