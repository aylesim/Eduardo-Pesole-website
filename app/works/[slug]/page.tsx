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

  return (
    <article className="mx-auto max-w-5xl px-5 py-14 md:px-8 md:py-20">
      <ScrollReveal>
        <header className="mb-10 space-y-4">
          <p className="font-meta text-accent-secondary">
            {work.categoryLabel}
            {work.year ? ` · ${work.year}` : ""}
          </p>
          <h1 className="text-4xl leading-tight md:text-5xl">{work.title}</h1>
          {work.subtitle ? (
            <p className="text-muted">{work.subtitle}</p>
          ) : null}
          <div className="flex flex-wrap gap-x-8 gap-y-2 font-meta">
            {work.role ? (
              <p>
                <span className="text-muted">Role </span>
                {work.role}
              </p>
            ) : null}
            {work.collaborators.length > 0 ? (
              <p>
                <span className="text-muted">With </span>
                {work.collaborators.join(", ")}
              </p>
            ) : null}
            {work.location ? (
              <p>
                <span className="text-muted">Location </span>
                {work.location}
              </p>
            ) : null}
          </div>
        </header>
      </ScrollReveal>

      {work.short ? (
        <ScrollReveal className="mb-10 max-w-3xl">
          <p className="text-lg leading-relaxed text-ink/90">{work.short}</p>
          {work.shortIsInterim ? (
            <p className="font-meta mt-3 text-accent-secondary/80">
              Interim short copy
            </p>
          ) : null}
        </ScrollReveal>
      ) : null}

      {work.primaryVideo ? (
        <ScrollReveal className="mb-12">
          <LiteYouTube
            url={work.primaryVideo.url}
            title={work.primaryVideo.label || work.title}
            poster={
              work.poster?.startsWith("http") ? work.poster : work.poster
            }
            kind={work.primaryVideo.kind}
          />
        </ScrollReveal>
      ) : work.poster ? (
        <ScrollReveal className="relative mb-12 aspect-video overflow-hidden rounded-sm bg-surface">
          <Image
            src={work.poster}
            alt={work.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 900px"
            unoptimized={work.poster.startsWith("http")}
          />
        </ScrollReveal>
      ) : null}

      {work.stills.length > 0 || work.poster ? (
        <ScrollReveal className="mb-16">
          <h2 className="font-meta mb-4">Stills</h2>
          <MediaSwitch
            stills={work.stills}
            fallbackPoster={work.stills.length === 0 ? work.poster : null}
            title={work.title}
          />
        </ScrollReveal>
      ) : null}

      <nav
        className="flex items-center justify-between gap-4 border-t border-line pt-8"
        aria-label="Adjacent projects"
      >
        {prev ? (
          <Link
            href={`/works/${encodeURI(prev.slug)}`}
            className="group max-w-[45%] no-underline"
          >
            <p className="font-meta mb-1 text-muted group-hover:text-accent">
              Prev
            </p>
            <p className="text-ink">{prev.title}</p>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            href={`/works/${encodeURI(next.slug)}`}
            className="group max-w-[45%] text-right no-underline"
          >
            <p className="font-meta mb-1 text-muted group-hover:text-accent">
              Next
            </p>
            <p className="text-ink">{next.title}</p>
          </Link>
        ) : null}
      </nav>
    </article>
  );
}
