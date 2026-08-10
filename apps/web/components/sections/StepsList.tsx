import { Container } from "@/components/ui/Container";
import { SectionHead } from "@/components/ui/SectionHead";

// Numbered process/steps list — DOC/COMPONENT_ARCHITECTURE.md § 3's
// `StepsList` contract. Step numbers come from array position, not a
// stored field, so reordering in Studio never leaves numbers out of sync.
export function StepsList({
  eyebrow,
  heading,
  headingAccent,
  steps,
}: {
  eyebrow?: string;
  heading: string;
  headingAccent?: string;
  steps: { _key: string; title: string; description?: string }[];
}) {
  return (
    <section className="py-16 md:py-20">
      <Container narrow>
        <SectionHead eyebrow={eyebrow} heading={heading} headingAccent={headingAccent} />
        <ol className="flex flex-col gap-6">
          {steps.map((step, index) => (
            <li key={step._key} className="flex gap-4">
              <span className="bg-saffron text-navy font-display flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold">
                {index + 1}
              </span>
              <div>
                <h3 className="font-display text-navy font-semibold">{step.title}</h3>
                {step.description ? (
                  <p className="text-slate mt-1 text-sm leading-relaxed">
                    {step.description}
                  </p>
                ) : null}
              </div>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
