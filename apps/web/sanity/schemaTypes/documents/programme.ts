import { defineField, defineType } from "sanity";

// Programme (Mode) document — DOC/DATA_MODEL.md § Programme (Mode). This is
// the type the Phase 3 brief refers to as "Course" — DOC/REQUIREMENTS_ANALYSIS.md
// § 16 Assumption 6 explicitly maps "Course" in the brief to this Programme
// (Mode) type, not a third, separate entity; see PROJECT_STATUS.md Phase 3
// notes.
//
// Scope note (Phase 3): right-sized for the Homepage's four-mode strip
// cards. Fields for a standalone `/programmes/[mode]/` hub page (definitive
// answer body, mode-comparison table, fit guidance, counsellor note, FAQs,
// SEO) are deferred to the phase that builds that route — no consumer exists
// for them yet.
export const programme = defineType({
  name: "programme",
  title: "Programme (Mode)",
  type: "document",
  fields: [
    defineField({
      name: "modeName",
      title: "Mode name",
      type: "string",
      options: {
        list: [
          { title: "Distance MBA", value: "Distance MBA" },
          { title: "Online MBA", value: "Online MBA" },
          { title: "Executive MBA", value: "Executive MBA" },
          { title: "Correspondence MBA", value: "Correspondence MBA" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "modeName", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "summary",
      title: "Card summary",
      description: "The mode-card body paragraph.",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "feeRange",
      title: "Fee range (display)",
      description: 'e.g. "₹40K – ₹2L"',
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "durationLabel",
      title: "Duration label",
      description: 'e.g. "2-2.5 years"',
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "formatLabel",
      title: "Format label",
      description: 'e.g. "Self-paced", "Structured cohort", "Weekend / hybrid"',
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "bestFor",
      title: "Best for",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "order",
      title: "Display order",
      type: "number",
    }),
  ],
  preview: {
    select: { title: "modeName", subtitle: "feeRange" },
  },
});
