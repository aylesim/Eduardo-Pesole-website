import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-24 md:px-8">
      <p className="font-meta mb-3 text-accent">404</p>
      <h1 className="mb-4 text-4xl">Page not found</h1>
      <p className="mb-8 text-muted">
        That route is gone or never existed. Try the Index or Works.
      </p>
      <div className="flex gap-5">
        <Link href="/" className="font-meta text-accent">
          Index
        </Link>
        <Link href="/works" className="font-meta text-muted hover:text-accent">
          Works
        </Link>
      </div>
    </div>
  );
}
