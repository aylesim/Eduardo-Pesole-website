import type { Metadata } from "next";
import Link from "next/link";
import ScrollReveal from "@/components/ScrollReveal";
import { getServices } from "@/lib/content";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Game & interactive audio, installation & spatial sound, composition, and mix & post-production.",
};

export default function ServicesPage() {
  const services = getServices();

  return (
    <div className="page-gutter mx-auto max-w-[960px] py-14 md:py-20">
      <ScrollReveal className="mb-14 space-y-4">
        <h1 className="type-h2">Services</h1>
        <p className="type-body text-muted">
          Audio for games, space, picture, and mix.
        </p>
      </ScrollReveal>

      <ul className="border-t border-border">
        {services.map((service, i) => (
          <ScrollReveal key={service.id} delay={i * 0.04}>
            <li className="group relative border-b border-border py-8 pl-4 transition-colors duration-(--duration-fast) before:absolute before:top-0 before:bottom-0 before:left-0 before:w-0.5 before:bg-transparent before:transition-colors before:duration-(--duration-fast) hover:before:bg-accent md:py-10">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:gap-10">
                <span className="font-meta shrink-0 text-rail">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="flex-1 space-y-3">
                  <h2 className="font-display text-[clamp(1.25rem,2vw,1.75rem)] font-semibold tracking-[-0.02em]">
                    {service.title}
                  </h2>
                  <p className="type-body text-muted">{service.line1}</p>
                  <p className="type-body text-muted">{service.line2}</p>
                  <Link
                    href={`/about#contact?topic=${service.id}`}
                    className="btn-text inline-flex pt-2 text-accent"
                  >
                    {service.cta}
                  </Link>
                </div>
              </div>
            </li>
          </ScrollReveal>
        ))}
      </ul>
    </div>
  );
}
