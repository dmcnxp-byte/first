import type { Metadata } from "next";
import { sanityFetch } from "@/lib/sanity/fetch";
import { homePageQuery, pageTag } from "@/lib/sanity/queries/page";
import type { Page } from "@/lib/sanity/types/page";
import { SectionRenderer } from "@/components/page-builder/SectionRenderer";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildFaqPageSchema } from "@/lib/seo/schema/faq";
import { buildMetadataFromSeo } from "@/lib/seo/metadata";
import { siteUrl } from "@/lib/seo/site";

// Homepage — DOC/PAGE_BUILDER_ARCHITECTURE.md: Page (the one `page` document
// flagged isHomepage: true) -> ordered `sections` array -> SectionRenderer ->
// registered adapters -> composed section components. Every future page
// (app/(site)/[slug]/page.tsx) uses this exact same shape. No hardcoded
// content; every section comes from Sanity (FR-2).
export async function generateMetadata(): Promise<Metadata> {
  const page = await sanityFetch<Page>({ query: homePageQuery, tags: [pageTag] });
  if (!page?.seo) {
    return { title: "Distance MBA College" };
  }
  return buildMetadataFromSeo(page.seo, siteUrl, "/");
}

export default async function HomePage() {
  const page = await sanityFetch<Page>({ query: homePageQuery, tags: [pageTag] });

  if (!page) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-24 text-center">
        <p className="text-slate text-sm font-semibold tracking-wide uppercase">
          Distance MBA College
        </p>
        <h1 className="font-display text-navy mt-4 text-2xl font-semibold">
          Homepage content isn&apos;t available yet
        </h1>
        <p className="text-slate mt-2">
          No Page document with isHomepage:true was found in Sanity — either no project is
          connected yet, or that Page hasn&apos;t been created. See{" "}
          <code>DOC/PROJECT_STATUS.md</code>.
        </p>
      </div>
    );
  }

  const faqBlock = page.sections.find((block) => block._type === "faqBlock");

  return (
    <>
      {faqBlock && faqBlock._type === "faqBlock" ? (
        <JsonLd schema={buildFaqPageSchema(faqBlock.items)} />
      ) : null}
      <SectionRenderer
        blocks={page.sections}
        page={{ pageType: "homepage", slug: page.slug || "home", documentId: page._id }}
      />
    </>
  );
}
