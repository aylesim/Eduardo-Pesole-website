import Link from "next/link";

export default function NotFound() {
  return (
    <div className="editorial-page flex min-h-[100svh] flex-col justify-between pt-28">
      <p className="editorial-kicker">Error · 404</p>
      <div className="grid grid-cols-12 gap-5 py-20">
        <h1 className="type-sheet-title col-span-12 md:col-span-9">
          Page not
          <br />
          found
        </h1>
        <div className="col-span-12 space-y-8 md:col-span-3 md:self-end">
          <p className="type-body text-muted">
            That route is gone or never existed.
          </p>
          <div className="flex gap-6">
            <Link href="/" className="btn-text">
              Index →
            </Link>
            <Link href="/works" className="btn-text">
              Works →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
