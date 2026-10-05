import Embed from "@/components/Embed";
import { getSite } from "@/lib/content";

export const metadata = {
  title: "Eduardopesole | Sound designer",
  description:
    "Eduardo pesole is a passionate sound designer, sound explorer and composer.",
};

export default function HomePage() {
  const site = getSite();
  const { global, about_bio } = site;

  return (
    <div className="page">
      <section className="hero">
        <h1>{global.hero_tagline}</h1>
        <a className="hero-cta" href="#showreel">
          {global.showreel_cta}
        </a>
        <div id="showreel">
          <Embed
            url={global.showreel_video.url}
            kind="youtube"
            label={global.showreel_video.aria_label}
          />
        </div>
      </section>

      <section id="about" className="section">
        <h2>About</h2>
        <p className="about-text">{about_bio}</p>
      </section>
    </div>
  );
}
