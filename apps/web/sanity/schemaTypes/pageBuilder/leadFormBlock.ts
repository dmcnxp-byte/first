import { defineField, defineType } from "sanity";

// Lead capture section — DOC/REQUIREMENTS_ANALYSIS.md § 9/10, DOC/FORMS_ARCHITECTURE.md.
export const leadFormBlock = defineType({
  name: "leadFormBlock",
  title: "Contact Form",
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
      name: "intro",
      title: "Intro paragraph",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "bullets",
      title: "Trust bullets",
      type: "array",
      of: [{ type: "string" }],
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
