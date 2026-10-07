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

  const meta = [work.type, work.location, work.role].filter(Boolean);

  return (
    <article className="editorial-page">
      <header className="grid grid-cols-12 gap-x-5 gap-y-8 pt-10 pb-16 md:pt-16 md:pb-24">
        <Link href="/works" className="btn-text col-span-6 md:col-span-3">
          ← All works
        </Link>
        <p className="font-meta col-span-6 text-right md:col-span-3 md:col-start-10">
          {work.year} · {work.categoryLabel}
        </p>

        <h1 className="type-sheet-title col-span-12 mt-6 md:col-span-10 md:col-start-3">
          {work.title}
        </h1>

        <div className="border-border col-span-12 space-y-4 border-t pt-5 md:col-span-4 md:col-start-3">
          <p className="font-meta leading-relaxed">{meta.join("  ·  ")}</p>
          {work.with.length > 0 ? (
            <p className="font-meta-value text-muted">
              With{" "}
              {work.with.map((c, i) => (
                <span key={c.name}>
                  {i > 0 ? ", " : null}
                  {c.url ? (
                    <a href={c.url} target="_blank" rel="noopener noreferrer">
                      {c.name}
                    </a>
                  ) : (
                    c.name
                  )}
                </span>
              ))}
            </p>
          ) : null}
        </div>

        <div className="col-span-12 md:col-span-5 md:col-start-8">
          {work.short ? <p className="type-lead">{work.short}</p> : null}
          {work.subtitle ? (
            <p className="type-body text-muted mt-5">{work.subtitle}</p>
          ) : null}
          {work.full ? (
            <div className="type-body text-muted mt-8 max-w-[60ch] space-y-5 whitespace-pre-wrap">
              {work.full.split(/\n\n+/).map((para) => (
                <p key={para.slice(0, 32)}>{para}</p>
              ))}
            </div>
          ) : null}
        </div>
      </header>

      <div className="grid grid-cols-12 gap-x-5 gap-y-8">
        {work.primaryVideo ? (
          <div className="col-span-12 md:col-span-10 md:col-start-2">
            <LiteYouTube
              url={work.primaryVideo.url}
              title={work.primaryVideo.label || work.title}
              poster={poster}
              kind="youtube"
            />
          </div>
        ) : work.soundcloud ? (
          <div className="col-span-12 md:col-span-8 md:col-start-3">
            <LiteYouTube
              url={work.soundcloud}
              title={work.title}
              kind="soundcloud"
            />
          </div>
        ) : null}

        {work.stills.length > 0 ? (
          <div className="col-span-12 mt-8 md:col-span-8 md:col-start-3">
            <MediaSwitch stills={work.stills} title={work.title} />
          </div>
        ) : !work.primaryVideo && !work.soundcloud && poster ? (
          <div className="bg-elevated relative col-span-12 aspect-video overflow-hidden md:col-span-10 md:col-start-2">
            <Image
              src={poster}
              alt={work.title}
              fill
              className="object-cover"
              style={{ objectPosition: work.focal }}
              sizes="(max-width: 768px) 100vw, 83vw"
              unoptimized={poster.startsWith("http")}
            />
          </div>
        ) : null}
      </div>

      {work.externalLinks.length > 0 ? (
        <ul className="border-border mt-12 flex flex-wrap gap-6 border-t pt-5">
          {work.externalLinks.map((link) => (
            <li key={link.url}>
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-ui"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      ) : null}

      <nav
        className="border-border mt-24 grid grid-cols-12 gap-5 border-t pt-8 md:mt-36"
        aria-label="Adjacent projects"
      >
        {prev ? (
          <Link
            href={`/works/${encodeURI(prev.slug)}`}
            className="group col-span-6 no-underline md:col-span-5"
          >
            <p className="font-display text-[clamp(1.5rem,3vw,3.5rem)] leading-none font-bold tracking-[-0.045em]">
              ← {prev.title}
            </p>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            href={`/works/${encodeURI(next.slug)}`}
            className="group col-span-6 text-right no-underline md:col-span-5 md:col-start-8"
          >
            <p className="font-display text-[clamp(1.5rem,3vw,3.5rem)] leading-none font-bold tracking-[-0.045em]">
              {next.title} →
            </p>
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </article>
  );
}
