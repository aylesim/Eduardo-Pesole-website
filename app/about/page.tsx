import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import ExpandableBio from "@/components/ExpandableBio";
import LiteYouTube from "@/components/LiteYouTube";
import ScrollReveal from "@/components/ScrollReveal";
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
    <div className="mx-auto max-w-7xl px-5 py-14 md:px-8 md:py-20">
      <ScrollReveal className="mb-16 space-y-8">
        <p className="font-meta text-primary">About</p>
        <h1 className="type-sheet-title max-w-4xl">{global.role_line}</h1>
        <ExpandableBio lead={about_lead} full={about_bio} />
      </ScrollReveal>

      <ScrollReveal className="mb-20 scroll-mt-24" >
        <div id="showreel" className="scroll-mt-24 space-y-4">
          <p className="font-meta text-secondary">Showreel 2025</p>
          <LiteYouTube
            url={global.showreel_video.url}
            title={global.showreel_video.aria_label}
            kind="youtube"
          />
        </div>
      </ScrollReveal>

      <ScrollReveal className="mb-20 max-w-3xl space-y-4 border-t border-border pt-12">
        <h2 className="type-h2">Selected credits</h2>
        <ul className="flex flex-wrap gap-2">
          {global.credits.map((credit) => (
            <li
              key={credit}
              className="border border-border px-3 py-1.5 font-mono text-[0.75rem] uppercase tracking-[0.08em] text-muted"
            >
              {credit}
            </li>
          ))}
        </ul>
      </ScrollReveal>

      <section id="contact" className="scroll-mt-24 border-t border-border pt-12">
        <ScrollReveal>
          <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr]">
            <div className="space-y-6">
              <h2 className="type-h2 text-[2rem]">{contact.heading}</h2>
              <ul className="space-y-3 text-lg">
                <li>
                  <a
                    href={`mailto:${contact.email}`}
                    className="text-text hover:text-primary"
                  >
                    {contact.email}
                  </a>
                </li>
                <li>
                  <a
                    href={`tel:${contact.phone.replace(/\s+/g, "")}`}
                    className="text-text hover:text-primary"
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
                      className="text-text hover:text-primary"
                    >
                      {social.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <ContactForm
              email={contact.email}
              fields={contact.form_fields}
              submitLabel={contact.form_submit_label}
              successMessage={contact.form_success_message}
              services={site.services}
            />
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
