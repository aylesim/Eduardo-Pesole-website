type ProjectMetaProps = {
  fields: Record<string, string>;
};

export default function ProjectMeta({ fields }: ProjectMetaProps) {
  if (!fields || !Object.keys(fields).length) return null;
  return (
    <dl className="mb-8">
      {Object.entries(fields).map(([key, value]) => (
        <div
          key={key}
          className="mb-2 grid gap-1 sm:grid-cols-[minmax(7rem,9rem)_1fr] sm:gap-x-4"
        >
          <dt className="text-xs font-semibold tracking-wide text-muted uppercase">
            {key}:
          </dt>
          <dd className="m-0">{value}</dd>
        </div>
      ))}
    </dl>
  );
}
