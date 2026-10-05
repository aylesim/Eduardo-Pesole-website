import type { Metadata } from "next";
import Link from "next/link";
import { getServices } from "@/lib/content";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Game & interactive audio, installation & spatial sound, composition, and mix & post-production.",
};

export default function ServicesPage() {
  const services = getServices();

  return (
    <div className="editorial-page">
      <header className="grid grid-cols-12 gap-x-5 pt-10 pb-16 md:pt-16 md:pb-24">
        <p className="editorial-kicker col-span-12 mb-6 md:col-span-3">
          What I do
        </p>
        <h1 className="type-sheet-title col-span-12 md:col-span-9">
          Services
        </h1>
        <p className="type-body col-span-12 mt-8 text-muted md:col-span-4 md:col-start-8">
          Audio for games, space, picture, and mix.
        </p>
      </header>

      <ul className="border-t border-border">
        {services.map((service, i) => (
          <li
            key={service.id}
            className="group border-b border-border py-7 md:py-10"
          >
            <div className="grid grid-cols-12 gap-4">
              <span className="font-meta col-span-2 md:col-span-1">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h2 className="col-span-10 font-display text-[clamp(1.9rem,4.4vw,5rem)] font-bold leading-[0.9] tracking-[-0.05em] md:col-span-5">
                {service.title}
              </h2>
              <div className="col-span-10 col-start-3 space-y-4 md:col-span-4 md:col-start-8">
                <p className="type-body text-muted">{service.line1}</p>
                {service.line2 ? (
                  <p className="type-body text-muted">{service.line2}</p>
                ) : null}
                <Link
                  href={`/about#contact?topic=${service.id}`}
                  className="btn-text inline-flex pt-2"
                >
                  {service.cta} →
                </Link>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
