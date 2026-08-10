import type { AccreditationBadge, Cta, Faq, LeadFormConfig, Seo } from "./shared";
import type { Programme } from "./programme";
import type { University } from "./university";
import type { SanityImage } from "./shared";

type SectionHead = {
  eyebrow?: string;
  heading: string;
  headingAccent?: string;
};

export type HeroBlock = SectionHead & {
  _key: string;
  _type: "heroBlock";
  subhead?: string;
  primaryCta?: Cta;
  secondaryCta?: Cta;
};

export type TrustStripBlock = {
  _key: string;
  _type: "trustStripBlock";
  statValue: string;
  statLabel: string;
  badges: AccreditationBadge[];
};

export type ModeStripBlock = SectionHead & {
  _key: string;
  _type: "modeStripBlock";
  intro?: string;
  modes: Programme[];
};

export type FeaturedUniversitiesBlock = SectionHead & {
  _key: string;
  _type: "featuredUniversitiesBlock";
  viewAllLabel?: string;
  viewAllHref?: string;
};

export type SpecializationCard = {
  _key: string;
  name: string;
  description?: string;
  href?: string;
};

export type SpecializationsGridBlock = SectionHead & {
  _key: string;
  _type: "specializationsGridBlock";
  items: SpecializationCard[];
};

export type PullQuoteBlock = {
  _key: string;
  _type: "pullQuoteBlock";
  quoteText: string;
  attribution?: string;
  cta?: Cta;
};

export type CounsellorMomentBlock = SectionHead & {
  _key: string;
  _type: "counsellorMomentBlock";
  quote: string;
  counsellorName: string;
  counsellorTitle?: string;
  counsellorPhoto?: SanityImage;
  cta?: Cta;
};

export type AiChatInviteBlock = SectionHead & {
  _key: string;
  _type: "aiChatInviteBlock";
  body?: string;
  ctaLabel: string;
};

export type ComparisonTeaser = {
  _key: string;
  entityAName: string;
  entityBName: string;
  href?: string;
};

export type ComparisonPreviewBlock = SectionHead & {
  _key: string;
  _type: "comparisonPreviewBlock";
  items?: ComparisonTeaser[];
};

export type LeadFormBlock = {
  _key: string;
  _type: "leadFormBlock";
  eyebrow?: string;
  heading: string;
  headingAccent?: string;
  intro?: string;
  bullets?: string[];
  form: LeadFormConfig;
};

export type FaqBlock = SectionHead & {
  _key: string;
  _type: "faqBlock";
  items: Faq[];
};

export type RichTextBlock = {
  _key: string;
  _type: "richTextBlock";
  body: unknown[];
};

export type StatItem = {
  _key: string;
  value: string;
  label: string;
  subLabel?: string;
};

export type StatsBlock = SectionHead & {
  _key: string;
  _type: "statsBlock";
  items: StatItem[];
};

export type TestimonialItem = {
  _key: string;
  quote: string;
  name: string;
  role?: string;
  photo?: SanityImage;
};

export type TestimonialsBlock = SectionHead & {
  _key: string;
  _type: "testimonialsBlock";
  items: TestimonialItem[];
};

export type CtaBlock = {
  _key: string;
  _type: "ctaBlock";
  heading: string;
  subhead?: string;
  cta: Cta;
};

export type GalleryImage = SanityImage & {
  _key: string;
  alt?: string;
  caption?: string;
};

export type GalleryBlock = SectionHead & {
  _key: string;
  _type: "galleryBlock";
  images: GalleryImage[];
};

export type VideoBlock = SectionHead & {
  _key: string;
  _type: "videoBlock";
  videoUrl: string;
  caption?: string;
};

export type NewsletterBlock = SectionHead & {
  _key: string;
  _type: "newsletterBlock";
  subhead?: string;
  form: LeadFormConfig;
};

export type PartnerLogo = {
  _key: string;
  logo: SanityImage;
  name?: string;
  href?: string;
};

export type PartnersBlock = SectionHead & {
  _key: string;
  _type: "partnersBlock";
  logos: PartnerLogo[];
};

export type CompareTableRow = {
  _key: string;
  label: string;
  values: string[];
};

export type CompareTableBlock = SectionHead & {
  _key: string;
  _type: "compareTableBlock";
  columns: string[];
  rows: CompareTableRow[];
};

export type Step = {
  _key: string;
  title: string;
  description?: string;
};

export type StepsBlock = SectionHead & {
  _key: string;
  _type: "stepsBlock";
  steps: Step[];
};

export type RelatedUniversitiesBlock = SectionHead & {
  _key: string;
  _type: "relatedUniversitiesBlock";
  universities: University[];
};

export type ImageContentBlock = {
  _key: string;
  _type: "imageContentBlock";
  image: SanityImage;
  alt: string;
  imagePosition?: "left" | "right";
  eyebrow?: string;
  heading: string;
  headingAccent?: string;
  body?: string;
  cta?: Cta;
};

export type DividerBlock = {
  _key: string;
  _type: "dividerBlock";
  style?: "line" | "space";
};

export type PageBuilderBlock =
  | HeroBlock
  | TrustStripBlock
  | ModeStripBlock
  | FeaturedUniversitiesBlock
  | SpecializationsGridBlock
  | PullQuoteBlock
  | CounsellorMomentBlock
  | AiChatInviteBlock
  | ComparisonPreviewBlock
  | LeadFormBlock
  | FaqBlock
  | RichTextBlock
  | StatsBlock
  | TestimonialsBlock
  | CtaBlock
  | GalleryBlock
  | VideoBlock
  | NewsletterBlock
  | PartnersBlock
  | CompareTableBlock
  | StepsBlock
  | RelatedUniversitiesBlock
  | ImageContentBlock
  | DividerBlock;

// Generic Page document — replaces the Phase 3 `homePage` singleton. The
// Homepage is just the one Page with `isHomepage: true`, rendered at "/";
// every other Page renders at "/{slug}" via the same route/query/renderer.
export type Page = {
  _id: string;
  title: string;
  slug: string;
  isHomepage: boolean;
  sections: PageBuilderBlock[];
  seo: Seo;
};
