import { defineField, defineType } from "sanity";

// Image + text split section — for low-structure marketing pages (About,
// Landing) that need a story/feature block with an image. No design mockup
// shows this exact pattern (no about.html exists in design/ to check
// against), but it's structure only — no fabricated copy, just fields an
// editor fills in.
export const imageContentBlock = defineType({
  name: "imageContentBlock",
  title: "Image + Content",
  type: "object",
  fields: [
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "alt",
      title: "Alt text",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "imagePosition",
      title: "Image position",
      type: "string",
      options: {
        list: [
          { title: "Left", value: "left" },
          { title: "Right", value: "right" },
        ],
        layout: "radio",
      },
      initialValue: "left",
    }),
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
      name: "body",
      title: "Body",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "cta",
      title: "Button",
      type: "cta",
    }),
  ],
  preview: {
    select: { title: "heading", media: "image" },
  },
});
