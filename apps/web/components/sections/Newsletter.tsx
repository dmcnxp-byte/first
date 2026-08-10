import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Heading } from "@/components/ui/Heading";
import { LeadForm } from "@/components/forms/LeadForm";
import type { LeadFormConfig } from "@/lib/sanity/types/shared";
import type { LeadSourceContext } from "@/lib/leads/scoring";

// Compact newsletter signup band — DOC brief's "Newsletter" section option.
// Reuses the same config-driven `LeadForm` as "Contact Form"/`leadFormBlock`
// rather than a bespoke email-capture component. `pageType` stays fixed at
// "newsletter" (a signup here is its own distinct source channel regardless
// of which page hosts it), but the page/document identity still comes from
// whichever page rendered this block, not a hardcoded assumption.
export function Newsletter({
  eyebrow,
  heading,
  headingAccent,
  subhead,
  form,
  source,
}: {
  eyebrow?: string;
  heading: string;
  headingAccent?: string;
  subhead?: string;
  form: LeadFormConfig;
  source: Pick<LeadSourceContext, "slug" | "documentId">;
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
          <LeadForm config={form} context={{ pageType: "newsletter", ...source }} />
        </div>
      </Container>
    </section>
  );
}
