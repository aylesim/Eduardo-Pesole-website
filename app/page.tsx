import type { Metadata } from "next";
import Embed from "@/components/Embed";
import PageShell from "@/components/PageShell";
import { getSite } from "@/lib/content";

export const metadata: Metadata = {
  title: {
    absolute: "Eduardopesole | Sound designer",
  },
  description:
    "Eduardo pesole is a passionate sound designer, sound explorer and composer.",
};

export default function HomePage() {
  const site = getSite();
  const { global, about_bio } = site;

  return (
    <PageShell>
      <section className="py-10 sm:py-16">
        <h1 className="mb-6 text-[clamp(1.6rem,4vw,2.25rem)] font-medium leading-tight">
          {global.hero_tagline}
        </h1>
        <a className="mb-6 inline-block" href="#showreel">
          {global.showreel_cta}
        </a>
        <div id="showreel" className="mt-4">
          <Embed
            url={global.showreel_video.url}
            kind="youtube"
            label={global.showreel_video.aria_label}
          />
        </div>
      </section>

      <section id="about" className="py-10">
        <h2 className="mb-4 text-xl font-semibold tracking-wide">About</h2>
        <p className="whitespace-pre-wrap">{about_bio}</p>
      </section>
    </PageShell>
  );
}
