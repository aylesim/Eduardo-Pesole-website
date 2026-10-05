import Link from "next/link";
import { getSite } from "@/lib/content";

export default function Footer() {
  const site = getSite();
  return (
    <footer className="mt-20 border-t border-border">
      <div className="page-gutter mx-auto flex max-w-[1536px] flex-col gap-4 py-8 md:flex-row md:items-center md:justify-between">
        <p className="font-meta">{site.global.footer}</p>
        <div className="flex flex-wrap gap-5">
          <Link href="/works" className="font-ui text-muted hover:text-accent">
            Works
          </Link>
          <Link
            href="/services"
            className="font-ui text-muted hover:text-accent"
          >
            Services
          </Link>
          <Link
            href="/about#contact"
            className="font-ui text-muted hover:text-accent"
          >
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
}
