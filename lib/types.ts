export type NavItem = {
  label: string;
  href: string;
};

export type ShowreelVideo = {
  url: string;
  aria_label: string;
};

export type SiteGlobal = {
  nav: NavItem[];
  footer: string;
  hero_tagline: string;
  showreel_cta: string;
  showreel_video: ShowreelVideo;
  meta_description_home: string;
};

export type ContactSocial = {
  label: string;
  url: string;
};

export type Contact = {
  heading: string;
  phone: string;
  email: string;
  socials: ContactSocial[];
  form_fields: string[];
  form_submit_label: string;
  form_success_message: string;
};

export type MediaImage = {
  url: string;
  uri?: string;
  alt?: string;
  filename?: string;
  width?: number | null;
  height?: number | null;
  local?: string;
};

export type ProjectVideo = {
  label?: string;
  url: string;
  compId?: string;
};

export type ProjectEmbed = {
  kind: string;
  url: string;
  title?: string;
};

export type ExternalLink = {
  text: string;
  href: string;
};

export type Project = {
  slug: string;
  url: string;
  page_title: string;
  display_title: string;
  meta_description?: string;
  fields: Record<string, string>;
  body_text_verbatim?: string;
  description?: string;
  videos?: ProjectVideo[];
  embeds?: ProjectEmbed[];
  images?: MediaImage[];
  external_links?: ExternalLink[];
  socials_on_page?: string[];
  subtitle?: string;
  page_title_note?: string;
};

export type PortfolioItem = {
  title: string;
  url: string;
  slug?: string;
  external?: boolean;
  note?: string;
};

export type PortfolioGroup = {
  category: string;
  items: PortfolioItem[];
};

export type MusicHubItem = {
  label: string;
  url?: string;
  note?: string;
};

export type GamesHub = {
  url: string;
  title: string;
  body_snippets?: string[];
  images?: MediaImage[];
};

export type SoundArtHub = {
  url: string;
  title: string;
  body_snippets?: string[];
  images?: MediaImage[];
};

export type MoviesHub = {
  url: string;
  title: string;
  heading?: string;
  items_listed?: string[];
  images?: MediaImage[];
};

export type MusicHub = {
  url: string;
  title: string;
  items?: MusicHubItem[];
  images?: MediaImage[];
};

export type SecondaryPages = {
  music: MusicHub;
  games_hub: GamesHub;
  sound_art_hub: SoundArtHub;
  movies_hub: MoviesHub;
};

export type SiteMapEntry = {
  url: string;
  slug: string;
  title: string;
  role: string;
};

export type SiteContent = {
  source: string;
  extracted_at: string;
  global: SiteGlobal;
  about_bio: string;
  contact: Contact;
  portfolio: PortfolioGroup[];
  projects: Project[];
  secondary: SecondaryPages;
  media_map: Record<string, string>;
  favicon: string;
  gaps: string[];
  site_map: SiteMapEntry[];
};

export type HubKey = "games" | "sound-art" | "movies" | "music";
export type SecondaryKey = keyof SecondaryPages;
