import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import WorkMediaBlock from "@/components/WorkMediaBlock";
import {
  getAdjacentWorks,
  getInternalWorks,
  getWorkBySlug,
  plateSrc,
} from "@/lib/content";
import { mediaItemKey, workCardFocal } from "@/lib/work-media";
import type { WorkItem, WorkMediaItem } from "@/lib/types";

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
  const prevWork = prev && prev.slug !== work.slug ? prev : null;
  const nextWork =
    next && next.slug !== work.slug && next.slug !== prevWork?.slug
      ? next
      : null;

  const facts = sheetFacts(work);
  const paragraphs = work.full
    .split(/\n\n+/)
    .map((para) => para.trim())
    .filter(Boolean);
  const hasAside =
    facts.length > 0 ||
    work.with.length > 0 ||
    work.externalLinks.length > 0;
  const hasCopy = Boolean(work.short) || paragraphs.length > 0;
  const hero = work.primaryMedia ?? work.media[0] ?? null;
  const gallery = work.primaryMedia ? work.media : work.media.slice(1);

  const kicker = [work.year, work.categoryLabel].filter(Boolean).join(" · ");

  return (
    <article className="editorial-page">
      <header className="sheet-top">
        <Link href="/works" className="btn-text">
          ← All works
        </Link>
        {kicker ? <p className="font-meta">{kicker}</p> : null}
      </header>

      <div className={hasAside ? "sheet-layout" : "sheet-layout sheet-layout--solo"}>
        <h1 className="sheet-title">{work.title}</h1>
        {work.subtitle ? (
          <p className="sheet-subtitle">{work.subtitle}</p>
        ) : null}

        {hero ? (
          <div className="sheet-stage">
            <WorkMediaBlock
              item={hero}
              title={work.title}
              poster={poster}
              priority
            />
          </div>
        ) : null}

        {hasAside ? (
          <aside className="sheet-aside" aria-label="Project details">
            {facts.length > 0 ? (
              <dl className="sheet-facts">
                {facts.map((fact) => (
                  <div key={fact.label}>
                    <dt className="font-meta">{fact.label}</dt>
                    <dd className="sheet-fact-value">{fact.value}</dd>
                  </div>
                ))}
              </dl>
            ) : null}

            {work.with.length > 0 ? (
              <p className="sheet-with">
                <span className="font-meta">With</span>
                <span className="sheet-fact-value">
                  {work.with.map((c, i) => (
                    <span key={c.name}>
                      {i > 0 ? ", " : null}
                      {c.url ? (
                        <a
                          href={c.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {c.name}
                        </a>
                      ) : (
                        c.name
                      )}
                    </span>
                  ))}
                </span>
              </p>
            ) : null}

            {work.externalLinks.length > 0 ? (
              <ul className="sheet-links">
                {work.externalLinks.map((link, i) => (
                  <li key={link.url}>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`contact-chip ${i % 2 === 0 ? "contact-chip--tilt-a" : "contact-chip--tilt-b"}`}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </aside>
        ) : null}

        {hasCopy ? (
          <div className="sheet-copy">
            {work.short ? <p className="sheet-lead">{work.short}</p> : null}
            {paragraphs.length > 0 ? (
              <div className="sheet-prose">
                {paragraphs.map((para) => (
                  <p key={para.slice(0, 48)}>{para}</p>
                ))}
              </div>
            ) : null}
          </div>
        ) : null}
      </div>

      {gallery.length > 0 ? (
        <div className="sheet-gallery">
          {groupGallery(gallery).map((group) =>
            group.kind === "images" ? (
              <div
                key={mediaItemKey(group.items[0]!.item, group.items[0]!.index)}
                className="sheet-gallery-images"
              >
                {group.items.map(({ item, index }) => (
                  <WorkMediaBlock
                    key={mediaItemKey(item, index)}
                    item={item}
                    title={work.title}
                  />
                ))}
              </div>
            ) : (
              group.items.map(({ item, index }) => (
                <WorkMediaBlock
                  key={mediaItemKey(item, index)}
                  item={item}
                  title={work.title}
                />
              ))
            ),
          )}
        </div>
      ) : null}

      {prevWork || nextWork ? (
        <nav className="sheet-pager" aria-label="Adjacent projects">
          {prevWork ? (
            <PagerLink work={prevWork} label="Previous" align="start" />
          ) : (
            <span />
          )}
          {nextWork ? (
            <PagerLink work={nextWork} label="Next" align="end" />
          ) : null}
        </nav>
      ) : null}
    </article>
  );
}

function PagerLink({
  work,
  label,
  align,
}: {
  work: WorkItem;
  label: string;
  align: "start" | "end";
}) {
  const src = plateSrc(work);
  const focal = workCardFocal(work);
  return (
    <Link
      href={`/works/${encodeURI(work.slug)}`}
      className={`sheet-pager-link${align === "end" ? " sheet-pager-link--end" : ""}`}
    >
      <span className="font-meta">{label}</span>
      {src ? (
        <span className="sheet-pager-thumb">
          <Image
            src={src}
            alt=""
            fill
            className="object-cover"
            style={{ objectPosition: focal }}
            sizes="(max-width: 768px) 100vw, 40vw"
            unoptimized={src.startsWith("http")}
          />
        </span>
      ) : null}
      <span className="sheet-pager-title">{work.title}</span>
    </Link>
  );
}

function groupGallery(items: WorkMediaItem[]): {
  kind: "images" | "embed";
  items: { item: WorkMediaItem; index: number }[];
}[] {
  const groups: {
    kind: "images" | "embed";
    items: { item: WorkMediaItem; index: number }[];
  }[] = [];

  items.forEach((item, index) => {
    const kind = item.kind === "image" ? "images" : "embed";
    const last = groups[groups.length - 1];
    if (last?.kind === "images" && kind === "images") {
      last.items.push({ item, index });
      return;
    }
    groups.push({ kind, items: [{ item, index }] });
  });

  return groups;
}

function sheetFacts(work: WorkItem): { label: string; value: string }[] {
  const facts: { label: string; value: string }[] = [];
  if (work.role) facts.push({ label: "Role", value: work.role });
  if (work.type) facts.push({ label: "Type", value: work.type });
  if (work.location) facts.push({ label: "Place", value: work.location });
  if (work.date && work.date !== work.year) {
    facts.push({ label: "Date", value: work.date });
  }
  return facts;
}
