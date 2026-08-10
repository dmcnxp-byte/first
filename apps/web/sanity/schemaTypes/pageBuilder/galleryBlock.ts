import { defineField, defineType } from "sanity";
import { sectionHeadFields } from "./shared";

// Image gallery — DOC brief's "Gallery" section option.
export const galleryBlock = defineType({
  name: "galleryBlock",
  title: "Gallery",
  type: "object",
  fields: [
    ...sectionHeadFields(),
    defineField({
      name: "images",
      title: "Images",
      type: "array",
      of: [
        {
          type: "image",
          fields: [
            defineField({ name: "alt", title: "Alt text", type: "string" }),
            defineField({ name: "caption", title: "Caption", type: "string" }),
          ],
        },
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    select: { title: "heading" },
  },
});
