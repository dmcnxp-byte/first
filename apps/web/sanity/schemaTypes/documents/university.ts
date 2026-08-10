import { defineField, defineType } from "sanity";

// University document — DOC/DATA_MODEL.md § University.
//
// Scope note (Phase 3): this is the reusable University schema right-sized
// for the Homepage's Featured Universities cards plus the "foundational...
// future expansion" instruction — NOT the full field set in DATA_MODEL.md.
// Fields deferred to the phase that builds University detail pages, because
// they either depend on document types out of scope here (`specialization`,
// `counsellor`, `compare`) or have no consumer until that template exists:
// aboutBody, specializationsOffered, feeStructure, eligibility,
// applicationTimeline, accreditationDetail, counsellorNote, compareWith,
// faqs, leadForm. See PROJECT_STATUS.md Phase 3 notes for the full rationale.
//
// `csvLegacy*` fields follow DATA_MODEL.md's migration-staging pattern
// exactly: raw, unedited values from design/University.csv, hidden from the
// public site, held until an editor reconciles them with real content.
export const university = defineType({
  name: "university",
  title: "University",
  type: "document",
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "seo", title: "SEO" },
    { name: "migration", title: "Migration staging" },
  ],
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      group: "content",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      group: "content",
      options: { source: "name", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "legacySlugs",
      title: "Legacy slugs",
      description:
        "Old flat URLs that should 301 to this university once the redirect engine is built.",
      type: "array",
      of: [{ type: "string" }],
      group: "content",
    }),
    defineField({
      name: "logo",
      title: "Logo",
      type: "image",
      group: "content",
    }),
    defineField({
      name: "universityType",
      title: "University type",
      type: "string",
      group: "content",
      options: {
        list: [
          { title: "Deemed-to-be University", value: "deemed" },
          { title: "Private University", value: "private" },
          { title: "Private B-School", value: "b-school" },
          { title: "Aggregator Platform", value: "aggregator" },
        ],
      },
    }),
    defineField({
      name: "positioningStatement",
      title: "Positioning statement",
      description:
        'The card\'s "Best for" line, e.g. "Corporate management roles at brand-conscious employers"',
      type: "string",
      group: "content",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "trustBadges",
      title: "Trust badges",
      description: 'e.g. "NAAC A++", "Deemed"',
      type: "array",
      of: [{ type: "accreditationBadge" }],
      group: "content",
    }),
    defineField({
      name: "quickFacts",
      title: "Quick facts",
      type: "object",
      group: "content",
      fields: [
        defineField({
          name: "feeDisplay",
          title: "Fee (display)",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "feeMin",
          title: "Fee — minimum (for sort/filter)",
          type: "number",
        }),
        defineField({
          name: "feeMax",
          title: "Fee — maximum (for sort/filter)",
          type: "number",
        }),
        defineField({
          name: "durationDisplay",
          title: "Duration (display)",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
      ],
    }),
    defineField({
      name: "isFeaturedOnHomepage",
      title: "Featured on Homepage",
      description:
        "Controls the Homepage's Featured Universities grid without a separate duplicated list.",
      type: "boolean",
      group: "content",
      initialValue: false,
    }),
    defineField({
      name: "editorialFlag",
      title: "Editorial flag",
      description:
        "Business-rule/data-quality concerns surfaced during University.csv import — resolve before this university appears anywhere public. See PROJECT_STATUS.md.",
      type: "string",
      group: "content",
      options: {
        list: [
          {
            title: "Government-sector — do not counsel (BR-2)",
            value: "government-sector-do-not-publish",
          },
          {
            title: "Accreditation status needs verification",
            value: "verification-needed",
          },
        ],
      },
    }),
    defineField({
      name: "featuredOrder",
      title: "Featured display order",
      type: "number",
      group: "content",
      hidden: ({ document }) => !document?.isFeaturedOnHomepage,
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "seo",
      group: "seo",
    }),
    defineField({
      name: "csvLegacyFeeRaw",
      title: "CSV legacy — raw fee value",
      description:
        "Unedited value from University.csv (mixed formats — see PROJECT_STATUS.md). Clear once quickFacts.feeDisplay is confirmed.",
      type: "string",
      group: "migration",
      readOnly: true,
    }),
    defineField({
      name: "csvLegacyDurationRaw",
      title: "CSV legacy — raw duration value",
      description:
        "Uniform placeholder text across all CSV rows — needs real per-university content before launch.",
      type: "string",
      group: "migration",
      readOnly: true,
    }),
    defineField({
      name: "csvLegacyEligibilityRaw",
      title: "CSV legacy — raw eligibility value",
      description:
        "Uniform placeholder text across all CSV rows — needs real per-university content before launch.",
      type: "text",
      rows: 2,
      group: "migration",
      readOnly: true,
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "positioningStatement", media: "logo" },
  },
});
