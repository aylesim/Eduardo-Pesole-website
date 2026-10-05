export default function ProjectMeta({ fields }) {
  if (!fields || !Object.keys(fields).length) return null;
  return (
    <dl className="project-meta">
      {Object.entries(fields).map(([key, value]) => (
        <div key={key} className="project-meta-row">
          <dt>{key}:</dt>
          <dd>{value}</dd>
        </div>
      ))}
    </dl>
  );
}
