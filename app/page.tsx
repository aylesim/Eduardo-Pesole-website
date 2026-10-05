import type { Metadata } from "next";
import IndexGallery from "@/components/index-gallery/IndexGallery";
import { getGalleryWorks } from "@/lib/gallery-works";

export const metadata: Metadata = {
  title: {
    absolute: "Eduardo Pesole | Sound designer",
  },
  description:
    "Eduardo Pesole is a Berlin-based sound designer, sound artist and composer.",
};

export default function IndexPage() {
  const works = getGalleryWorks(17);

  return <IndexGallery works={works} />;
}
