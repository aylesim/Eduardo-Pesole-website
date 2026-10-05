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
    <div className="page-gutter mx-auto max-w-[1536px] py-14 md:py-20">
      <div className="mb-20 grid gap-12 lg:grid-cols-[2fr_3fr] lg:gap-16">
        <ScrollReveal className="lg:sticky lg:top-24 lg:self-start">
          <div id="showreel" className="scroll-mt-24 space-y-4">
            <p className="font-meta">Showreel 2025</p>
            <LiteYouTube
              url={global.showreel_video.url}
              title={global.showreel_video.aria_label}
              kind="youtube"
            />
          </div>
        </ScrollReveal>

        <ScrollReveal className="space-y-8">
          <h1 className="type-h2 max-w-[20ch]">{global.role_line}</h1>
          <ExpandableBio lead={about_lead} full={about_bio} />
        </ScrollReveal>
      </div>

      <ScrollReveal className="mb-20 space-y-4 border-t border-border pt-12">
        <h2 className="type-h2">Selected credits</h2>
        <p className="max-w-3xl font-ui text-muted">
          {global.credits.join(" · ")}
        </p>
      </ScrollReveal>

      <section id="contact" className="scroll-mt-24 border-t border-border pt-12">
        <ScrollReveal>
          <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr]">
            <div className="space-y-6">
              <h2 className="type-h2">{contact.heading}</h2>
              <ul className="space-y-3">
                <li>
                  <a
                    href={`mailto:${contact.email}`}
                    className="font-display text-[clamp(1.25rem,2.5vw,2rem)] font-semibold tracking-[-0.02em] text-text hover:text-accent"
                  >
                    {contact.email}
                  </a>
                </li>
                <li>
                  <a
                    href={`tel:${contact.phone.replace(/\s+/g, "")}`}
                    className="text-lg text-text hover:text-accent"
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
                      className="text-lg text-text hover:text-accent"
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
