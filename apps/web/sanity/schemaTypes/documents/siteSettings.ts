import { defineField, defineType } from "sanity";

// Global Settings singleton — DOC/DATA_MODEL.md § Site Settings,
// DOC/SANITY_CMS_ARCHITECTURE.md § 3. The single global configuration
// document: branding, header/nav, footer, contact, social, default SEO, and
// theme overrides. Powers Header/Footer/ChatWidget/JSON-LD site-wide,
// editable without a deploy. Absorbs the former `navigation` singleton —
// there is deliberately only one global config document, not two.
export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  groups: [
    { name: "branding", title: "Branding", default: true },
    { name: "header", title: "Header & Navigation" },
    { name: "footer", title: "Footer" },
    { name: "contact", title: "Contact" },
    { name: "social", title: "Social" },
    { name: "seo", title: "Default SEO" },
    { name: "theme", title: "Theme" },
  ],
  fields: [
    defineField({
      name: "siteName",
      title: "Site name",
      type: "string",
      group: "branding",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "tagline",
      title: "Tagline",
      description: 'e.g. "Your Future. One Smart Step Away."',
      type: "string",
      group: "branding",
    }),
    defineField({
      name: "logo",
      title: "Logo (primary)",
      type: "image",
      group: "branding",
    }),
    defineField({
      name: "favicon",
      title: "Favicon",
      type: "image",
      group: "branding",
    }),
    defineField({
      name: "chatWelcomeMessage",
      title: "AI chat — default opening message",
      description:
        "Shown by Aarya when a visitor opens the chat widget on a page with no more specific greeting.",
      type: "text",
      rows: 2,
      group: "branding",
    }),
    defineField({
      name: "headerProgrammesLinks",
      title: "Header — Programmes dropdown links",
      type: "array",
      of: [{ type: "navLink" }],
      group: "header",
    }),
    defineField({
      name: "headerUniversitiesLinks",
      title: "Header — Universities dropdown links",
      description: 'Top universities plus a "view all" entry.',
      type: "array",
      of: [{ type: "navLink" }],
      group: "header",
    }),
    defineField({
      name: "footerColumns",
      title: "Footer link columns",
      type: "array",
      of: [
        {
          type: "object",
          name: "footerColumn",
          fields: [
            defineField({
              name: "title",
              title: "Column title",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "links",
              title: "Links",
              type: "array",
              of: [{ type: "navLink" }],
            }),
          ],
          preview: { select: { title: "title" } },
        },
      ],
      group: "footer",
    }),
    defineField({
      name: "phone",
      title: "Phone number",
      description: 'E.164 format, e.g. "+918669661005"',
      type: "string",
      group: "contact",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "whatsappNumber",
      title: "WhatsApp number",
      description: 'Digits only, e.g. "918669661005"',
      type: "string",
      group: "contact",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "email",
      title: "Contact email",
      type: "string",
      group: "contact",
      validation: (Rule) => Rule.email(),
    }),
    defineField({
      name: "legalEntityName",
      title: "Legal entity name",
      type: "string",
      group: "contact",
    }),
    defineField({
      name: "cin",
      title: "CIN",
      type: "string",
      group: "contact",
    }),
    defineField({
      name: "gst",
      title: "GST number",
      type: "string",
      group: "contact",
    }),
    defineField({
      name: "registeredOfficeAddress",
      title: "Registered office address",
      type: "text",
      rows: 2,
      group: "contact",
    }),
    defineField({
      name: "socialLinks",
      title: "Social links",
      type: "array",
      of: [
        {
          type: "object",
          name: "socialLink",
          fields: [
            defineField({ name: "platform", title: "Platform", type: "string" }),
            defineField({ name: "url", title: "URL", type: "url" }),
          ],
        },
      ],
      group: "social",
    }),
    defineField({
      name: "defaultSeo",
      title: "Default SEO",
      description: "Fallback used when a Page doesn't set its own SEO fields.",
      type: "seo",
      group: "seo",
    }),
    defineField({
      name: "organizationSchema",
      title: "Organization JSON-LD defaults",
      type: "object",
      group: "seo",
      fields: [
        defineField({ name: "legalName", title: "Legal name", type: "string" }),
        defineField({ name: "foundingDate", title: "Founding date", type: "date" }),
      ],
    }),
    defineField({
      name: "theme",
      title: "Brand color overrides",
      description:
        "Optional hex overrides for the brand's navy/saffron tokens. Leave blank to use the default design system.",
      type: "object",
      group: "theme",
      fields: [
        defineField({
          name: "primaryColorOverride",
          title: "Primary color (navy) override",
          description: "Hex value, e.g. #0b1f4d",
          type: "string",
          validation: (Rule) => Rule.regex(/^#[0-9a-fA-F]{3,8}$/, { name: "hex color" }),
        }),
        defineField({
          name: "accentColorOverride",
          title: "Accent color (saffron) override",
          description: "Hex value, e.g. #e8930e",
          type: "string",
          validation: (Rule) => Rule.regex(/^#[0-9a-fA-F]{3,8}$/, { name: "hex color" }),
        }),
      ],
    }),
  ],
  preview: {
    prepare: () => ({ title: "Site Settings" }),
  },
});
