import Link from "next/link";
import { getSite } from "@/lib/content";

export default function Footer() {
  const site = getSite();
  return (
    <footer className="mt-20 border-t border-border">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-8 md:flex-row md:items-center md:justify-between md:px-8">
        <p className="font-meta">{site.global.footer}</p>
        <div className="flex flex-wrap gap-5">
          <Link href="/works" className="font-meta text-muted hover:text-primary">
            Works
          </Link>
          <Link
            href="/services"
            className="font-meta text-muted hover:text-primary"
          >
            Services
          </Link>
          <Link
            href="/about#contact"
            className="font-meta text-muted hover:text-primary"
          >
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
}
