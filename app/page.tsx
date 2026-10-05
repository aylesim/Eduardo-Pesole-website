import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import ForwardIndex from "@/components/ForwardIndex";
import LandingBeat from "@/components/LandingBeat";
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
      <LandingBeat
        brandName={site.global.brand_name}
        roleLine={site.global.role_line}
        showreelUrl={site.global.showreel_video.url}
        showreelTitle={site.global.showreel_video.aria_label}
        email={site.contact.email}
      />

      <Suspense fallback={<div className="h-[100svh]" />}>
        <ForwardIndex works={works} />
      </Suspense>

      <ScrollReveal>
        <section className="w-full bg-surface">
          <div className="page-gutter mx-auto max-w-[1536px] py-16 md:py-24">
            <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
              <p className="font-meta shrink-0">Services</p>
              <div className="flex flex-1 flex-wrap items-baseline gap-x-8 gap-y-3 md:justify-end">
                {services.map((service) => (
                  <Link
                    key={service.id}
                    href="/services"
                    className="font-ui text-muted hover:text-accent"
                  >
                    {service.title}
                  </Link>
                ))}
                <Link
                  href="/services"
                  className="font-ui text-text hover:text-accent"
                >
                  All services →
                </Link>
              </div>
            </div>
            <div className="flex flex-col gap-4 border-t border-border pt-10 sm:flex-row sm:gap-12">
              <Link
                href="/works"
                className="font-display text-[clamp(1.75rem,3vw,2.5rem)] font-semibold tracking-[-0.02em] no-underline hover:underline hover:decoration-accent hover:decoration-2 hover:underline-offset-8"
              >
                Works →
              </Link>
              <Link
                href="/about"
                className="font-display text-[clamp(1.75rem,3vw,2.5rem)] font-semibold tracking-[-0.02em] no-underline hover:underline hover:decoration-accent hover:decoration-2 hover:underline-offset-8"
              >
                About →
              </Link>
            </div>
          </div>
        </section>
      </ScrollReveal>
    </>
  );
}
