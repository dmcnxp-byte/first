import { defineField, defineType } from "sanity";
import { pageBuilderBlockNames } from "../pageBuilder";

// Generic Page document — DOC/DATA_MODEL.md § Page, DOC/PAGE_BUILDER_ARCHITECTURE.md.
// Replaces the Phase 3 `homePage` singleton: the Homepage is now just the one
// `page` document with `isHomepage: true`, and every future page-builder page
// (Landing, Compare, Resources, etc.) reuses this exact same document type,
// route, query, and SectionRenderer — no per-page-type schema needed.
export const page = defineType({
  name: "page",
  title: "Page",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      description: "Studio-facing label, also used as the default page heading source.",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      description:
        'Ignored for the Homepage (served at "/") — set to "home" by convention.',
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) =>
        Rule.required().custom(async (slug, context) => {
          if (!slug?.current) return true;
          const { document, getClient } = context;
          const client = getClient({ apiVersion: "2025-01-01" });
          const id = document?._id?.replace(/^drafts\./, "");
          const duplicate = await client.fetch(
            `count(*[_type == "page" && slug.current == $slug && !(_id in [$id, "drafts." + $id])])`,
            { slug: slug.current, id },
          );
          return duplicate === 0 ? true : "Another page already uses this slug.";
        }),
    }),
    defineField({
      name: "isHomepage",
      title: "Use as Homepage",
      description:
        'Renders this page at "/" instead of "/{slug}". Exactly one page should have this on.',
      type: "boolean",
      initialValue: false,
      validation: (Rule) =>
        Rule.custom(async (value, context) => {
          if (!value) return true;
          const { document, getClient } = context;
          const client = getClient({ apiVersion: "2025-01-01" });
          const id = document?._id?.replace(/^drafts\./, "");
          const otherHomepage = await client.fetch(
            `count(*[_type == "page" && isHomepage == true && !(_id in [$id, "drafts." + $id])])`,
            { id },
          );
          return otherHomepage === 0
            ? true
            : "Another page is already set as the Homepage.";
        }),
    }),
    defineField({
      name: "sections",
      title: "Sections",
      description: "Add Section to build the page from the reusable block catalogue.",
      type: "array",
      of: pageBuilderBlockNames.map((name) => ({ type: name })),
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "seo",
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "slug.current", isHomepage: "isHomepage" },
    prepare: ({ title, subtitle, isHomepage }) => ({
      title: isHomepage ? `${title} (Homepage)` : title,
      subtitle: isHomepage ? "/" : subtitle ? `/${subtitle}` : undefined,
    }),
  },
});
