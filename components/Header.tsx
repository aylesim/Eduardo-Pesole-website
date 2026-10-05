"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getNav, getSite } from "@/lib/content";

export default function Header() {
  const nav = getNav();
  const site = getSite();
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-base/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 md:px-8">
        <Link
          href="/"
          className="font-display text-sm font-semibold tracking-[0.08em] uppercase no-underline hover:text-ink"
        >
          Eduardo Pesole
        </Link>
        <nav className="flex flex-wrap items-center gap-4 md:gap-7" aria-label="Main">
          {nav.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`font-meta no-underline transition-colors ${
                  active ? "text-accent" : "text-muted hover:text-ink"
                }`}
                aria-current={active ? "page" : undefined}
              >
                {item.label}
              </Link>
            );
          })}
          <Link
            href="/about#contact"
            className="hidden rounded-sm border border-accent/40 px-3 py-1.5 font-meta text-accent no-underline hover:bg-accent hover:text-base sm:inline-block"
          >
            {site.global.contact_cta}
          </Link>
        </nav>
      </div>
    </header>
  );
}
