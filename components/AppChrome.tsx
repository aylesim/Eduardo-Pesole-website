"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import Footer from "@/components/Footer";
import SiteHeader from "@/components/SiteHeader";
import SmoothScroll from "@/components/SmoothScroll";

export default function AppChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isIndex = pathname === "/";

  return (
    <SmoothScroll enabled={!isIndex}>
      {isIndex ? null : <SiteHeader />}
      <main className={isIndex ? "" : "min-h-[70vh]"}>{children}</main>
      {isIndex ? null : <Footer />}
    </SmoothScroll>
  );
}
