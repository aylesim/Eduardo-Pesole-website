import Link from "next/link";

export default function NotFound() {
  return (
    <div className="page">
      <h1 className="page-title">Page not found</h1>
      <p>
        <Link href="/">Return home</Link>
      </p>
    </div>
  );
}
