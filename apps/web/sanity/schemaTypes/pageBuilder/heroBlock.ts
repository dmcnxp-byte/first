import { defineField, defineType } from "sanity";

// Homepage opening block — DOC/PAGE_BUILDER_ARCHITECTURE.md § 2, fields map
// 1:1 to the `Hero` composed-pattern props (DOC/REQUIREMENTS_ANALYSIS.md § 7).
export const heroBlock = defineType({
  name: "heroBlock",
  title: "Hero",
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
      description:
        "The trailing phrase rendered in the brand's Lora-italic voice accent.",
      type: "string",
    }),
    defineField({
      name: "subhead",
      title: "Subheading",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "primaryCta",
      title: "Primary CTA",
      type: "cta",
    }),
    defineField({
      name: "secondaryCta",
      title: "Secondary CTA",
      type: "cta",
    }),
  ],
  preview: {
    select: { title: "heading" },
  },
});
