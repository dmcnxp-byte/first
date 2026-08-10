import { defineField, defineType } from "sanity";

// Accreditation credibility band directly under the Hero — DOC/REQUIREMENTS_ANALYSIS.md § 7 `TrustStrip`.
export const trustStripBlock = defineType({
  name: "trustStripBlock",
  title: "Trust Bar",
  type: "object",
  fields: [
    defineField({
      name: "statValue",
      title: "Stat value",
      description: 'e.g. "18,000+"',
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "statLabel",
      title: "Stat label",
      description: 'e.g. "working professionals across India"',
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "badges",
      title: "Accreditation badges",
      type: "array",
      of: [{ type: "accreditationBadge" }],
      validation: (Rule) => Rule.min(1),
    }),
  ],
  preview: {
    select: { title: "statValue", subtitle: "statLabel" },
  },
});
