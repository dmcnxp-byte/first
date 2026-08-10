import { defineField, defineType } from "sanity";

// Shared nav-link shape — DOC/SANITY_CMS_ARCHITECTURE.md § 2. Reused across
// Site Settings' header dropdown links and footer columns; previously
// duplicated inline in 3 places on the old `navigation` singleton.
export const navLink = defineType({
  name: "navLink",
  title: "Link",
  type: "object",
  fields: [
    defineField({
      name: "label",
      title: "Label",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "href",
      title: "Link",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: { title: "label", subtitle: "href" },
  },
});
