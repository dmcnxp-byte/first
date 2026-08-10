// Shared JSON-LD renderer — DOC/FRONTEND_ARCHITECTURE.md § 3, DOC/SEO_STRATEGY.md § 2.
// Fed by per-page-type schema builder functions in lib/seo/schema/*.ts;
// never hand-authored per page. `<` is escaped per the Next.js JSON-LD guide
// to avoid closing-tag injection via string content from CMS fields.
export function JsonLd({ schema }: { schema: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema).replace(/</g, "\\u003c"),
      }}
    />
  );
}
