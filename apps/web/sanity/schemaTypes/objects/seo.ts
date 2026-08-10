import { defineField, defineType } from "sanity";

// Shared SEO object — DOC/SANITY_CMS_ARCHITECTURE.md § 2, DOC/DATA_MODEL.md § 3.
// Required title/description enforce the content-governance rule in
// DOC/SANITY_CMS_ARCHITECTURE.md § 8 (FR-15/FR-17) at the authoring layer.
export const seo = defineType({
  name: "seo",
  title: "SEO",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Meta title",
      type: "string",
      validation: (Rule) => Rule.required().max(70),
    }),
    defineField({
      name: "description",
      title: "Meta description",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.required().max(160),
    }),
    defineField({
      name: "ogImage",
      title: "Open Graph image",
      type: "image",
    }),
    defineField({
      name: "canonicalUrl",
      title: "Canonical URL override",
      description: "Leave blank to use the page's own resolved URL.",
      type: "url",
    }),
    defineField({
      name: "noindex",
      title: "Hide from search engines (noindex)",
      type: "boolean",
      initialValue: false,
    }),
  ],
});
