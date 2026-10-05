import Link from "next/link";
import { getSite } from "@/lib/content";

export default function Footer() {
  const site = getSite();
  return (
    <footer className="site-chrome border-t border-border">
      <div className="page-gutter mx-auto grid max-w-[1720px] gap-8 py-8 md:grid-cols-12 md:items-end">
        <p className="font-meta md:col-span-4">{site.global.footer}</p>
        <p className="font-meta md:col-span-4">Sound designer · Sound artist</p>
        <div className="flex flex-wrap gap-5 md:col-span-4 md:justify-end">
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
