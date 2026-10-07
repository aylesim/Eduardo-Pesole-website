import Link from "next/link";
import type { ContactContent } from "@/lib/types";

type FooterProps = {
  footer: string;
  mailLabel: string;
  contact: ContactContent;
};

export default function Footer({ footer, mailLabel, contact }: FooterProps) {
  return (
    <footer className="site-chrome border-border border-t">
      <div className="page-gutter mx-auto flex max-w-[1720px] flex-wrap items-end justify-between gap-8 py-8">
        <p className="font-meta">{footer}</p>
        <div className="flex flex-wrap gap-5">
          <Link
            href="/about#contacts"
            className="font-ui text-muted hover:text-accent"
          >
            {mailLabel}
          </Link>
          {contact.socials.map((social) => (
            <a
              key={social.url}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-ui text-muted hover:text-accent"
            >
              {social.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
