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
  role_line: string;
  contact_cta: string;
  brand_name: string;
  credits: string[];
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

export type ProjectVideo = {
  label?: string;
  url: string;
  kind?: string;
};

export type Collaborator = {
  name: string;
  url?: string;
};

export type WorkStill = {
  src: string;
  alt: string;
  focal?: string;
  width?: number;
  height?: number;
};

export type ExternalLink = {
  label: string;
  url: string;
};

export type WorkCategory = "games" | "art-collabs" | "movies" | "music";

export type WorkItem = {
  slug: string;
  legacyPath: string | null;
  title: string;
  subtitle?: string;
  year: string;
  date: string;
  location: string;
  type: string;
  category: WorkCategory;
  categoryLabel: string;
  role: string;
  with: Collaborator[];
  short: string;
  primaryVideo: ProjectVideo | null;
  stills: WorkStill[];
  poster: string | null;
  posterScale?: number;
  posterQuality?: string;
  posterFallback?: string;
  posterPlaceholder?: "primary" | "secondary";
  archiveVideos?: ProjectVideo[];
  externalUrl: string | null;
  soundcloud: string | null;
  externalLinks: ExternalLink[];
  order: number;
  focal: string;
};

export type ServiceOffer = {
  id: string;
  title: string;
  line1: string;
  line2: string;
  cta: string;
  isPlaceholder?: boolean;
};

export type CategoryFilter = {
  id: "all" | WorkCategory;
  label: string;
};

export type SiteContent = {
  source: string;
  extracted_at: string;
  global: SiteGlobal;
  about_bio: string;
  about_lead: string;
  contact: Contact;
  works: WorkItem[];
  services: ServiceOffer[];
  category_filters: CategoryFilter[];
  favicon: string;
  gaps?: string[];
};
