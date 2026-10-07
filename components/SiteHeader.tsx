"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import HomeNote from "@/components/index-gallery/HomeNote";
import MobileNav from "@/components/MobileNav";
import type { NavItem } from "@/lib/types";

type SiteHeaderProps = {
  brandName: string;
  nav: NavItem[];
  contactsLabel: string;
  homeNote: string;
  homeShowreelLabel: string;
};

export default function SiteHeader({
  brandName,
  nav,
  contactsLabel,
  homeNote,
  homeShowreelLabel,
}: SiteHeaderProps) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const mailHref = "/about#contacts";
  const isIndex = pathname === "/";

  return (
    <>
      {isIndex ? null : (
        <div className="nav-gradient" aria-hidden="true">
          <div className="site-gradient" />
        </div>
      )}
      <header className="site-chrome pointer-events-none fixed inset-x-0 top-0 z-40 border-0">
        {isIndex ? (
          <div className="pointer-events-none absolute top-4 left-[clamp(18px,4vw,48px)]">
            <Link
              href="/"
              className="font-display pointer-events-auto text-[clamp(1.85rem,3.2vw,2.5rem)] leading-[0.92] font-extrabold tracking-[-0.05em] no-underline"
            >
              {brandName}
            </Link>
            <HomeNote
              className="mt-3"
              note={homeNote}
              showreelLabel={homeShowreelLabel}
            />
          </div>
        ) : null}

        <div className="page-gutter pointer-events-none mx-auto flex max-w-[1720px] items-center justify-between gap-4 py-4">
          {isIndex ? null : (
            <Link
              href="/"
              className="font-display pointer-events-auto text-[0.875rem] font-bold tracking-[-0.035em] no-underline"
            >
              {brandName}
            </Link>
          )}

          <nav
            className={`pointer-events-auto hidden items-center justify-end gap-7 md:flex ${
              isIndex ? "ml-auto" : ""
            }`}
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
                      ? "text-text underline decoration-1 underline-offset-[7px]"
                      : "text-text/45 hover:text-text"
                  }`}
                  aria-current={active ? "page" : undefined}
                >
                  {item.label}
                </Link>
              );
            })}
            <Link
              href={mailHref}
              className="font-ui text-text/45 hover:text-text"
            >
              {contactsLabel}
            </Link>
          </nav>

          <div
            className={`pointer-events-auto flex justify-end md:hidden ${
              isIndex ? "ml-auto" : ""
            }`}
          >
            <MobileNav
              open={menuOpen}
              onOpenChange={setMenuOpen}
              nav={nav}
              mailHref={mailHref}
              brandName={brandName}
              contactsLabel={contactsLabel}
            />
          </div>
        </div>
      </header>
    </>
  );
}
