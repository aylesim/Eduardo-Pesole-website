"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getNav, getSite } from "@/lib/content";

export default function Header() {
  const nav = getNav();
  const site = getSite();
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-base/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 md:px-8">
        <Link
          href="/"
          className="font-display text-sm font-bold tracking-[0.08em] uppercase no-underline hover:text-text"
        >
          {site.global.brand_name}
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
                  active ? "text-primary" : "text-muted hover:text-text"
                }`}
                aria-current={active ? "page" : undefined}
              >
                {item.label}
              </Link>
            );
          })}
          <Link
            href="/about#contact"
            className="hidden border border-primary/50 bg-primary px-3 py-1.5 font-mono text-[0.75rem] font-medium uppercase tracking-[0.08em] text-base no-underline hover:opacity-90 sm:inline-block"
          >
            {site.global.contact_cta}
          </Link>
        </nav>
      </div>
    </header>
  );
}
