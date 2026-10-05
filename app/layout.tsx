import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { instrument, syne } from "@/app/fonts";
import AppChrome from "@/components/AppChrome";
import { getSite } from "@/lib/content";

const site = getSite();

export const metadata: Metadata = {
  title: {
    default: "Eduardo Pesole | Sound designer",
    template: "%s | Eduardo Pesole",
  },
  description: site.global.meta_description_home,
  icons: {
    icon: [{ url: "/favicon-32.png", sizes: "32x32", type: "image/png" }],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${syne.variable} ${instrument.variable}`}
    >
      <body>
        <AppChrome>{children}</AppChrome>
      </body>
    </html>
  );
}
