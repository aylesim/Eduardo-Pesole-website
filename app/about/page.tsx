import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import ExpandableBio from "@/components/ExpandableBio";
import ScrollReveal from "@/components/ScrollReveal";
import ShowreelButton from "@/components/ShowreelButton";
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
        <p className="font-meta text-accent">About</p>
        <h1 className="max-w-3xl text-4xl md:text-5xl">
          {global.role_line}
        </h1>
        <ExpandableBio lead={about_lead} full={about_bio} />
        <ShowreelButton
          url={global.showreel_video.url}
          label={global.showreel_cta}
          ariaLabel={global.showreel_video.aria_label}
        />
      </ScrollReveal>

      <ScrollReveal className="mb-20 max-w-3xl space-y-4 border-t border-line pt-12">
        <h2 className="text-2xl">Selected studios & credits</h2>
        <p className="text-muted">
          Point Blank Games · 505 Games · Oneoone Games · Glitch Studios · Call
          and Response Studio · Barbican Centre · End of Nations · Nostro Hood
          System
        </p>
        <p className="font-meta text-accent-secondary/80">
          Drawn from existing bio text
        </p>
      </ScrollReveal>

      <section id="contact" className="scroll-mt-24 border-t border-line pt-12">
        <ScrollReveal>
          <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr]">
            <div className="space-y-6">
              <h2 className="text-3xl">{contact.heading}</h2>
              <ul className="space-y-3 text-lg">
                <li>
                  <a
                    href={`mailto:${contact.email}`}
                    className="text-ink hover:text-accent"
                  >
                    {contact.email}
                  </a>
                </li>
                <li>
                  <a
                    href={`tel:${contact.phone.replace(/\s+/g, "")}`}
                    className="text-ink hover:text-accent"
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
                      className="text-ink hover:text-accent"
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
            />
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
