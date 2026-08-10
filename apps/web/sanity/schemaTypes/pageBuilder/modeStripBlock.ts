import { defineField, defineType } from "sanity";
import { sectionHeadFields } from "./shared";

// The 4-mode explainer strip — DOC/REQUIREMENTS_ANALYSIS.md § 9 Homepage
// sections. References `programme` documents rather than duplicating mode
// content inline, per DOC/DATA_MODEL.md § Programme (Mode).
export const modeStripBlock = defineType({
  name: "modeStripBlock",
  title: "Featured Programmes",
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
      name: "modes",
      title: "Programme modes",
      type: "array",
      of: [{ type: "reference", to: [{ type: "programme" }] }],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    select: { title: "heading" },
  },
});
