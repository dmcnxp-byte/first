import { defineField, defineType } from "sanity";
import { sectionHeadFields } from "./shared";

// Multiple attributed testimonials — distinct from `pullQuoteBlock` (a
// single full-width pull-quote band with no name/photo). DOC brief's
// "Testimonials" section option.
export const testimonialsBlock = defineType({
  name: "testimonialsBlock",
  title: "Testimonials",
  type: "object",
  fields: [
    ...sectionHeadFields(),
    defineField({
      name: "items",
      title: "Testimonials",
      type: "array",
      of: [
        {
          type: "object",
          name: "testimonialItem",
          fields: [
            defineField({
              name: "quote",
              title: "Quote",
              type: "text",
              rows: 3,
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "name",
              title: "Name",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "role",
              title: "Role / context",
              description: 'e.g. "Online MBA, batch of 2024"',
              type: "string",
            }),
            defineField({
              name: "photo",
              title: "Photo",
              type: "image",
            }),
          ],
          preview: { select: { title: "name", subtitle: "role", media: "photo" } },
        },
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    select: { title: "heading" },
  },
});
