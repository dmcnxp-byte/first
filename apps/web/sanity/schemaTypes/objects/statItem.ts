import { defineField, defineType } from "sanity";

// Shared {value, label, subLabel?} stat tile — extracted from `statsBlock`
// so it can also be nested inside `heroSplitBlock`'s compact stats row
// without redefining the same three fields twice.
export const statItem = defineType({
  name: "statItem",
  title: "Stat",
  type: "object",
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
});
