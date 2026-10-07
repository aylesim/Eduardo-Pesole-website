import type { Metadata } from "next";
import ExpandableBio from "@/components/ExpandableBio";
import LiteYouTube from "@/components/LiteYouTube";
import { getSite } from "@/lib/content";

export const metadata: Metadata = {
  title: "About",
  description:
    "Berlin-based sound designer, sound artist and composer — bio, showreel, and contact.",
};

export default function AboutPage() {
  const site = getSite();
  const { contact, global, about_bio, about_lead } = site;

  return (
    <div className="editorial-page">
      <header className="pt-10 pb-16 md:pt-16 md:pb-24">
        <h1 className="type-sheet-title">About</h1>
      </header>

      <div className="about-stack">
        <div className="about-row">
          <div className="about-panel about-panel--slant-a about-panel--tone-base">
            <div className="about-panel-head">
              <h2 className="about-panel-title">Biography</h2>
              <span className="about-panel-mark" aria-hidden="true">
                ♫
              </span>
            </div>
            <ExpandableBio lead={about_lead} full={about_bio} />
          </div>

          <div
            id="showreel"
            className="about-panel about-panel--showreel about-panel--slant-b about-panel--tone-warm scroll-mt-24"
          >
            <div className="about-panel-head">
              <h2 className="about-panel-title">Showreel</h2>
              <span className="about-panel-mark" aria-hidden="true">
                ▶
              </span>
            </div>
            <LiteYouTube
              url={global.showreel_video.url}
              title={global.showreel_video.aria_label}
              poster="/images/showreel-2025-poster.jpg"
              kind="youtube"
            />
          </div>
        </div>

        <div className="about-panel about-panel--credits about-panel--slant-a about-panel--tone-lilac">
          <div className="about-panel-head">
            <h2 className="about-panel-title">Studios & collaborators</h2>
            <span className="about-panel-mark" aria-hidden="true">
              ◎
            </span>
          </div>
          <ul className="about-credit-list">
            {global.credits.map((name) => (
              <li key={name}>
                <span className="about-credit-chip">{name}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <section
        id="contacts"
        className="about-contacts scroll-mt-24"
        aria-labelledby="contacts-heading"
      >
        <div className="about-panel about-panel--contact about-panel--slant-b about-panel--tone-base">
          <div className="about-panel-head">
            <h2 id="contacts-heading" className="about-panel-title">
              {contact.heading}
            </h2>
            <span className="about-panel-mark" aria-hidden="true">
              @
            </span>
          </div>

          <a
            href={`mailto:${contact.email}`}
            className="contact-hero-link about-contact-email"
          >
            {contact.email}
          </a>

          <div className="about-contact-row">
            <a
              href={`tel:${contact.phone.replace(/\s+/g, "")}`}
              className="contact-phone-link"
            >
              {contact.phone}
            </a>

            {contact.socials.length > 0 ? (
              <ul className="flex flex-wrap gap-3">
                {contact.socials.map((social, i) => (
                  <li key={social.url}>
                    <a
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`contact-chip ${i % 2 === 0 ? "contact-chip--tilt-a" : "contact-chip--tilt-b"}`}
                    >
                      {social.label}
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>
      </section>
    </div>
  );
}
