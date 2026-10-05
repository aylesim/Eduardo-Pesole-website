import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const sitePath = join(root, "content/site.json");
const site = JSON.parse(readFileSync(sitePath, "utf8"));

const CATEGORY_MAP = {
  Games: "games",
  "Art Collabs": "art-collabs",
  Movies: "movies",
  Music: "music",
};

const CATEGORY_LABEL = {
  games: "Games",
  "art-collabs": "Art Collabs",
  movies: "Movies",
  music: "Music",
};

function youtubeId(url) {
  if (!url) return null;
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) {
      return u.pathname.replace("/", "").split("?")[0] || null;
    }
    if (u.hostname.includes("youtube.com")) {
      const v = u.searchParams.get("v");
      if (v) return v;
      if (u.pathname.startsWith("/embed/")) {
        return u.pathname.split("/")[2] ?? null;
      }
    }
  } catch {
    return null;
  }
  return null;
}

function youtubePoster(url) {
  const id = youtubeId(url);
  return id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : null;
}

function firstSentences(text, max = 3) {
  if (!text?.trim()) return "";
  const cleaned = text.replace(/\s+/g, " ").trim();
  const parts = cleaned.split(/(?<=[.!?])\s+/).filter(Boolean);
  if (parts.length === 0) return cleaned;
  return parts.slice(0, max).join(" ");
}

function extractYear(date, title) {
  if (date) {
    const years = [...date.matchAll(/\b(20\d{2})\b/g)].map((m) => m[1]);
    if (years.length) return years[years.length - 1];
  }
  const fromTitle = title?.match(/\((\d{4,5})\)/);
  if (fromTitle) {
    return fromTitle[1] === "20204" ? "2024" : fromTitle[1];
  }
  return "";
}

