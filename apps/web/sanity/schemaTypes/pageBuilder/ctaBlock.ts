import { defineField, defineType } from "sanity";

// Simple banner CTA — DOC brief's "CTA" section option. Distinct from
// `leadFormBlock`/`aiChatInviteBlock`: no form, no chat — just a heading and
// one button, for a lightweight mid-page nudge.
export const ctaBlock = defineType({
  name: "ctaBlock",
  title: "CTA",
  type: "object",
  fields: [
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "subhead",
      title: "Subhead",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "cta",
      title: "Button",
      type: "cta",
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: { title: "heading" },
  },
});
