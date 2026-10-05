import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Embed from "@/components/Embed";
import PageShell from "@/components/PageShell";
import ProjectMeta from "@/components/ProjectMeta";
import {
  getProjectBySlug,
  getProjectCategory,
  getProjects,
} from "@/lib/content";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getProjects().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return { title: "Not found" };
  return {
    title: project.page_title.replace(/\s*\|\s*Eduardopesole\s*$/, ""),
    description:
      project.meta_description ||
      project.description?.slice(0, 160) ||
      `${project.display_title} — Eduardo Pesole`,
  };
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const category = getProjectCategory(project.slug);
  const videos = project.videos || [];
  const embeds = project.embeds || [];
  const images = project.images || [];
  const links = project.external_links || [];

  return (
    <PageShell>
      <h1 className="mb-6 text-3xl font-medium">{project.display_title}</h1>
      {project.subtitle ? (
        <p className="-mt-3 mb-6 text-muted">{project.subtitle}</p>
      ) : null}

      <ProjectMeta fields={project.fields} />

      {project.description ? (
        <div className="mb-8 whitespace-pre-wrap">{project.description}</div>
      ) : null}

      <div className="my-8 flex flex-col gap-6">
        {videos.map((v, i) => (
          <Embed
            key={`v-${i}`}
            url={v.url}
            kind="youtube"
            label={v.label || undefined}
          />
        ))}
        {embeds.map((e, i) => (
          <Embed key={`e-${i}`} url={e.url} kind={e.kind} title={e.title} />
        ))}
        {images.map((img, i) =>
          img.local ? (
            <Image
              key={`i-${i}`}
              src={img.local}
              alt={img.alt || project.display_title}
              width={img.width || 1200}
              height={img.height || 800}
              sizes="(max-width: 720px) 100vw, 720px"
              className="w-full"
            />
          ) : null,
        )}
      </div>

      {links.length > 0 ? (
        <ul className="mt-6 list-none space-y-1.5 p-0">
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} target="_blank" rel="noopener noreferrer">
                {l.text}
              </a>
            </li>
          ))}
        </ul>
      ) : null}

      <Link href="/s-projects-basic" className="mt-8 inline-block text-sm">
        ← Back to Portfolio
        {category ? ` (${category})` : ""}
      </Link>
    </PageShell>
  );
}
