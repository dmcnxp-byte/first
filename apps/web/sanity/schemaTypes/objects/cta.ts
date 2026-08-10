import { defineField, defineType } from "sanity";

// Simple call-to-action object — DOC/SANITY_CMS_ARCHITECTURE.md § 2.
// `href` accepts both in-page anchors (e.g. "#lead") and full paths/URLs;
// resolving to typed internal document references lands once other
// referenceable route types (Programme hub, University profile, etc.) are
// built in a later phase — see PROJECT_STATUS.md Phase 3 notes.
export const cta = defineType({
  name: "cta",
  title: "Call to action",
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
      description: "An in-page anchor (e.g. #lead) or a full path/URL.",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "style",
      title: "Style",
      type: "string",
      options: {
        list: [
          { title: "Primary", value: "primary" },
          { title: "Secondary", value: "secondary" },
          { title: "Ghost", value: "ghost" },
        ],
        layout: "radio",
      },
      initialValue: "primary",
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: { title: "label", subtitle: "href" },
  },
});
