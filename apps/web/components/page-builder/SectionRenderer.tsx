import { blockRegistry, type RenderOptions } from "./registry";
import { StickySidebarRegion } from "./StickySidebarRegion";
import { SelectedUniversityProvider } from "@/components/forms/SelectedUniversityContext";
import type { PageBuilderBlock, HeroSplitBlock } from "@/lib/sanity/types/page";
import type { LeadSourceContext } from "@/lib/leads/scoring";

type AnyBlockRenderer = (
  block: PageBuilderBlock,
  page: LeadSourceContext,
  opts?: RenderOptions,
) => React.ReactNode | Promise<React.ReactNode>;

async function renderBlocks(
  blocks: PageBuilderBlock[],
  page: LeadSourceContext,
  registry: Record<string, AnyBlockRenderer>,
  opts?: RenderOptions,
) {
  const rendered = await Promise.all(
    blocks.map(async (block) => {
      const renderer = registry[block._type];
      if (!renderer) return null;
      return { key: block._key, node: await renderer(block, page, opts) };
    }),
  );
  return rendered.map((entry) =>
    entry ? <div key={entry.key}>{entry.node}</div> : null,
  );
}

// SectionRenderer — DOC/PAGE_BUILDER_ARCHITECTURE.md § 3: switches on each
// block's `_type` and hands it to the matching registry adapter. An unknown
// block type fails soft (renders nothing) rather than crashing the page.
// `page` is this page's own identity (never assumed by any adapter or by
// LeadForm/LeadFormSection themselves) — only the leadFormBlock/newsletterBlock
// adapters actually use it; every other adapter ignores the extra argument.
//
// Special case: a `heroSplitBlock` (design/top-distance-mba-finance.html's
// two-column campaign-landing-page hero) marks the start of a
// sticky-sidebar region — see StickySidebarRegion.tsx for the CSS mechanism.
// Everything from that block to the end of `blocks` (i.e. the rest of this
// page's own sections — the global footer is never part of `blocks`, so the
// region always ends exactly where this page's content does) renders inside
// one shared two-column layout instead of the plain stacked single column.
// Pages without a `heroSplitBlock` are entirely unaffected.
export async function SectionRenderer({
  blocks,
  page,
}: {
  blocks: PageBuilderBlock[];
  page: LeadSourceContext;
}) {
  const registry = blockRegistry as unknown as Record<string, AnyBlockRenderer>;

  const heroSplitIndex = blocks.findIndex((block) => block._type === "heroSplitBlock");

  if (heroSplitIndex === -1) {
    const rendered = await renderBlocks(blocks, page, registry);
    return <SelectedUniversityProvider>{rendered}</SelectedUniversityProvider>;
  }

  const before = blocks.slice(0, heroSplitIndex);
  const heroBlock = blocks[heroSplitIndex] as HeroSplitBlock;
  const after = blocks.slice(heroSplitIndex + 1);

  const [beforeRendered, heroContent, afterRendered] = await Promise.all([
    renderBlocks(before, page, registry),
    registry.heroSplitBlock(heroBlock, page),
    renderBlocks(after, page, registry, { bare: true }),
  ]);

  return (
    <SelectedUniversityProvider>
      {beforeRendered}
      <StickySidebarRegion heroContent={heroContent} form={heroBlock.form} source={page}>
        {afterRendered}
      </StickySidebarRegion>
    </SelectedUniversityProvider>
  );
}
