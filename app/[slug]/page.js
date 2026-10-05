import Image from "next/image";
import Link from "next/link";
import Embed from "@/components/Embed";
import ProjectMeta from "@/components/ProjectMeta";
import {
  getProjectBySlug,
  getProjects,
  getProjectCategory,
} from "@/lib/content";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return getProjects().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
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

export default async function ProjectPage({ params }) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const category = getProjectCategory(project.slug);
  const videos = project.videos || [];
  const embeds = project.embeds || [];
  const images = project.images || [];
  const links = project.external_links || [];

  return (
    <div className="page">
      <h1 className="page-title">{project.display_title}</h1>
      {project.subtitle ? (
        <p className="project-subtitle">{project.subtitle}</p>
      ) : null}

      <ProjectMeta fields={project.fields} />

      {project.description ? (
        <div className="project-body">{project.description}</div>
      ) : null}

      <div className="project-media">
        {videos.map((v, i) => (
          <Embed
            key={`v-${i}`}
            url={v.url}
            kind="youtube"
            label={v.label || undefined}
          />
        ))}
        {embeds.map((e, i) => (
          <Embed
            key={`e-${i}`}
            url={e.url}
            kind={e.kind}
            title={e.title}
          />
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
            />
          ) : null
        )}
      </div>

      {links.length > 0 ? (
        <ul className="project-links">
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} target="_blank" rel="noopener noreferrer">
                {l.text}
              </a>
            </li>
          ))}
        </ul>
      ) : null}

      <Link href="/s-projects-basic" className="back-link">
        ← Back to Portfolio
        {category ? ` (${category})` : ""}
      </Link>
    </div>
  );
}
