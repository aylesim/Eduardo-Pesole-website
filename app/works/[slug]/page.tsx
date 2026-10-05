import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import LiteYouTube from "@/components/LiteYouTube";
import MediaSwitch from "@/components/MediaSwitch";
import ScrollReveal from "@/components/ScrollReveal";
import {
  getAdjacentWorks,
  getInternalWorks,
  getWorkBySlug,
  plateSrc,
} from "@/lib/content";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getInternalWorks().map((work) => ({
    slug: work.slug,
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const work = getWorkBySlug(slug);
  if (!work || work.externalUrl) return {};
  return {
    title: `${work.title}${work.year ? ` (${work.year})` : ""}`,
    description: work.short || undefined,
  };
}

export default async function ProjectSheetPage({ params }: PageProps) {
  const { slug } = await params;
  const work = getWorkBySlug(slug);
  if (!work || work.externalUrl) notFound();

  const { prev, next } = getAdjacentWorks(work.slug);
  const poster = plateSrc(work);

  const metaParts = [
    work.type ? `TYPE · ${work.type}` : null,
    work.year || work.date ? `YEAR · ${work.year || work.date}` : null,
    work.location ? `LOCATION · ${work.location}` : null,
    work.role ? `ROLE · ${work.role}` : null,
  ].filter(Boolean);

  return (
    <article className="page-gutter mx-auto max-w-[720px] py-14 md:py-20">
      <ScrollReveal>
        <header className="mb-10 space-y-5">
          <Link href="/works" className="btn-text text-muted">
            ← Works
          </Link>
          <p className="font-meta leading-relaxed">
            {metaParts.join("  ·  ")}
            {work.with.length > 0 ? (
              <>
                {"  ·  WITH · "}
                {work.with.map((c, i) => (
                  <span key={c.name}>
                    {i > 0 ? ", " : null}
                    {c.url ? (
                      <a
                        href={c.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted hover:text-accent"
                      >
                        {c.name}
                      </a>
                    ) : (
                      c.name
                    )}
                  </span>
                ))}
              </>
            ) : null}
          </p>
          <h1 className="type-sheet-title text-text">{work.title}</h1>
          {work.subtitle ? (
            <p className="text-lg text-muted italic">{work.subtitle}</p>
          ) : null}
        </header>
      </ScrollReveal>

      {work.short ? (
        <ScrollReveal className="mb-10">
          <p className="type-body text-text/90">{work.short}</p>
        </ScrollReveal>
      ) : null}

      {work.primaryVideo ? (
        <ScrollReveal className="mb-12 rounded-md bg-elevated p-1">
          <LiteYouTube
            url={work.primaryVideo.url}
            title={work.primaryVideo.label || work.title}
            poster={poster}
            kind="youtube"
          />
        </ScrollReveal>
      ) : work.soundcloud ? (
        <ScrollReveal className="mb-12 rounded-md bg-elevated p-1">
          <LiteYouTube
            url={work.soundcloud}
            title={work.title}
            kind="soundcloud"
          />
        </ScrollReveal>
      ) : null}

      {work.stills.length > 0 ? (
        <ScrollReveal className="mb-10">
          <MediaSwitch stills={work.stills} title={work.title} />
        </ScrollReveal>
      ) : !work.primaryVideo && !work.soundcloud && poster ? (
        <ScrollReveal className="relative mb-12 aspect-video overflow-hidden rounded-md bg-elevated">
          <Image
            src={poster}
            alt={work.title}
            fill
            className="object-cover"
            style={{ objectPosition: work.focal }}
            sizes="(max-width: 768px) 100vw, 720px"
            unoptimized={poster.startsWith("http")}
          />
        </ScrollReveal>
      ) : null}

      {work.externalLinks.length > 0 ? (
        <ScrollReveal className="mb-12">
          <ul className="space-y-2">
            {work.externalLinks.map((link) => (
              <li key={link.url}>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-ui text-accent"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </ScrollReveal>
      ) : null}

      <nav
        className="flex items-center justify-between gap-4 border-t border-border pt-8"
        aria-label="Adjacent projects"
      >
        {prev ? (
          <Link
            href={`/works/${encodeURI(prev.slug)}`}
            className="group max-w-[45%] no-underline"
          >
            <p className="font-meta mb-1 group-hover:text-accent">← Prev</p>
            <p className="text-text">{prev.title}</p>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            href={`/works/${encodeURI(next.slug)}`}
            className="group max-w-[45%] text-right no-underline"
          >
            <p className="font-meta mb-1 group-hover:text-accent">Next →</p>
            <p className="text-text">{next.title}</p>
          </Link>
        ) : null}
      </nav>
    </article>
  );
}
