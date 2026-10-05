import Link from "next/link";
import PageShell from "@/components/PageShell";

export default function NotFound() {
  return (
    <PageShell>
      <h1 className="mb-6 text-3xl font-medium">Page not found</h1>
      <p>
        <Link href="/">Return home</Link>
      </p>
    </PageShell>
  );
}
