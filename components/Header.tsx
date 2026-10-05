import Link from "next/link";
import { getNav } from "@/lib/content";

export default function Header() {
  const nav = getNav();
  return (
    <header className="sticky top-0 z-10 border-b border-line bg-page">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-5 py-3.5">
        <Link
          href="/"
          className="font-semibold tracking-wide lowercase no-underline"
        >
          eduardopesole
        </Link>
        <nav className="flex flex-wrap gap-5" aria-label="Main">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-[0.95rem] no-underline hover:underline"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
