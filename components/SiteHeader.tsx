"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import MobileNav from "@/components/MobileNav";
import { getNav, getSite } from "@/lib/content";

export default function SiteHeader() {
  const nav = getNav();
  const site = getSite();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const mailHref = "/about#contact";
  const isIndex = pathname === "/";

  return (
    <header
      className={`site-chrome fixed inset-x-0 top-0 z-40 ${
        isIndex ? "bg-transparent" : "border-b border-border bg-base/95 backdrop-blur-sm"
      }`}
    >
      <div className="page-gutter mx-auto grid max-w-[1720px] grid-cols-2 items-center gap-4 py-[18px] md:grid-cols-12">
        <Link
          href="/"
          className="font-display text-[0.875rem] font-bold tracking-[-0.035em] no-underline md:col-span-3"
        >
          {site.global.brand_name}
        </Link>

        <p className="editorial-kicker hidden md:col-span-3 md:block">
          Sound design · Berlin
        </p>

        <nav
          className="hidden items-center justify-end gap-7 md:col-span-6 md:flex"
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
                className={`font-ui no-underline ${
                  active ? "opacity-100" : "opacity-45 hover:opacity-100"
                }`}
                aria-current={active ? "page" : undefined}
              >
                {item.label}
              </Link>
            );
          })}
          <Link
            href={mailHref}
            className="font-ui opacity-45 hover:opacity-100"
          >
            Mail
          </Link>
        </nav>

        <div className="md:hidden">
          <MobileNav
            open={menuOpen}
            onOpenChange={setMenuOpen}
            nav={nav}
            mailHref={mailHref}
          />
        </div>
      </div>
    </header>
  );
}
