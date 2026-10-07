import type { Metadata } from "next";
import ServiceCards from "@/components/ServiceCards";
import { getServices } from "@/lib/content";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Game and interactive audio, spatial sound for installations, composition for picture, mix and post-production.",
};

export default function ServicesPage() {
  const services = getServices();

  return (
    <div className="editorial-page">
      <header className="pt-10 pb-16 md:pt-16 md:pb-24">
        <h1 className="type-sheet-title">Services</h1>
      </header>

      <ServiceCards services={services} />
    </div>
  );
}
