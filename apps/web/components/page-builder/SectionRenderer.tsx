import { blockRegistry } from "./registry";
import type { PageBuilderBlock } from "@/lib/sanity/types/page";

type AnyBlockRenderer = (
  block: PageBuilderBlock,
) => React.ReactNode | Promise<React.ReactNode>;

// SectionRenderer — DOC/PAGE_BUILDER_ARCHITECTURE.md § 3: switches on each
// block's `_type` and hands it to the matching registry adapter. An unknown
// block type fails soft (renders nothing) rather than crashing the page.
export async function SectionRenderer({ blocks }: { blocks: PageBuilderBlock[] }) {
  const registry = blockRegistry as unknown as Record<string, AnyBlockRenderer>;

  const rendered = await Promise.all(
    blocks.map(async (block) => {
      const renderer = registry[block._type];
      if (!renderer) return null;
      return { key: block._key, node: await renderer(block) };
    }),
  );

  return (
    <>
      {rendered.map((entry) => (entry ? <div key={entry.key}>{entry.node}</div> : null))}
    </>
  );
}
