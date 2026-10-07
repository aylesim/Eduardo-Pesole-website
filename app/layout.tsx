import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { bricolage, plexMono } from "@/app/fonts";
import Footer from "@/components/Footer";
import HardCutPresence from "@/components/HardCutPresence";
import SiteHeader from "@/components/SiteHeader";
import { getContact, getSiteSettings } from "@/lib/content";

const settings = getSiteSettings();
const contact = getContact();

export const metadata: Metadata = {
  title: {
    default: settings.meta.site_title_default,
    template: settings.meta.site_title_template,
  },
  description: settings.meta.home_description,
  icons: {
    icon: [{ url: "/favicon-32.png", sizes: "32x32", type: "image/png" }],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${bricolage.variable} ${plexMono.variable}`}
    >
      <body>
        <div className="site-gradient" aria-hidden="true" />
        <div className="site-stack">
          <SiteHeader
            brandName={settings.brand_name}
            nav={settings.nav}
            contactsLabel={settings.nav_contacts_label}
            homeNote={settings.home_note}
            homeShowreelLabel={settings.home_showreel_label}
          />
          <main>
            <HardCutPresence>{children}</HardCutPresence>
          </main>
          <Footer
            footer={settings.footer}
            mailLabel={settings.footer_mail_label}
            contact={contact}
          />
        </div>
      </body>
    </html>
  );
}
