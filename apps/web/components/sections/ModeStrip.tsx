import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionHead } from "@/components/ui/SectionHead";
import type { Programme } from "@/lib/sanity/types/programme";

// Four-mode explainer strip — DOC/REQUIREMENTS_ANALYSIS.md § 9 Homepage sections.
export function ModeStrip({
  eyebrow,
  heading,
  headingAccent,
  intro,
  modes,
}: {
  eyebrow?: string;
  heading: string;
  headingAccent?: string;
  intro?: string;
  modes: Programme[];
}) {
  const sorted = [...modes].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  return (
    <section className="py-16 md:py-20">
      <Container>
        <SectionHead
          eyebrow={eyebrow}
          heading={heading}
          headingAccent={headingAccent}
          intro={intro}
        />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {sorted.map((mode) => (
            <Link
              key={mode._id}
              href={`/programmes/${mode.slug}`}
              className="border-hairline hover:border-saffron group flex flex-col gap-3 rounded-xl border bg-white p-6 transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_28px_-16px_rgba(11,31,77,0.12)]"
            >
              <h3 className="font-display text-navy text-lg font-semibold">
                {mode.modeName}
              </h3>
              <p className="text-slate text-sm font-medium">
                {mode.feeRange} · {mode.durationLabel} · {mode.formatLabel}
              </p>
              <p className="text-slate text-sm">{mode.summary}</p>
              <div className="bg-mist mt-auto rounded-lg p-3 text-sm">
                <strong className="text-navy block">Best for</strong>
                {mode.bestFor}
              </div>
              <span className="text-navy group-hover:text-saffron text-sm font-semibold">
                Explore {mode.modeName} →
              </span>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
