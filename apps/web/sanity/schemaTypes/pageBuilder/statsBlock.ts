import { defineField, defineType } from "sanity";
import { sectionHeadFields } from "./shared";

// Statistics grid — a repeatable {value, label} stat card row, distinct from
// `trustStripBlock` ("Trust Bar"), which is a single stat + accreditation
// badges. DOC brief's "Statistics" section option.
export const statsBlock = defineType({
  name: "statsBlock",
  title: "Statistics",
  type: "object",
  fields: [
    ...sectionHeadFields(),
    defineField({
      name: "items",
      title: "Stats",
      type: "array",
      of: [
        {
          type: "object",
          name: "statItem",
          fields: [
            defineField({
              name: "value",
              title: "Value",
              description: 'e.g. "18,000+"',
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "label",
              title: "Label",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "subLabel",
              title: "Sub-label (optional)",
              description:
                'e.g. "private universities" under a "Top universities" stat — covers the facts-strip variant in design/resource-distance-mba-guide.html.',
              type: "string",
            }),
          ],
          preview: { select: { title: "value", subtitle: "label" } },
        },
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    select: { title: "heading" },
  },
});
