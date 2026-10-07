import type { Metadata } from "next";
import IndexGallery from "@/components/index-gallery/IndexGallery";
import { getSiteSettings } from "@/lib/content";
import { getGalleryWorks } from "@/lib/gallery-works";

const settings = getSiteSettings();

export const metadata: Metadata = {
  title: {
    absolute: settings.meta.site_title_default,
  },
  description: settings.meta.home_description,
};

export default function IndexPage() {
  const works = getGalleryWorks(17);

  return <IndexGallery works={works} />;
}
