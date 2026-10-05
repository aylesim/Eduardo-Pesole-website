import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import LiteYouTube from "@/components/LiteYouTube";
import MediaSwitch from "@/components/MediaSwitch";
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

  const meta = [
    work.type ? `TYPE · ${work.type}` : null,
    work.date || work.year ? `DATE · ${work.date || work.year}` : null,
    work.location ? `LOCATION · ${work.location}` : null,
    work.role ? `ROLE · ${work.role}` : null,
  ].filter(Boolean);

  return (
    <article className="page-gutter mx-auto max-w-[720px] py-14 md:py-20">
      <header className="mb-10 space-y-5">
        <Link href="/works" className="btn-text text-muted">
          ← Works
        </Link>
        <p className="font-meta leading-relaxed">
          {meta.join("  ·  ")}
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

      {work.short ? (
        <p className="type-body mb-10 text-text/90">{work.short}</p>
      ) : null}

      {work.primaryVideo ? (
        <div className="mb-12 rounded-md bg-elevated p-1">
          <LiteYouTube
            url={work.primaryVideo.url}
            title={work.primaryVideo.label || work.title}
            poster={poster}
            kind="youtube"
          />
        </div>
      ) : work.soundcloud ? (
        <div className="mb-12 rounded-md bg-elevated p-1">
          <LiteYouTube
            url={work.soundcloud}
            title={work.title}
            kind="soundcloud"
          />
        </div>
      ) : null}

      {work.stills.length > 0 ? (
        <div className="mb-10">
          <MediaSwitch stills={work.stills} title={work.title} />
        </div>
      ) : !work.primaryVideo && !work.soundcloud && poster ? (
        <div className="relative mb-12 aspect-video overflow-hidden rounded-md bg-elevated">
          <Image
            src={poster}
            alt={work.title}
            fill
            className="object-cover"
            style={{ objectPosition: work.focal }}
            sizes="(max-width: 768px) 100vw, 720px"
            unoptimized={poster.startsWith("http")}
          />
        </div>
      ) : null}

      {work.externalLinks.length > 0 ? (
        <ul className="mb-12 space-y-2">
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
      ) : null}

      <nav
        className="flex items-center justify-between gap-4 border-t border-border pt-8"
        aria-label="Adjacent projects"
      >
        {prev ? (
          <Link
            href={`/works/${encodeURI(prev.slug)}`}
            className="group max-w-[40%] no-underline"
          >
            <p className="font-meta mb-1 group-hover:text-accent">← Prev</p>
            <p className="text-text">{prev.title}</p>
          </Link>
        ) : (
          <span />
        )}
        <Link href="/works" className="btn-text text-muted">
          All works
        </Link>
        {next ? (
          <Link
            href={`/works/${encodeURI(next.slug)}`}
            className="group max-w-[40%] text-right no-underline"
          >
            <p className="font-meta mb-1 group-hover:text-accent">Next →</p>
            <p className="text-text">{next.title}</p>
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </article>
  );
}
