import type { Metadata } from "next";
import Link from "next/link";
import ForwardIndex from "@/components/ForwardIndex";
import ScrollReveal from "@/components/ScrollReveal";
import ShowreelButton from "@/components/ShowreelButton";
import { getServices, getSite, getWorks } from "@/lib/content";

export const metadata: Metadata = {
  title: {
    absolute: "Eduardo Pesole | Sound designer",
  },
  description:
    "Eduardo Pesole is a passionate sound designer, sound explorer and composer.",
};

export default function IndexPage() {
  const site = getSite();
  const works = getWorks();
  const services = getServices();

  return (
    <>
      <section className="relative mx-auto flex min-h-[88vh] max-w-7xl flex-col justify-end px-5 pb-16 pt-24 md:px-8 md:pb-24">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_20%_10%,color-mix(in_oklab,var(--color-accent)_18%,transparent),transparent_55%),radial-gradient(ellipse_at_80%_30%,color-mix(in_oklab,var(--color-accent-secondary)_12%,transparent),transparent_50%)]"
        />
        <p className="font-meta mb-4 text-accent">Berlin</p>
        <h1 className="mb-4 max-w-4xl text-[clamp(2.6rem,8vw,6rem)] leading-[0.95] font-medium tracking-[-0.03em]">
          Eduardo Pesole
        </h1>
        <p className="mb-8 max-w-xl text-lg text-muted md:text-xl">
          {site.global.role_line}
        </p>
        <ShowreelButton
          url={site.global.showreel_video.url}
          label={site.global.showreel_cta}
          ariaLabel={site.global.showreel_video.aria_label}
        />
      </section>

      <ForwardIndex works={works} />

      <ScrollReveal className="mx-auto max-w-7xl px-5 py-24 md:px-8">
        <div className="border-t border-line pt-16">
          <p className="font-meta mb-3 text-accent-secondary">Next</p>
          <h2 className="mb-4 text-3xl md:text-4xl">Services</h2>
          <p className="mb-10 max-w-2xl text-muted">
            Interactive audio, installations, composition, and mix — short
            offers for multidisciplinary projects.
          </p>
          <ul className="mb-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((service) => (
              <li key={service.id} className="space-y-2">
                <h3 className="text-lg text-ink">{service.title}</h3>
                <p className="text-sm text-muted">{service.body}</p>
                {service.isPlaceholder ? (
                  <p className="font-meta text-accent-secondary/80">
                    Placeholder copy
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-5">
            <Link
              href="/services"
              className="border border-accent px-4 py-2.5 font-meta text-accent hover:bg-accent hover:text-base"
            >
              All services
            </Link>
            <Link href="/works" className="font-meta text-muted hover:text-accent">
              Browse works
            </Link>
            <Link href="/about" className="font-meta text-muted hover:text-accent">
              About
            </Link>
          </div>
        </div>
      </ScrollReveal>
    </>
  );
}
