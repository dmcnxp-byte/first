import { defineField, defineType } from "sanity";

// Two-column campaign-landing-page hero (design/top-distance-mba-finance.html
// `.lp-body`): hero copy + trust strip + stats in a left column, a sticky
// LeadForm card in the right column — visually distinct from the generic,
// single-column `heroBlock` (used by the Homepage and other pages), which is
// left untouched so nothing else changes shape.
//
// Reuses existing shared object types rather than redefining their fields:
// `trustStrip` nests the same shape as `trustStripBlock` (statValue/
// statLabel/badges), `stats` nests the same `statItem` array `statsBlock`
// uses, and `form` nests the same `leadFormConfig` object every LeadForm
// caller already uses — so Studio's editing experience for each stays
// identical, it's just composed into one section instead of four.
export const heroSplitBlock = defineType({
  name: "heroSplitBlock",
  title: "Hero (2-column, with form)",
  type: "object",
  fields: [
    defineField({
      name: "eyebrow",
      title: "Eyebrow label",
      type: "string",
    }),
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "headingAccent",
      title: "Heading — italic accent phrase",
      type: "string",
    }),
    defineField({
      name: "subhead",
      title: "Subheading",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "trustStrip",
      title: "Trust strip (optional)",
      type: "trustStripBlock",
    }),
    defineField({
      name: "stats",
      title: "Stats row (optional)",
      type: "array",
      of: [{ type: "statItem" }],
    }),
    defineField({
      name: "form",
      title: "Lead form",
      type: "leadFormConfig",
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: { title: "heading" },
  },
});
