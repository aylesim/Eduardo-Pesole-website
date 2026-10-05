import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
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

      <div className="border-border grid grid-cols-12 gap-x-5 gap-y-14 border-t py-12 md:py-20">
        <div className="col-span-12 md:col-span-6">
          <ExpandableBio lead={about_lead} full={about_bio} />
        </div>

        <div
          id="showreel"
          className="col-span-12 scroll-mt-24 md:col-span-5 md:col-start-8"
        >
          <LiteYouTube
            url={global.showreel_video.url}
            title={global.showreel_video.aria_label}
            poster="/images/showreel-2025-poster.jpg"
            kind="youtube"
          />
        </div>

        <div className="border-border col-span-12 mt-6 grid grid-cols-12 gap-5 border-t pt-6">
          <h2 className="font-meta col-span-12 md:col-span-3">
            Studios & collaborators
          </h2>
          <p className="font-meta-value text-muted col-span-12 md:col-span-7 md:col-start-6">
            {global.credits.join(" · ")}
          </p>
        </div>
      </div>

      <section
        id="contact"
        className="border-border scroll-mt-24 border-t pt-12 md:pt-20"
      >
        <h2 className="type-sheet-title mb-16 md:mb-24">{contact.heading}</h2>
        <div className="grid grid-cols-12 gap-x-5 gap-y-14">
          <div className="col-span-12 md:col-span-5">
            <ul className="space-y-4">
              <li>
                <a
                  href={`mailto:${contact.email}`}
                  className="font-display text-text text-[clamp(1.3rem,2.4vw,2.5rem)] font-bold tracking-[-0.04em]"
                >
                  {contact.email}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${contact.phone.replace(/\s+/g, "")}`}
                  className="font-meta-value text-text"
                >
                  {contact.phone}
                </a>
              </li>
              {contact.socials.map((social) => (
                <li key={social.url}>
                  <a
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-meta-value text-text"
                  >
                    {social.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="col-span-12 md:col-span-5 md:col-start-8">
            <ContactForm
              email={contact.email}
              fields={contact.form_fields}
              submitLabel={contact.form_submit_label}
              successMessage={contact.form_success_message}
              services={site.services}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
