import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Heading } from "@/components/ui/Heading";
import { LeadForm } from "@/components/forms/LeadForm";
import type { LeadFormConfig } from "@/lib/sanity/types/shared";
import type { LeadSourceContext } from "@/lib/leads/scoring";

// Lead capture section — DOC/REQUIREMENTS_ANALYSIS.md § 9, 2-col layout
// (copy + trust bullets beside the form card). Page-agnostic: the page that
// renders this block (via SectionRenderer) supplies its own identity through
// `source` — this component never hardcodes which page it's on, so the same
// leadFormBlock works unchanged on the Homepage, a future university page, or
// any other page-builder page.
export function LeadFormSection({
  eyebrow,
  heading,
  headingAccent,
  intro,
  bullets,
  form,
  source,
}: {
  eyebrow?: string;
  heading: string;
  headingAccent?: string;
  intro?: string;
  bullets?: string[];
  form: LeadFormConfig;
  source: LeadSourceContext;
}) {
  return (
    <section id="lead" className="py-16 md:py-20">
      <Container>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
            <Heading as="h2" accent={headingAccent}>
              {heading}
            </Heading>
            {intro ? (
              <p className="text-slate mt-4 max-w-[60ch] text-lg">{intro}</p>
            ) : null}
            {bullets && bullets.length > 0 ? (
              <ul className="mt-8 flex flex-col gap-3">
                {bullets.map((bullet) => (
                  <li
                    key={bullet}
                    className="text-ink flex items-start gap-3 text-base leading-normal"
                  >
                    <span
                      aria-hidden="true"
                      className="bg-saffron-50 text-saffron mt-px flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full text-sm font-bold"
                    >
                      ✓
                    </span>
                    {bullet}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
          <LeadForm config={form} context={source} />
        </div>
      </Container>
    </section>
  );
}
