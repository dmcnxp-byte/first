import type { SchemaTypeDefinition } from "sanity";

// Document/object schema types are a Phase 3 deliverable — see
// DOC/SANITY_CMS_ARCHITECTURE.md § 2 and DOC/DATA_MODEL.md for the full,
// approved content model this array will be populated with
// (university, programme, specialization, compare, offering, blogPost,
// resourcePage, landingPage, counsellor, successStory, homePage, siteSettings,
// navigation, redirect, plus shared objects: seo, faq, cta, leadFormConfig).
export const schema: { types: SchemaTypeDefinition[] } = {
  types: [],
};
