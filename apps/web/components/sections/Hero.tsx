import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Heading } from "@/components/ui/Heading";
import { Button } from "@/components/ui/Button";
import type { Cta } from "@/lib/sanity/types/shared";

// Page-opening block — DOC/REQUIREMENTS_ANALYSIS.md § 7 `Hero`.
export function Hero({
  eyebrow,
  heading,
  headingAccent,
  subhead,
  primaryCta,
  secondaryCta,
}: {
  eyebrow?: string;
  heading: string;
  headingAccent?: string;
  subhead?: string;
  primaryCta?: Cta;
  secondaryCta?: Cta;
}) {
  return (
    <section className="pt-[clamp(40px,8vw,96px)] pb-[clamp(40px,7vw,80px)]">
      <Container>
        {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
        <Heading as="h1" accent={headingAccent}>
          {heading}
        </Heading>
        {subhead ? (
          <p className="text-slate mt-6 max-w-[56ch] text-[clamp(1rem,1.6vw,1.125rem)] leading-[1.65]">
            {subhead}
          </p>
        ) : null}
        {primaryCta || secondaryCta ? (
          <div className="mt-10 flex flex-wrap gap-3">
            {primaryCta ? (
              <Button href={primaryCta.href} variant="primary" size="lg" withArrow>
                {primaryCta.label}
              </Button>
            ) : null}
            {secondaryCta ? (
              <Button href={secondaryCta.href} variant="secondary" size="lg">
                {secondaryCta.label}
              </Button>
            ) : null}
          </div>
        ) : null}
      </Container>
    </section>
  );
}
