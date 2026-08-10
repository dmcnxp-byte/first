import type { SanityImage, Seo } from "./shared";

export type SocialLink = { platform?: string; url?: string };

export type NavLink = { _key: string; label: string; href: string };

export type FooterColumn = { _key: string; title: string; links: NavLink[] };

export type ThemeOverride = {
  primaryColorOverride?: string;
  accentColorOverride?: string;
};

// The single global config document — absorbs the former `navigation`
// singleton's header/footer link fields, per DOC/DATA_MODEL.md § Site Settings.
export type SiteSettings = {
  siteName: string;
  tagline?: string;
  logo?: SanityImage;
  favicon?: SanityImage;
  chatWelcomeMessage?: string;
  headerProgrammesLinks?: NavLink[];
  headerUniversitiesLinks?: NavLink[];
  footerColumns?: FooterColumn[];
  phone: string;
  whatsappNumber: string;
  email?: string;
  legalEntityName?: string;
  cin?: string;
  gst?: string;
  registeredOfficeAddress?: string;
  socialLinks?: SocialLink[];
  defaultSeo?: Seo;
  organizationSchema?: { legalName?: string; foundingDate?: string };
  theme?: ThemeOverride;
};
