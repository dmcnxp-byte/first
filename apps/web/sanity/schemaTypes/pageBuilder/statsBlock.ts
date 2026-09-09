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
      of: [{ type: "statItem" }],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    select: { title: "heading" },
  },
});
