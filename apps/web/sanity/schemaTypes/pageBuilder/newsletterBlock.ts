import { defineField, defineType } from "sanity";
import { sectionHeadFields } from "./shared";

// Compact inline newsletter signup — DOC brief's "Newsletter" section option.
// Reuses `leadFormConfig` (the same config-driven shape as `leadFormBlock`
// / "Contact Form") rather than a bespoke config shape — the visual
// treatment differs (compact inline bar vs. full lead-capture section), the
// underlying form config contract doesn't need to.
export const newsletterBlock = defineType({
  name: "newsletterBlock",
  title: "Newsletter",
  type: "object",
  fields: [
    ...sectionHeadFields(),
    defineField({
      name: "subhead",
      title: "Subhead",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "form",
      title: "Form configuration",
      type: "leadFormConfig",
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: { title: "heading" },
  },
});
