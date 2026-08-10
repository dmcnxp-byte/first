import { defineField, defineType } from "sanity";

// Escape hatch for ad-hoc marketing copy — DOC/PAGE_BUILDER_ARCHITECTURE.md § 2.
export const richTextBlock = defineType({
  name: "richTextBlock",
  title: "Rich text",
  type: "object",
  fields: [
    defineField({
      name: "body",
      title: "Body",
      type: "array",
      of: [{ type: "block" }],
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    prepare: () => ({ title: "Rich text block" }),
  },
});
