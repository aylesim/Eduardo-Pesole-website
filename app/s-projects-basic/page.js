import Link from "next/link";
import { getPortfolio } from "@/lib/content";

export const metadata = {
  title: "Portfolio",
  description: "Games, Art Collabs, Movies and Music by Eduardo Pesole.",
};

export default function PortfolioPage() {
  const portfolio = getPortfolio();

  return (
    <div className="page">
      <h1 className="page-title">Portfolio</h1>
      {portfolio.map((group) => (
        <section key={group.category} className="portfolio-category">
          <h2>{group.category}</h2>
          <ul className="portfolio-list">
            {group.items.map((item) => (
              <li key={item.url || item.slug || item.title}>
                {item.external ? (
                  <a href={item.url} target="_blank" rel="noopener noreferrer">
                    {item.title}
                  </a>
                ) : (
                  <Link href={`/${item.slug}`}>{item.title}</Link>
                )}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
