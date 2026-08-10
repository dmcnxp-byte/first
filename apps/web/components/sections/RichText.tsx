import { Container } from "@/components/ui/Container";

// Minimal Portable Text renderer — DOC/PAGE_BUILDER_ARCHITECTURE.md § 2's
// "escape hatch for ad-hoc marketing copy." Handles the standard block/span/
// mark shape (paragraphs, h2-h4, bold/italic/underline, links) without the
// `@portabletext/react` package, which can't be installed in this sandboxed
// environment (no npm registry access — see PROJECT_STATUS.md). Swap in the
// real package with no content-model changes once registry access exists.

type PortableTextSpan = { _type: "span"; text: string; marks?: string[] };
type PortableTextMarkDef = { _key: string; _type: string; href?: string };
type PortableTextBlock = {
  _key: string;
  _type: "block";
  style?: string;
  children: PortableTextSpan[];
  markDefs?: PortableTextMarkDef[];
};

function renderSpan(
  span: PortableTextSpan,
  markDefs: PortableTextMarkDef[] = [],
  key: string,
) {
  let node: React.ReactNode = span.text;

  for (const mark of span.marks ?? []) {
    if (mark === "strong") node = <strong key={`${key}-strong`}>{node}</strong>;
    else if (mark === "em") node = <em key={`${key}-em`}>{node}</em>;
    else if (mark === "underline") node = <u key={`${key}-u`}>{node}</u>;
    else {
      const linkDef = markDefs.find((def) => def._key === mark && def._type === "link");
      if (linkDef?.href) {
        node = (
          <a
            key={`${key}-link`}
            href={linkDef.href}
            className="text-navy hover:text-saffron underline"
          >
            {node}
          </a>
        );
      }
    }
  }

  return <span key={key}>{node}</span>;
}

export function RichText({ body }: { body: unknown[] }) {
  const blocks = body as PortableTextBlock[];

  return (
    <section className="py-16 md:py-20">
      <Container narrow>
        <div className="prose-content text-ink flex flex-col gap-4">
          {blocks.map((block) => {
            const content = block.children.map((span, i) =>
              renderSpan(span, block.markDefs, `${block._key}-${i}`),
            );
            switch (block.style) {
              case "h2":
                return (
                  <h2
                    key={block._key}
                    className="font-display text-navy text-2xl font-bold"
                  >
                    {content}
                  </h2>
                );
              case "h3":
                return (
                  <h3
                    key={block._key}
                    className="font-display text-navy text-xl font-semibold"
                  >
                    {content}
                  </h3>
                );
              case "h4":
                return (
                  <h4
                    key={block._key}
                    className="font-display text-navy text-lg font-semibold"
                  >
                    {content}
                  </h4>
                );
              default:
                return (
                  <p key={block._key} className="text-slate text-lg">
                    {content}
                  </p>
                );
            }
          })}
        </div>
      </Container>
    </section>
  );
}
