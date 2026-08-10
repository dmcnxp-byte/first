import { defineField, defineType } from "sanity";
import { sectionHeadFields } from "./shared";

// Embedded video (YouTube/Vimeo URL) — DOC brief's "Video" section option.
export const videoBlock = defineType({
  name: "videoBlock",
  title: "Video",
  type: "object",
  fields: [
    ...sectionHeadFields(),
    defineField({
      name: "videoUrl",
      title: "Video URL",
      description: "A YouTube or Vimeo URL.",
      type: "url",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "caption",
      title: "Caption",
      type: "string",
    }),
  ],
  preview: {
    select: { title: "heading" },
  },
});
