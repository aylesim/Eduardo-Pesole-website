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

  return (
    <article className="mx-auto max-w-5xl px-5 py-14 md:px-8 md:py-20">
      <ScrollReveal>
        <header className="mb-10 space-y-4">
          <p className="font-meta">
            {[work.year, work.categoryLabel].filter(Boolean).join(" · ")}
          </p>
          <h1 className="type-sheet-title text-text">{work.title}</h1>
          {work.subtitle ? (
            <p className="text-lg text-muted italic">{work.subtitle}</p>
          ) : null}
          <dl className="grid gap-3 sm:grid-cols-2">
            {work.type ? (
              <div>
                <dt className="font-meta">Type</dt>
                <dd className="font-meta-value">{work.type}</dd>
              </div>
            ) : null}
            {work.date ? (
              <div>
                <dt className="font-meta">Date</dt>
                <dd className="font-meta-value">{work.date}</dd>
              </div>
            ) : null}
            {work.location ? (
              <div>
                <dt className="font-meta">Location</dt>
                <dd className="font-meta-value">{work.location}</dd>
              </div>
            ) : null}
            {work.role ? (
              <div>
                <dt className="font-meta">Role</dt>
                <dd className="font-meta-value">{work.role}</dd>
              </div>
            ) : null}
            {work.with.length > 0 ? (
              <div className="sm:col-span-2">
                <dt className="font-meta">With</dt>
                <dd className="font-meta-value">
                  {work.with.map((c, i) => (
                    <span key={c.name}>
                      {i > 0 ? ", " : null}
                      {c.url ? (
                        <a
                          href={c.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-text hover:text-primary"
                        >
                          {c.name}
                        </a>
                      ) : (
                        c.name
                      )}
                    </span>
                  ))}
                </dd>
              </div>
            ) : null}
          </dl>
        </header>
      </ScrollReveal>

      {work.short ? (
        <ScrollReveal className="mb-10">
          <p className="type-body text-text/90">{work.short}</p>
        </ScrollReveal>
      ) : null}

      {work.primaryVideo ? (
        <ScrollReveal className="mb-12 rounded-sm bg-surface-elevated p-1">
          <LiteYouTube
            url={work.primaryVideo.url}
            title={work.primaryVideo.label || work.title}
            poster={poster?.startsWith("http") ? poster : poster}
            kind="youtube"
          />
        </ScrollReveal>
      ) : work.soundcloud ? (
        <ScrollReveal className="mb-12 rounded-sm bg-surface-elevated p-1">
          <LiteYouTube
            url={work.soundcloud}
            title={work.title}
            kind="soundcloud"
          />
        </ScrollReveal>
      ) : null}

      {work.stills.length > 0 || poster ? (
        <ScrollReveal className="mb-10">
          <h2 className="font-meta mb-4">Stills</h2>
          <MediaSwitch
            stills={work.stills}
            fallbackPoster={work.stills.length === 0 ? poster : null}
            title={work.title}
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
                  className="font-mono text-[0.75rem] font-medium uppercase tracking-[0.08em] text-primary"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </ScrollReveal>
      ) : null}

      {!work.primaryVideo && !work.soundcloud && poster ? (
        <ScrollReveal className="relative mb-12 aspect-video overflow-hidden rounded-sm bg-surface-elevated">
          <Image
            src={poster}
            alt={work.title}
            fill
            className="object-cover"
            style={{ objectPosition: work.focal }}
            sizes="(max-width: 768px) 100vw, 900px"
            unoptimized={poster.startsWith("http")}
          />
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
            <p className="font-meta mb-1 group-hover:text-primary">← Prev</p>
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
            <p className="font-meta mb-1 group-hover:text-primary">Next →</p>
            <p className="text-text">{next.title}</p>
          </Link>
        ) : null}
      </nav>
    </article>
  );
}
