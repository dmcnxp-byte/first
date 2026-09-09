import { defineArrayMember, defineField, defineType } from "sanity";
import { sectionHeadFields } from "./shared";

// Page-specific, per-card university shortlist grid — for specialisation
// comparison landing pages (e.g. "top-distance-mba-finance") that need
// richer per-card content than `relatedUniversitiesBlock` (a bare reference
// array) can carry: a programme/city line, a mode tag, and an optional
// "featured" ribbon. Each item still references a real `university`
// document rather than duplicating its content (name/fee/duration/"best
// for"/trust badges all come from that document) — only the fields that are
// genuinely specific to *this page's* presentation of that university live
// here. `relatedUniversitiesBlock` is untouched; existing pages that use it
// are unaffected.
//
// Card order is this array's order — editors drag-reorder items in Studio,
// and that order is scoped to this one page document, per
// DOC/PAGE_BUILDER_ARCHITECTURE.md's page-controls-order pattern.
export const universityShortlistBlock = defineType({
  name: "universityShortlistBlock",
  title: "University Shortlist Grid",
  type: "object",
  fields: [
    ...sectionHeadFields(),
    defineField({
      name: "intro",
      title: "Intro paragraph",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "cardCtaLabel",
      title: "Card — primary button label",
      description: 'e.g. "Get this shortlisted"',
      type: "string",
      initialValue: "Get this shortlisted",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "cardSecondaryCtaLabel",
      title: "Card — secondary button label",
      description: 'e.g. "View full details". Leave blank to hide the secondary button.',
      type: "string",
      initialValue: "View full details",
    }),
    defineField({
      name: "footnote",
      title: "Footnote (below the grid)",
      description: 'e.g. a fee-accuracy disclaimer with a "last checked" date.',
      type: "string",
    }),
    defineField({
      name: "items",
      title: "Universities",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "universityShortlistCard",
          fields: [
            defineField({
              name: "university",
              title: "University",
              type: "reference",
              to: [{ type: "university" }],
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "programLabel",
              title: "Programme line",
              description: 'e.g. "MBA Finance · Pune"',
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "mode",
              title: "Mode",
              type: "string",
              options: {
                list: [
                  { title: "Online", value: "Online" },
                  { title: "Distance", value: "Distance" },
                ],
                layout: "radio",
              },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "featured",
              title: "Featured on this page",
              description: "Shows the ribbon tag above the card.",
              type: "boolean",
              initialValue: false,
            }),
            defineField({
              name: "featuredTag",
              title: "Featured ribbon text",
              description: 'e.g. "Top pick · Corporate". Only shown when Featured is on.',
              type: "string",
              hidden: ({ parent }) => !parent?.featured,
            }),
          ],
          preview: {
            select: {
              title: "university.name",
              subtitle: "programLabel",
              featured: "featured",
            },
            prepare({ title, subtitle, featured }) {
              return {
                title: featured ? `★ ${title ?? "Untitled"}` : (title ?? "Untitled"),
                subtitle,
              };
            },
          },
        }),
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    select: { title: "heading" },
  },
});
