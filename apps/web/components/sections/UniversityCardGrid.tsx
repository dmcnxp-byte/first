import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionHead } from "@/components/ui/SectionHead";
import { Badge } from "@/components/ui/Badge";
import type { University } from "@/lib/sanity/types/university";

// Featured Universities grid — DOC/REQUIREMENTS_ANALYSIS.md § 9. Universities
// themselves link to `/universities/[slug]/`, a route not built until the
// University detail-page phase — links are rendered as real `<Link>`s now so
// no markup churn is needed later, but resolve to a 404 until that route
// ships (documented in PROJECT_STATUS.md, consistent with `dynamicParams`
// per DOC/ROUTING_STRATEGY.md § 1).
export function UniversityCardGrid({
  eyebrow,
  heading,
  headingAccent,
  viewAllLabel,
  viewAllHref,
  universities,
}: {
  eyebrow?: string;
  heading: string;
  headingAccent?: string;
  viewAllLabel?: string;
  viewAllHref?: string;
  universities: University[];
}) {
  return (
    <section className="bg-white py-16 md:py-20">
      <Container>
        <SectionHead
          eyebrow={eyebrow}
          heading={heading}
          headingAccent={headingAccent}
          action={
            viewAllLabel && viewAllHref ? (
              <Link
                href={viewAllHref}
                className="text-navy hover:text-saffron font-semibold"
              >
                {viewAllLabel} →
              </Link>
            ) : undefined
          }
        />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {universities.map((university) => (
            <article
              key={university._id}
              className="border-hairline flex flex-col gap-4 rounded-xl border bg-white p-6 transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_28px_-16px_rgba(11,31,77,0.12)]"
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-display text-navy text-base font-semibold">
                  {university.name}
                </h3>
                {university.trustBadges?.[0] ? (
                  <Badge tone="accreditation">{university.trustBadges[0].label}</Badge>
                ) : null}
              </div>
              <div className="text-slate grid grid-cols-2 gap-3 text-sm">
                <div>
                  Fee
                  <br />
                  <strong className="text-navy">
                    {university.quickFacts.feeDisplay}
                  </strong>
                </div>
                <div>
                  Duration
                  <br />
                  <strong className="text-navy">
                    {university.quickFacts.durationDisplay}
                  </strong>
                </div>
              </div>
              <div className="bg-mist rounded-lg p-3 text-sm">
                <em className="text-navy font-semibold not-italic">Best for </em>
                {university.positioningStatement}
              </div>
              <Link
                href={`/universities/${university.slug}`}
                className="text-navy hover:text-saffron mt-auto text-sm font-semibold"
              >
                Learn more →
              </Link>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
