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
}: {
  quoteText: string;
  attribution?: string;
  cta?: Cta;
}) {
  return (
    <section className="bg-navy py-16 text-center text-white md:py-20">
      <Container narrow>
        <div aria-hidden="true" className="font-display text-saffron-2/60 text-6xl">
          &ldquo;
        </div>
        <p className="font-voice mx-auto max-w-[42ch] text-2xl italic md:text-3xl">
          {quoteText}
        </p>
        {attribution ? (
          <p className="mt-4 text-sm uppercase tracking-wide text-white/70">
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
      </Container>
    </section>
  );
}
