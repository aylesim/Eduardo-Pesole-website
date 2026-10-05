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
    <div className="mx-auto max-w-7xl px-5 py-14 md:px-8 md:py-20">
      <ScrollReveal className="mb-12 max-w-2xl space-y-4">
        <p className="font-meta text-primary">Services</p>
        <h1 className="type-sheet-title">What I offer</h1>
      </ScrollReveal>

      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {services.map((service, i) => (
          <ScrollReveal key={service.id} delay={i * 0.05}>
            <li className="group flex h-full flex-col justify-between border border-border bg-surface p-6 transition-colors duration-(--duration-fast) hover:border-t-primary hover:bg-surface-elevated">
              <div className="space-y-3">
                <h2 className="type-h2">{service.title}</h2>
                <p className="type-body text-muted">{service.line1}</p>
                <p className="type-body text-muted">{service.line2}</p>
              </div>
              <Link
                href={`/about#contact?topic=${service.id}`}
                className="mt-8 inline-flex w-fit font-mono text-[0.75rem] font-medium uppercase tracking-[0.08em] text-primary"
              >
                {service.cta}
              </Link>
            </li>
          </ScrollReveal>
        ))}
      </ul>
    </div>
  );
}
