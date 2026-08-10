import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Heading } from "@/components/ui/Heading";
import { LeadForm } from "@/components/forms/LeadForm";
import type { LeadFormConfig } from "@/lib/sanity/types/shared";

// Compact newsletter signup band — DOC brief's "Newsletter" section option.
// Reuses the same config-driven `LeadForm` as "Contact Form"/`leadFormBlock`
// rather than a bespoke email-capture component.
export function Newsletter({
  eyebrow,
  heading,
  headingAccent,
  subhead,
  form,
}: {
  eyebrow?: string;
  heading: string;
  headingAccent?: string;
  subhead?: string;
  form: LeadFormConfig;
}) {
  return (
    <section className="bg-mist py-16 md:py-20">
      <Container narrow>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:items-center">
          <div>
            {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
            <Heading as="h2" accent={headingAccent}>
              {heading}
            </Heading>
            {subhead ? <p className="text-slate mt-3">{subhead}</p> : null}
          </div>
          <LeadForm config={form} context={{ pageType: "newsletter" }} />
        </div>
      </Container>
    </section>
  );
}
