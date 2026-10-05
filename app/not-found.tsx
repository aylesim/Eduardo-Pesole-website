import Link from "next/link";

export default function NotFound() {
  return (
    <div className="page-gutter mx-auto max-w-3xl py-24">
      <p className="font-meta mb-3 text-accent">404</p>
      <h1 className="type-h2 mb-4">Page not found</h1>
      <p className="mb-8 type-body text-muted">
        That route is gone or never existed. Try the Index or Works.
      </p>
      <div className="flex gap-5">
        <Link href="/" className="btn-text text-accent">
          Index
        </Link>
        <Link href="/works" className="btn-text text-muted">
          Works
        </Link>
      </div>
    </div>
  );
}
