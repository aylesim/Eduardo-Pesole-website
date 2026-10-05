import type { Metadata } from "next";
import Link from "next/link";
import ScrollReveal from "@/components/ScrollReveal";
import { getServices, getSite } from "@/lib/content";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Interactive game audio, installation & spatial audio, composition, and mix / editorial.",
};

export default function ServicesPage() {
  const services = getServices();
  const site = getSite();

  return (
    <div className="mx-auto max-w-7xl px-5 py-14 md:px-8 md:py-20">
      <ScrollReveal className="mb-12 max-w-2xl space-y-4">
        <p className="font-meta text-accent">Services</p>
        <h1 className="text-4xl md:text-5xl">What I offer</h1>
        <p className="text-muted">
          Four short offers drawn from roles across games, installations, film,
          and mix. Final wording is pending editorial pass.
        </p>
      </ScrollReveal>

      <ul className="grid gap-8 sm:grid-cols-2">
        {services.map((service, i) => (
          <ScrollReveal key={service.id} delay={i * 0.05}>
            <li className="flex h-full flex-col justify-between border-t border-line pt-6">
              <div className="space-y-3">
                <h2 className="text-2xl">{service.title}</h2>
                <p className="text-muted">{service.body}</p>
                {service.isPlaceholder ? (
                  <p className="font-meta text-accent-secondary/80">
                    Placeholder copy
                  </p>
                ) : null}
              </div>
              <Link
                href="/about#contact"
                className="mt-8 inline-flex w-fit font-meta text-accent hover:text-ink"
              >
                {site.global.contact_cta}
              </Link>
            </li>
          </ScrollReveal>
        ))}
      </ul>
    </div>
  );
}
