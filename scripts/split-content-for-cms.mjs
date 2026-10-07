import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const site = JSON.parse(
  fs.readFileSync(path.join(root, "content/site.json"), "utf8"),
);

const projectsBySlug = new Map(site.projects.map((p) => [p.slug, p]));

function projectForWork(work) {
  const candidates = [
    work.legacyPath?.replace(/^\//, ""),
    work.slug,
  ].filter(Boolean);
  for (const c of candidates) {
    if (projectsBySlug.has(c)) return projectsBySlug.get(c);
  }
  for (const p of site.projects) {
    if (p.display_title?.toLowerCase() === work.title.toLowerCase()) return p;
  }
  return undefined;
}

const categoryOrder = {
  games: 1,
  "art-collabs": 2,
  movies: 3,
  music: 4,
};

const categoryLabels = {
  games: "Games",
  "art-collabs": "Art Collabs",
  movies: "Movies",
  music: "Music",
};

fs.mkdirSync(path.join(root, "content/categories"), { recursive: true });
fs.mkdirSync(path.join(root, "content/works"), { recursive: true });

for (const [slug, label] of Object.entries(categoryLabels)) {
  const file = {
    slug,
    label,
    order: categoryOrder[slug],
  };
  fs.writeFileSync(
    path.join(root, `content/categories/${slug}.json`),
    `${JSON.stringify(file, null, 2)}\n`,
  );
}

const newSite = {
  brand_name: site.global.brand_name,
  nav: site.global.nav,
  footer: site.global.footer,
  home_note: "Sound designer and composer, Berlin",
  home_showreel_label: "Showreel",
  nav_contacts_label: "Contacts",
  footer_mail_label: site.global.contact_cta || "Mail",
  meta: {
    site_title_default: "Eduardo Pesole | Sound designer",
    site_title_template: "%s | Eduardo Pesole",
    home_description: site.global.meta_description_home,
    works_description:
      "Selected works by Eduardo Pesole — games, art collabs, movies, music.",
    about_description:
      "Berlin-based sound designer, sound artist and composer — bio, showreel, and contact.",
    services_description:
      "Game and interactive audio, spatial sound for installations, composition for picture, mix and post-production.",
  },
  works_filters: {
    selected_label: site.category_filters.find((f) => f.id === "selected")?.label ?? "Selected",
    all_label: site.category_filters.find((f) => f.id === "all")?.label ?? "All",
    empty_message: "Nothing in this category.",
  },
  favicon: site.favicon,
};

fs.writeFileSync(
  path.join(root, "content/site.json"),
  `${JSON.stringify(newSite, null, 2)}\n`,
);

const about = {
  page_title: "About",
  biography_title: "Biography",
  showreel_title: "Showreel",
  credits_title: "Studios & collaborators",
  lead: site.about_lead,
  full: site.about_bio,
  expand_label: "Full biography ↓",
  collapse_label: "Close biography ↑",
  showreel: {
    url: site.global.showreel_video.url,
    aria_label: site.global.showreel_video.aria_label,
    poster: "/images/showreel-2025-poster.jpg",
  },
  credits: site.global.credits.map((name) => ({ name })),
};

fs.writeFileSync(
  path.join(root, "content/about.json"),
  `${JSON.stringify(about, null, 2)}\n`,
);

const contact = {
  heading: site.contact.heading,
  phone: site.contact.phone,
  email: site.contact.email,
  socials: site.contact.socials,
};

fs.writeFileSync(
  path.join(root, "content/contact.json"),
  `${JSON.stringify(contact, null, 2)}\n`,
);

fs.writeFileSync(
  path.join(root, "content/services.json"),
  `${JSON.stringify(site.services, null, 2)}\n`,
);

for (const work of site.works) {
  const project = projectForWork(work);
  const fullText = project?.description?.trim() || "";

  const entry = {
    slug: work.slug,
    title: work.title,
    subtitle: work.subtitle || "",
    year: work.year,
    date: work.date,
    location: work.location,
    type: work.type,
    role: work.role,
    category: work.category,
    selected: Boolean(work.selected),
    order: work.order,
    short: work.short,
    full: fullText,
    with: work.with,
    primaryVideo: work.primaryVideo,
    archiveVideos: work.archiveVideos ?? [],
    stills: work.stills,
    poster: work.poster,
    posterScale: work.posterScale ?? 1,
    posterQuality: work.posterQuality ?? "",
    posterFallback: work.posterFallback ?? "",
    posterPlaceholder: work.posterPlaceholder ?? "",
    externalUrl: work.externalUrl,
    soundcloud: work.soundcloud,
    externalLinks: work.externalLinks ?? [],
    focal: work.focal,
  };

  fs.writeFileSync(
    path.join(root, "content/works", `${work.slug}.json`),
    `${JSON.stringify(entry, null, 2)}\n`,
  );
}

console.log("Wrote site, about, contact, services, categories, and", site.works.length, "works.");
