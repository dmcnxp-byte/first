import { defineField, defineType } from "sanity";
import { sectionHeadFields } from "./shared";

// Partner/client logo strip, each optionally linking out — DOC brief's
// "Partners" section option. Distinct from `galleryBlock`: a logo+name+link
// triple, not a captioned photo gallery.
export const partnersBlock = defineType({
  name: "partnersBlock",
  title: "Partners",
  type: "object",
  fields: [
    ...sectionHeadFields(),
    defineField({
      name: "logos",
      title: "Partner logos",
      type: "array",
      of: [
        {
          type: "object",
          name: "partnerLogo",
          fields: [
            defineField({
              name: "logo",
              title: "Logo",
              type: "image",
              validation: (Rule) => Rule.required(),
            }),
            defineField({ name: "name", title: "Partner name", type: "string" }),
            defineField({ name: "href", title: "Link", type: "url" }),
          ],
          preview: { select: { title: "name", media: "logo" } },
        },
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    select: { title: "heading" },
  },
});
