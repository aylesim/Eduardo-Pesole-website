import Link from "next/link";
import { getSite } from "@/lib/content";

export default function Footer() {
  const site = getSite();
  return (
    <footer className="site-chrome mt-20 border-t border-border">
      <div className="page-gutter mx-auto flex max-w-[1536px] flex-col gap-5 py-8 md:flex-row md:items-center md:justify-between">
        <p className="font-meta">{site.global.footer}</p>
        <div className="flex flex-wrap gap-5">
          <Link href="/about#contact" className="font-ui text-muted hover:text-accent">
            Mail
          </Link>
          {site.contact.socials.map((social) => (
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
