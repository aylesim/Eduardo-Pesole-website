import { getSite } from "@/lib/content";

export default function Footer() {
  const { global } = getSite();
  return (
    <footer className="site-footer">
      <p>{global.footer}</p>
    </footer>
  );
}
