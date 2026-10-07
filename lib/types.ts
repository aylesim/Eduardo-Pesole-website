export type NavItem = {
  label: string;
  href: string;
};

export type SiteSettings = {
  brand_name: string;
  nav: NavItem[];
  footer: string;
  home_note: string;
  home_showreel_label: string;
  nav_contacts_label: string;
  footer_mail_label: string;
  meta: {
    site_title_default: string;
    site_title_template: string;
    home_description: string;
    works_description: string;
    about_description: string;
    services_description: string;
  };
  works_filters: {
    selected_label: string;
    all_label: string;
    empty_message: string;
  };
  favicon: string;
};

export type AboutContent = {
  page_title: string;
  biography_title: string;
  showreel_title: string;
  credits_title: string;
  lead: string;
  full: string;
  expand_label: string;
  collapse_label: string;
  showreel: {
    url: string;
    aria_label: string;
    poster: string;
  };
  credits: { name: string }[];
};

export type ContactSocial = {
  label: string;
  url: string;
};

export type ContactContent = {
  heading: string;
  phone: string;
  email: string;
  socials: ContactSocial[];
};

export type WorkMediaKind = "youtube" | "image" | "soundcloud";

export type WorkMediaItem = {
  kind: WorkMediaKind;
  label?: string;
  url?: string;
  src?: string;
  alt?: string;
  focal?: string;
};

export type Collaborator = {
  name: string;
  url?: string;
};

export type ExternalLink = {
  label: string;
  url: string;
};

export type WorkCategory = string;

export type FilterId = "selected" | "all" | WorkCategory;

export type CategoryEntry = {
  slug: string;
  label: string;
  order: number;
};

export type WorkItem = {
  slug: string;
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
  full: string;
  primaryMedia: WorkMediaItem | null;
  media: WorkMediaItem[];
  poster: string | null;
  externalUrl: string | null;
  externalLinks: ExternalLink[];
  order: number;
  focal: string;
  selected?: boolean;
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
  id: FilterId;
  label: string;
};
