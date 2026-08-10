import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Button } from "@/components/ui/Button";
import type { Cta } from "@/lib/sanity/types/shared";

// Lightweight banner CTA — DOC brief's "CTA" section option. No form, no
// chat — a heading and one button, for a mid-page nudge.
export function CtaBanner({
  heading,
  subhead,
  cta,
}: {
  heading: string;
  subhead?: string;
  cta: Cta;
}) {
  return (
    <section className="bg-navy py-16 text-center text-white md:py-20">
      <Container narrow>
        <Heading as="h2" onNavy>
          {heading}
        </Heading>
        {subhead ? (
          <p className="mx-auto mt-4 max-w-[60ch] text-white/80">{subhead}</p>
        ) : null}
        <div className="mt-8 flex justify-center">
          <Button href={cta.href} variant="primary" size="lg" withArrow>
            {cta.label}
          </Button>
        </div>
      </Container>
    </section>
  );
}
