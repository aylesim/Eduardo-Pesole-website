"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getNav } from "@/lib/content";

type SiteDockProps = {
  className?: string;
};

export default function SiteDock({ className = "" }: SiteDockProps) {
  const nav = getNav();
  const pathname = usePathname();

  return (
    <nav
      aria-label="Primary"
      className={`pointer-events-auto flex items-center gap-1 rounded-[var(--radius-dock)] border border-border/80 bg-surface/80 px-2 py-1.5 backdrop-blur-sm ${className}`}
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
            className={`rounded-[var(--radius-dock)] px-3 py-1.5 font-body text-[0.75rem] font-medium tracking-[0.06em] no-underline transition-colors duration-(--duration-fast) ease-(--ease-oxide) ${
              active
                ? "bg-accent text-accent-ink"
                : "text-muted hover:text-text"
            }`}
            aria-current={active ? "page" : undefined}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
