import { defineField, defineType } from "sanity";

// Brand-promise pull-quote band (navy background) — DOC/REQUIREMENTS_ANALYSIS.md § 9.
// Optional `cta` covers the variant found in
// design/resource-distance-mba-guide.html's closing quote-with-button block
// — same shape, one extra optional field, not a second schema.
export const pullQuoteBlock = defineType({
  name: "pullQuoteBlock",
  title: "Quote",
  type: "object",
  fields: [
    defineField({
      name: "quoteText",
      title: "Quote",
      type: "text",
      rows: 2,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "attribution",
      title: "Attribution line",
      type: "string",
    }),
    defineField({
      name: "cta",
      title: "Button (optional)",
      type: "cta",
    }),
  ],
  preview: {
    select: { title: "quoteText" },
  },
});
