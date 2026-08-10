import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionHead } from "@/components/ui/SectionHead";
import type { ComparisonTeaser } from "@/lib/sanity/types/page";

// Registered per the approved pageBuilder block list (DOC/PAGE_BUILDER_ARCHITECTURE.md § 2)
// — not part of the Homepage's current default preset, see comparisonPreviewBlock.ts.
export function ComparisonPreview({
  eyebrow,
  heading,
  headingAccent,
  items,
}: {
  eyebrow?: string;
  heading: string;
  headingAccent?: string;
  items?: ComparisonTeaser[];
}) {
  if (!items || items.length === 0) return null;

  return (
    <section className="py-16 md:py-20">
      <Container>
        <SectionHead eyebrow={eyebrow} heading={heading} headingAccent={headingAccent} />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <Link
              key={item._key}
              href={item.href ?? "#"}
              className="border-hairline text-navy rounded-xl border bg-white p-5 font-semibold hover:shadow-[0_12px_28px_-16px_rgba(11,31,77,0.12)]"
            >
              {item.entityAName} vs {item.entityBName} →
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
