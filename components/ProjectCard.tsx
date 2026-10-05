import Image from "next/image";
import Link from "next/link";
import type { MediaImage } from "@/lib/types";

type ProjectCardProps = {
  image: MediaImage;
  href?: string;
  label?: string;
  fallbackAlt: string;
};

export default function ProjectCard({
  image,
  href,
  label,
  fallbackAlt,
}: ProjectCardProps) {
  if (!image.local) return null;

  const content = (
    <>
      <Image
        src={image.local}
        alt={image.alt || fallbackAlt}
        width={image.width || 800}
        height={image.height || 500}
        sizes="(max-width: 600px) 100vw, 300px"
        className="mb-2 aspect-[4/3] w-full bg-[#e8e8e4] object-cover"
      />
      {label ? <span className="block text-[0.95rem]">{label}</span> : null}
    </>
  );

  if (href) {
    return (
      <Link href={href} className="no-underline">
        {content}
      </Link>
    );
  }

  return <div>{content}</div>;
}
