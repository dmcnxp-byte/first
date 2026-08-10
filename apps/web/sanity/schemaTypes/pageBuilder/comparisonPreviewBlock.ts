import { defineField, defineType } from "sanity";
import { sectionHeadFields } from "./shared";

// Registered per the approved `pageBuilder` block list in
// DOC/PAGE_BUILDER_ARCHITECTURE.md § 2. Not part of the current Homepage
// default preset (design/homepage.html has no comparison-preview section),
// but available to editors — e.g. for a future homepage revision — since the
// closed block set is defined once for the document type, not per preset.
// Full `compare` document linking lands once that document type is built.
export const comparisonPreviewBlock = defineType({
  name: "comparisonPreviewBlock",
  title: "Comparison preview",
  type: "object",
  fields: [
    ...sectionHeadFields(),
    defineField({
      name: "items",
      title: "Comparisons",
      type: "array",
      of: [
        {
          type: "object",
          name: "comparisonTeaser",
          fields: [
            defineField({
              name: "entityAName",
              title: "Entity A name",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "entityBName",
              title: "Entity B name",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({ name: "href", title: "Link", type: "string" }),
          ],
          preview: {
            select: { a: "entityAName", b: "entityBName" },
            prepare: ({ a, b }) => ({ title: `${a ?? "?"} vs ${b ?? "?"}` }),
          },
        },
      ],
    }),
  ],
  preview: {
    select: { title: "heading" },
  },
});
