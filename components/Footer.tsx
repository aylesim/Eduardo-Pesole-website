import { getSite } from "@/lib/content";

export default function Footer() {
  const { global } = getSite();
  return (
    <footer className="mt-16 border-t border-line px-5 py-6 text-center text-sm text-muted">
      <p>{global.footer}</p>
    </footer>
  );
}
