import { cn } from "@/lib/utils/cn";
import { Eyebrow } from "./Eyebrow";
import { Heading } from "./Heading";

// `.section-head` — DOC/REQUIREMENTS_ANALYSIS.md § 7 `SectionHead`: eyebrow +
// H2 (optional italic accent) + optional intro paragraph + optional
// right-aligned "view all" action.
export function SectionHead({
  eyebrow,
  heading,
  headingAccent,
  intro,
  action,
  center,
  className,
}: {
  eyebrow?: string;
  heading: string;
  headingAccent?: string;
  intro?: string;
  action?: React.ReactNode;
  center?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between",
        center && "mx-auto max-w-[720px] flex-col items-center text-center",
        className,
      )}
    >
      <div>
        {eyebrow ? <Eyebrow center={center}>{eyebrow}</Eyebrow> : null}
        <Heading as="h2" accent={headingAccent}>
          {heading}
        </Heading>
        {intro ? <p className="text-slate mt-4 max-w-[60ch] text-lg">{intro}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
