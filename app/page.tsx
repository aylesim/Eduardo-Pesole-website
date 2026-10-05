import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import ForwardIndex from "@/components/ForwardIndex";
import ScrollReveal from "@/components/ScrollReveal";
import { getServices, getSite, getWorks } from "@/lib/content";

export const metadata: Metadata = {
  title: {
    absolute: "Eduardo Pesole | Sound designer",
  },
  description:
    "Eduardo Pesole is a Berlin-based sound designer, sound artist and composer.",
};

export default function IndexPage() {
  const site = getSite();
  const works = getWorks();
  const services = getServices();

  return (
    <>
      <section className="relative mx-auto flex min-h-[88svh] max-w-7xl flex-col justify-end px-5 pb-16 pt-24 md:px-8 md:pb-24">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_18%_12%,color-mix(in_oklab,var(--color-primary)_16%,transparent),transparent_55%),radial-gradient(ellipse_at_82%_28%,color-mix(in_oklab,var(--color-secondary)_12%,transparent),transparent_50%)]"
        />
        <h1 className="type-hero mb-5 text-text">{site.global.brand_name}</h1>
        <p className="mb-8 max-w-xl text-lg text-muted md:text-xl">
          {site.global.role_line}
        </p>
        <Link
          href="/about#showreel"
          className="inline-flex w-fit border border-primary/50 px-4 py-2.5 font-mono text-[0.75rem] font-medium uppercase tracking-[0.08em] text-primary hover:bg-primary hover:text-base"
        >
          {site.global.showreel_cta}
        </Link>
      </section>

      <Suspense fallback={<div className="h-[100svh]" />}>
        <ForwardIndex works={works} />
      </Suspense>

      <ScrollReveal className="mx-auto max-w-7xl px-5 py-24 md:px-8">
        <div className="border-t border-border pt-16">
          <p className="font-meta mb-3 text-secondary">Next</p>
          <h2 className="type-h2 mb-8">Services</h2>
          <ul className="mb-10 flex flex-col gap-4 md:flex-row md:flex-wrap md:gap-x-8 md:gap-y-3">
            {services.map((service) => (
              <li key={service.id}>
                <Link
                  href="/services"
                  className="font-meta text-muted hover:text-primary"
                >
                  {service.title}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="/services"
            className="font-mono text-[0.75rem] font-medium uppercase tracking-[0.08em] text-primary"
          >
            All services →
          </Link>
        </div>
      </ScrollReveal>
    </>
  );
}
