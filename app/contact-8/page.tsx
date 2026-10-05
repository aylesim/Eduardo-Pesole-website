import type { Metadata } from "next";
import Image from "next/image";
import ContactForm from "@/components/ContactForm";
import PageShell from "@/components/PageShell";
import { getSite } from "@/lib/content";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Eduardo Pesole.",
};

const SOCIAL_ICONS: Record<string, string> = {
  LinkedIn: "/images/11062b_7cf73902d06c4f3685c379a21c6c8285-mv2.png",
  Instagram: "/images/11062b_55e4be1e75564866b6c28290f9a9d271-mv2.png",
};

export default function ContactPage() {
  const { contact } = getSite();

  return (
    <PageShell>
      <h1 className="mb-6 text-3xl font-medium">{contact.heading}</h1>

      <div className="mb-8 space-y-1.5">
        <p>
          <a href={`tel:${contact.phone.replace(/\s/g, "")}`}>
            {contact.phone}
          </a>
        </p>
        <p>
          <a href={`mailto:${contact.email}`}>{contact.email}</a>
        </p>
      </div>

      <ul className="mb-8 flex list-none items-center gap-4 p-0">
        {contact.socials.map((s) => (
          <li key={s.label}>
            <a href={s.url} target="_blank" rel="noopener noreferrer">
              {SOCIAL_ICONS[s.label] ? (
                <Image
                  src={SOCIAL_ICONS[s.label]}
                  alt={s.label}
                  width={28}
                  height={28}
                />
              ) : (
                s.label
              )}
            </a>
          </li>
        ))}
      </ul>

      <ContactForm
        email={contact.email}
        fields={contact.form_fields}
        submitLabel={contact.form_submit_label}
        successMessage={contact.form_success_message}
      />
    </PageShell>
  );
}
