import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import { getPortfolio } from "@/lib/content";

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Games, Art Collabs, Movies and Music by Eduardo Pesole.",
};

export default function PortfolioPage() {
  const portfolio = getPortfolio();

  return (
    <PageShell>
      <h1 className="mb-6 text-3xl font-medium">Portfolio</h1>
      {portfolio.map((group) => (
        <section key={group.category} className="mb-10">
          <h2 className="mb-3 text-base font-semibold tracking-wider uppercase">
            {group.category}
          </h2>
          <ul className="list-none space-y-1.5 p-0">
            {group.items.map((item) => (
              <li key={item.url || item.slug || item.title}>
                {item.external ? (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="no-underline hover:underline"
                  >
                    {item.title}
                  </a>
                ) : (
                  <Link
                    href={`/${item.slug}`}
                    className="no-underline hover:underline"
                  >
                    {item.title}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </PageShell>
  );
}
