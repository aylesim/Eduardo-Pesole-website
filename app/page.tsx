import type { Metadata } from "next";
import Link from "next/link";
import CueCard from "@/components/CueCard";
import HomeARoll from "@/components/HomeARoll";
import { getSelectedWorks, getServices, getSite } from "@/lib/content";

export const metadata: Metadata = {
  title: {
    absolute: "Eduardo Pesole | Sound designer",
  },
  description:
    "Eduardo Pesole is a Berlin-based sound designer, sound artist and composer.",
};

const HOME_SPANS = [
  "col-span-12 lg:col-span-7",
  "col-span-12 lg:col-span-5",
  "col-span-12 lg:col-span-5",
  "col-span-12 lg:col-span-7",
  "col-span-12",
  "col-span-12 lg:col-span-6",
  "col-span-12 lg:col-span-6",
  "col-span-12 lg:col-span-7",
] as const;

export default function IndexPage() {
  const site = getSite();
  const selected = getSelectedWorks(8);
  const services = getServices();

  return (
    <>
      <HomeARoll
        brandName={site.global.brand_name}
        roleLine={site.global.role_line}
        showreelUrl={site.global.showreel_video.url}
        showreelTitle={site.global.showreel_video.aria_label}
        ctaLabel={site.global.showreel_cta}
      />

      <section className="page-gutter mx-auto max-w-[1536px] py-20 md:py-28">
        <div className="mb-10 flex items-end justify-between gap-4">
          <p className="font-meta">Selected</p>
          <Link href="/works" className="btn-text text-accent">
            All works →
          </Link>
        </div>
        <ul className="grid grid-cols-12 gap-5 md:gap-6 lg:gap-7">
          {selected.map((work, i) => (
            <CueCard
              key={work.slug}
              work={work}
              spanClass={HOME_SPANS[i % HOME_SPANS.length]}
              aspect={i % 3 === 1 ? "portrait" : "video"}
              priority={i < 2}
            />
          ))}
        </ul>
      </section>

      <section className="border-t border-border bg-surface">
        <div className="page-gutter mx-auto flex max-w-[1536px] flex-col gap-6 py-14 md:flex-row md:items-center md:justify-between md:py-16">
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
            <Link href="/services" className="btn-text text-text">
              All services →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
