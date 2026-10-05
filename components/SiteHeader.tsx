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
        isIndex
          ? "pointer-events-none h-[22svh] border-0"
          : "border-border bg-base/95 border-b backdrop-blur-sm"
      }`}
      style={
        isIndex
          ? {
              background:
                "linear-gradient(to bottom, #eeeeec 0%, rgba(238,238,236,.96) 42%, rgba(238,238,236,0) 100%)",
            }
          : undefined
      }
    >
      <div className="page-gutter pointer-events-auto mx-auto flex max-w-[1720px] items-center justify-between gap-4 py-4">
        <Link
          href="/"
          className="font-display text-[0.875rem] font-bold tracking-[-0.035em] no-underline"
        >
          {site.global.brand_name}
        </Link>

        <nav
          className="hidden items-center justify-end gap-7 md:flex"
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
                  active
                    ? "underline decoration-1 underline-offset-[7px] opacity-100"
                    : "opacity-60 hover:opacity-100"
                }`}
                aria-current={active ? "page" : undefined}
              >
                {item.label}
              </Link>
            );
          })}
          <Link
            href={mailHref}
            className="font-ui opacity-60 hover:opacity-100"
          >
            Mail
          </Link>
        </nav>

        <div className="flex justify-end md:hidden">
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
