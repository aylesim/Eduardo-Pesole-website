import type { Metadata } from "next";
import ServiceCards from "@/components/ServiceCards";
import { getServices, getSiteSettings } from "@/lib/content";

const settings = getSiteSettings();

export const metadata: Metadata = {
  title: "Services",
  description: settings.meta.services_description,
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
