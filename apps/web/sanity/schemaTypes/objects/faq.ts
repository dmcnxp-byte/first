import { defineField, defineType } from "sanity";

// Reused inline everywhere a FAQ list appears — DOC/DATA_MODEL.md § 3.
// Rendered by FAQAccordion and, from the same array, FAQPage JSON-LD, so the
// visible accordion and the schema.org markup can never drift (the mockups'
// confirmed 6-vs-8-item gap) — DOC/COMPONENT_ARCHITECTURE.md § 3, DOC/SEO_STRATEGY.md § 2.
export const faq = defineType({
  name: "faq",
  title: "FAQ item",
  type: "object",
  fields: [
    defineField({
      name: "question",
      title: "Question",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "answer",
      title: "Answer",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: { title: "question" },
  },
});
