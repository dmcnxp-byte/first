import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { sanityFetch } from "@/lib/sanity/fetch";
import { sanityClient } from "@/lib/sanity/client";
import { allPageSlugsQuery, pageBySlugQuery, pageTag } from "@/lib/sanity/queries/page";
import type { Page } from "@/lib/sanity/types/page";
import { SectionRenderer } from "@/components/page-builder/SectionRenderer";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildFaqPageSchema } from "@/lib/seo/schema/faq";
import { buildMetadataFromSeo } from "@/lib/seo/metadata";
import { siteUrl } from "@/lib/seo/site";

// Generic Page route — the same architecture the Homepage uses
// (app/(site)/page.tsx), reused for every other page-builder page (Landing,
// Compare, Resources, etc. — DOC/PAGE_BUILDER_ARCHITECTURE.md). New pages
// need no route/code changes: create the `page` document in Sanity, done.
// Build-time only — reads directly via the published-content client instead
// of `sanityFetch`, since `generateStaticParams` runs outside any request
// context and can't call `draftMode()` (which `sanityFetch` always does).
export async function generateStaticParams() {
  try {
    const slugs = await sanityClient.fetch<string[]>(allPageSlugsQuery);
    return (slugs ?? []).map((slug) => ({ slug }));
  } catch (error) {
    console.error("[generateStaticParams] page slug query failed:", error);
    return [];
  }
}

export const dynamicParams = true;

async function getPage(slug: string) {
  return sanityFetch<Page>({
    query: pageBySlugQuery,
    params: { slug },
    tags: [pageTag],
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPage(slug);
  if (!page?.seo) {
    return { title: "Distance MBA College" };
  }
  return buildMetadataFromSeo(page.seo, siteUrl, `/${slug}`);
}

export default async function GenericPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = await getPage(slug);

  if (!page) {
    notFound();
  }

  if (page.isHomepage) {
    redirect("/");
  }

  const faqBlock = page.sections.find((block) => block._type === "faqBlock");

  return (
    <>
      {faqBlock && faqBlock._type === "faqBlock" ? (
        <JsonLd schema={buildFaqPageSchema(faqBlock.items)} />
      ) : null}
      <SectionRenderer blocks={page.sections} />
    </>
  );
}
