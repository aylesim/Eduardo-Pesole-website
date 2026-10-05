"use client";

import * as Dialog from "@radix-ui/react-dialog";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavItem } from "@/lib/types";

type MobileNavProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  nav: NavItem[];
  mailHref: string;
};

export default function MobileNav({
  open,
  onOpenChange,
  nav,
  mailHref,
}: MobileNavProps) {
  const pathname = usePathname();

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Trigger asChild>
        <button type="button" className="btn-text justify-self-end" aria-label="Open menu">
          Menu
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-text/10" />
        <Dialog.Content className="page-gutter fixed inset-0 z-50 flex flex-col bg-base outline-none">
          <div className="flex items-center justify-between py-[18px]">
            <Dialog.Title className="sr-only">Navigation</Dialog.Title>
            <Dialog.Description className="sr-only">
              Site navigation links
            </Dialog.Description>
            <span className="font-display text-sm font-bold tracking-[-0.035em]">
              Eduardo Pesole
            </span>
            <Dialog.Close asChild>
              <button type="button" className="btn-text">
                Close
              </button>
            </Dialog.Close>
          </div>
          <nav
            className="flex flex-1 flex-col justify-center gap-1 pb-16"
            aria-label="Mobile"
          >
            {nav.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              return (
                <Dialog.Close asChild key={item.href}>
                  <Link
                    href={item.href}
                    className={`font-display text-[clamp(3rem,15vw,5rem)] font-extrabold leading-[0.9] tracking-[-0.055em] no-underline ${
                      active
                        ? "text-text"
                        : "text-text/30 hover:text-text"
                    }`}
                    aria-current={active ? "page" : undefined}
                  >
                    {item.label}
                  </Link>
                </Dialog.Close>
              );
            })}
            <Dialog.Close asChild>
              <Link
                href={mailHref}
                className="mt-8 font-mono text-xs font-medium tracking-[0.13em] text-text uppercase no-underline"
              >
                Mail
              </Link>
            </Dialog.Close>
          </nav>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
