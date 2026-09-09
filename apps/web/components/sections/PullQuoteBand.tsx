import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import type { Cta } from "@/lib/sanity/types/shared";

// Brand-promise pull-quote band (navy background) — DOC/REQUIREMENTS_ANALYSIS.md § 9.
// Optional `cta` covers design/resource-distance-mba-guide.html's closing
// quote-with-button variant.
export function PullQuoteBand({
  quoteText,
  attribution,
  cta,
  bare,
}: {
  quoteText: string;
  attribution?: string;
  cta?: Cta;
  bare?: boolean;
}) {
  const content = (
    <>
      <div aria-hidden="true" className="font-display text-saffron-2/60 text-6xl">
        &ldquo;
      </div>
      <p className="font-voice mx-auto max-w-[42ch] text-2xl italic md:text-3xl">
        {quoteText}
      </p>
      {attribution ? (
        <p className="mt-4 text-sm tracking-wide text-white/70 uppercase">
          {attribution}
        </p>
      ) : null}
      {cta ? (
        <div className="mt-8 flex justify-center">
          <Button href={cta.href} variant={cta.style} withArrow>
            {cta.label}
          </Button>
        </div>
      ) : null}
    </>
  );

  if (bare) {
    // No longer full-bleed once nested in the sticky-sidebar's narrower
    // column, so it becomes a contained, rounded navy card instead — same
    // treatment the university/counsellor cards around it already use.
    return (
      <div className="bg-navy my-8 rounded-2xl px-6 py-10 text-center text-white md:my-10 md:px-10 md:py-14">
        {content}
      </div>
    );
  }

  return (
    <section className="bg-navy py-16 text-center text-white md:py-20">
      <Container narrow>{content}</Container>
    </section>
  );
}
