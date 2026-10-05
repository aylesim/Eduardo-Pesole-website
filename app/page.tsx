import type { Metadata } from "next";
import { Suspense } from "react";
import IndexFanLoader from "@/components/IndexFanLoader";
import { getWorks } from "@/lib/content";

export const metadata: Metadata = {
  title: {
    absolute: "Eduardo Pesole | Sound designer",
  },
  description:
    "Eduardo Pesole is a Berlin-based sound designer, sound artist and composer.",
};

export default function IndexPage() {
  const works = getWorks();

  return (
    <Suspense fallback={<div className="fixed inset-0 bg-base" />}>
      <IndexFanLoader works={works} />
    </Suspense>
  );
}