function slugify(title) {
  return title
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const categoryBySlug = new Map();
for (const group of site.portfolio) {
  const key = CATEGORY_MAP[group.category];
  for (const item of group.items) {
    if (item.slug) categoryBySlug.set(item.slug, key);
  }
}

const hubPosterHints = {
  "from-now-on": "/images/f9476d_a46ac2fb6f4c48cc9afcb2dca11dd7fa-mv2.jpeg",
  "movies-per-non-sparire-lentamente":
    "/images/f9476d_2269a57c8f1647d48743a6b7e724e32a-mv2.jpg",
  "movies-balena-spiaggiata":
    "/images/f9476d_cf812ead9127470299e772b3f0b21977-mv2.jpeg",
  "movies-anedonia":
    "/images/f9476d_aca30cbe260a47d1aaf004cd376a3588-mv2.jpeg",
  "movies-escape": "/images/f9476d_d527d4d6932e459190b7eaff9be031ca-mv2.jpeg",
  "movies-ori": "/images/f9476d_26d059a76ebd413881e4de959743907d-mv2.png",
  "movies-ineffable-qualitè":
    "/images/f9476d_fc300702ce9347b6ab7fc2905520cd0c-mv2.jpg",
  "copy-of-ineffable-qualitè-2019":
    "/images/f9476d_20be61799b0a4dc4bc67e3d16e521a79-mv2.jpg",
  "games-moongaze":
    "/images/f9476d_d841b51553904be69a8d7c72182dbbaa-mv2.jpg",
  "stray-blade": "/images/f9476d_5a18cab079da49968a61db451e503ee3-mv2.jpg",
  "sound-art-unstable-matter":
    "/images/f9476d_e2507fa842554591ba7fe6af473c2545-mv2.jpg",
  "sound-art-wasch-collective":
    "/images/f9476d_9fc97c63d2b6437f924ac90425a61696-mv2.jpg",
  "collabs-art": "/images/f9476d_d6dd5bedbc8846afa57a824e1da874d5-mv2.jpg",
};

const works = [];

for (const project of site.projects) {
  const category = categoryBySlug.get(project.slug) ?? "movies";
  const year = extractYear(project.fields?.DATE, project.page_title);
  const role = project.fields?.ROLE ?? "";
  const collaborators =
    project.collaborators?.map((c) =>
      typeof c === "string" ? c : c.name || c.org || "",
    ) ??
    (project.fields?.["OTHER ARTISTS"]
      ? [project.fields["OTHER ARTISTS"]]
      : []);

  let short = firstSentences(project.description || "", 3);
  if (!short) {
    const bits = [project.fields?.["PROJECT TYPE"], role]
      .filter(Boolean)
      .join(". ");
    short = bits;
  }

  const videos = project.videos ?? [];
  const primaryVideo =
    project.slug === "stray-blade"
      ? videos[0]
        ? { label: videos[0].label || "Primary reel", url: videos[0].url }
        : null
      : videos[0]
        ? { label: videos[0].label || "", url: videos[0].url }
        : project.embeds?.find((e) => e.kind === "soundcloud")
          ? {
              label: project.embeds[0].title || "SoundCloud",
              url: project.embeds[0].url,
              kind: "soundcloud",
            }
          : null;

  const stills = (project.images ?? [])
    .filter((img) => img.local || img.url)
    .slice(0, 6)
    .map((img) => ({
      src: img.local || img.url,
      alt: img.alt || project.display_title,
      width: img.width ?? undefined,
      height: img.height ?? undefined,
    }));

  const posterFromStill = stills[0]?.src ?? null;
  const posterFromVideo = primaryVideo?.url
    ? youtubePoster(primaryVideo.url)
    : null;
  const poster =
    posterFromStill ||
    hubPosterHints[project.slug] ||
    posterFromVideo ||
    null;

  works.push({
    slug: project.slug,
    legacySlug: project.slug,
    title: project.display_title,
    category,
    categoryLabel: CATEGORY_LABEL[category],
    year,
    role,
    collaborators: collaborators.filter(Boolean),
    short,
    shortIsInterim: true,
    primaryVideo,
    stills,
    poster,
    externalUrl: null,
    location: project.fields?.LOCATION ?? "",
    projectType: project.fields?.["PROJECT TYPE"] ?? "",
    subtitle: project.subtitle ?? "",
  });
}

const musicPosters = {
  "hypocyrta-glabra":
    "/images/f9476d_f52aa58e86784c52b6b3b74247ee03be-mv2.jpeg",
  "just-for-fun": "/images/f9476d_a7525a4d898941789eb3f732deb7d97a-mv2.jpg",
  "tonino-davola": "/images/f9476d_a7525a4d898941789eb3f732deb7d97a-mv2.jpg",
};

const musicGroup = site.portfolio.find((g) => g.category === "Music");
for (const item of musicGroup?.items ?? []) {
  const year = extractYear(null, item.title);
  const title = item.title.replace(/\s*\(\d{4,5}\)\s*$/, "").trim();
  const slug = slugify(title);
  works.push({
    slug,
    legacySlug: null,
    title,
    category: "music",
    categoryLabel: "Music",
    year: year || (title.includes("Tonino") ? "2021" : ""),
    role: "",
    collaborators: [],
    short: item.note
      ? firstSentences(item.note.replace(/^Label typo.*?—\s*/, ""), 2)
      : "",
    shortIsInterim: true,
    primaryVideo: null,
    stills: [],
    poster: musicPosters[slug] || null,
    externalUrl: item.url,
    location: "",
    projectType: "Music",
    subtitle: "",
  });
}

const aboutLead = firstSentences(site.about_bio, 1);

const services = [
  {
    id: "interactive-game-audio",
    title: "Interactive / game audio",
    body: "Interactive sound design and tech audio for video games — Wwise, Unreal, spatial systems, multi-platform work.",
    isPlaceholder: true,
  },
  {
    id: "installation-spatial",
    title: "Installation & spatial audio",
    body: "Interactive installations and spatial audio for museums, events, and digital twins of physical spaces.",
    isPlaceholder: true,
  },
  {
    id: "composition-film-fashion",
    title: "Composition for film / fashion",
    body: "Composition for fashion movies, collections, and audiovisual pieces across film and advertising.",
    isPlaceholder: true,
  },
  {
    id: "mix-editorial",
    title: "Mix / editorial",
    body: "Mix engineering, audio editing, and floor sound for short and medium-length films.",
    isPlaceholder: true,
  },
];

site.global.nav = [
  { label: "Index", href: "/" },
  { label: "Works", href: "/works" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
];
site.global.role_line = "Sound Designer · Artist · Composer";
site.global.contact_cta = "Get in touch";
site.about_lead = aboutLead;
site.services = services;
site.works = works;
site.category_filters = [
  { id: "all", label: "All" },
  { id: "games", label: "Games" },
  { id: "art-collabs", label: "Art Collabs" },
  { id: "movies", label: "Movies" },
  { id: "music", label: "Music" },
];

writeFileSync(sitePath, JSON.stringify(site, null, 2) + "\n");
console.log(`Wrote ${works.length} works, ${services.length} services`);
