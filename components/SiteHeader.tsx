"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import MobileNav from "@/components/MobileNav";
import { getNav, getSite } from "@/lib/content";

export default function SiteHeader() {
  const nav = getNav();
  const site = getSite();
  const pathname = usePathname();
  const [opaque, setOpaque] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const mailHref = `mailto:${site.contact.email}`;

  useEffect(() => {
    function onScroll() {
      setOpaque(window.scrollY > 24);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 transition-colors duration-(--duration-fast) ease-(--ease-oxide) ${
        opaque ? "border-b border-border bg-surface" : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="page-gutter mx-auto flex max-w-[1536px] items-center justify-between gap-4 py-4">
        <Link
          href="/"
          className="font-display text-sm font-semibold tracking-[-0.02em] no-underline hover:text-text"
        >
          {site.global.brand_name}
        </Link>

        <nav
          className="hidden items-center gap-7 md:flex"
          aria-label="Main"
        >
          {nav.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`font-ui no-underline transition-colors ${
                  active ? "text-text" : "text-muted hover:text-text"
                }`}
                aria-current={active ? "page" : undefined}
              >
                {item.label}
              </Link>
            );
          })}
          <a href={mailHref} className="btn-text text-muted hover:text-accent">
            Mail
          </a>
        </nav>

        <MobileNav
          open={menuOpen}
          onOpenChange={setMenuOpen}
          nav={nav}
          mailHref={mailHref}
        />
      </div>
    </header>
  );
}
