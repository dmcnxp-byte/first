// Hand-written types mirroring the shared object schemas in
// sanity/schemaTypes/objects/*.ts. A generated-types pipeline (`sanity
// typegen`) is the documented long-term approach (DOC/DEVELOPMENT_GUIDELINES.md
// § 1) but needs a real, seeded Sanity dataset to introspect — not available
// this phase (see PROJECT_STATUS.md). These types are kept in lockstep with
// the schema by hand until then.

export type SanityImage = {
  asset?: { _ref: string; _type: "reference" };
  _type: "image";
};

export type Seo = {
  title: string;
  description: string;
  ogImage?: SanityImage;
  canonicalUrl?: string;
  noindex?: boolean;
};

export type Faq = {
  _key: string;
  question: string;
  answer: string;
};

export type Cta = {
  label: string;
  href: string;
  style: "primary" | "secondary" | "ghost";
};

export type AccreditationBadge = {
  _key: string;
  label: string;
  sourceUrl?: string;
};

export type LeadFormFieldName = "name" | "phone" | "email" | "city" | "select";

export type LeadFormConfig = {
  title: string;
  subtitle?: string;
  fields: LeadFormFieldName[];
  selectLabel?: string;
  selectOptions?: string[];
  submitLabel: string;
  footerNote?: string;
};
