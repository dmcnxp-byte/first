import { defineField, defineType } from "sanity";
import { sectionHeadFields } from "./shared";

// "Chat with Aarya" invitation strip — DOC/REQUIREMENTS_ANALYSIS.md § 9.
// Opens the same global ChatWidget (DOC/STATE_MANAGEMENT.md § 4 `openChat()`).
export const aiChatInviteBlock = defineType({
  name: "aiChatInviteBlock",
  title: "AI chat invitation",
  type: "object",
  fields: [
    ...sectionHeadFields(),
    defineField({
      name: "body",
      title: "Body copy",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "ctaLabel",
      title: "Button label",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: { title: "heading" },
  },
});
