import type { Metadata } from "next";
import ExpandableBio from "@/components/ExpandableBio";
import LiteYouTube from "@/components/LiteYouTube";
import { getAbout, getContact, getSiteSettings } from "@/lib/content";

const settings = getSiteSettings();

export const metadata: Metadata = {
  title: "About",
  description: settings.meta.about_description,
};

export default function AboutPage() {
  const about = getAbout();
  const contact = getContact();

  return (
    <div className="editorial-page">
      <header className="pt-10 pb-16 md:pt-16 md:pb-24">
        <h1 className="type-sheet-title">{about.page_title}</h1>
      </header>

      <div className="about-stack">
        <div className="about-row">
          <div className="about-panel about-panel--slant-a about-panel--tone-base">
            <div className="about-panel-head">
              <h2 className="about-panel-title">{about.biography_title}</h2>
              <span className="about-panel-mark" aria-hidden="true">
                ♫
              </span>
            </div>
            <ExpandableBio
              lead={about.lead}
              full={about.full}
              expandLabel={about.expand_label}
              collapseLabel={about.collapse_label}
            />
          </div>

          <div
            id="showreel"
            className="about-panel about-panel--showreel about-panel--slant-b about-panel--tone-warm scroll-mt-24"
          >
            <div className="about-panel-head">
              <h2 className="about-panel-title">{about.showreel_title}</h2>
              <span className="about-panel-mark" aria-hidden="true">
                ▶
              </span>
            </div>
            <LiteYouTube
              url={about.showreel.url}
              title={about.showreel.aria_label}
              poster={about.showreel.poster}
              kind="youtube"
            />
          </div>
        </div>

        <div className="about-panel about-panel--credits about-panel--slant-a about-panel--tone-lilac">
          <div className="about-panel-head">
            <h2 className="about-panel-title">{about.credits_title}</h2>
            <span className="about-panel-mark" aria-hidden="true">
              ◎
            </span>
          </div>
          <ul className="about-credit-list">
            {about.credits.map((entry) => (
              <li key={entry.name}>
                <span className="about-credit-chip">{entry.name}</span>
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
