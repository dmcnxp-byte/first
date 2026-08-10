import { defineField, defineType } from "sanity";

// Pure visual spacer/rule between sections — no content fields, since
// there's nothing to author beyond an optional visual style.
export const dividerBlock = defineType({
  name: "dividerBlock",
  title: "Divider",
  type: "object",
  fields: [
    defineField({
      name: "style",
      title: "Style",
      type: "string",
      options: {
        list: [
          { title: "Line", value: "line" },
          { title: "Space only", value: "space" },
        ],
        layout: "radio",
      },
      initialValue: "line",
    }),
  ],
  preview: {
    prepare: () => ({ title: "Divider" }),
  },
});
