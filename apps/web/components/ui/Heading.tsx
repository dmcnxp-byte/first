import { cn } from "@/lib/utils/cn";

// h1/h2 base styles + the brand's signature Lora-italic accent span
// (`.ital`) — transcribed from design/homepage.html § TYPOGRAPHY.
// DOC/REQUIREMENTS_ANALYSIS.md § 12: "2-4 italic words inside an otherwise-
// Poppins headline."
type HeadingProps = {
  as: "h1" | "h2";
  children: React.ReactNode;
  accent?: string;
  className?: string;
  onNavy?: boolean;
};

const sizeByLevel = {
  h1: "text-[clamp(2rem,6vw,4rem)] leading-[1.08] tracking-[-0.025em] max-w-[16ch]",
  h2: "text-[clamp(1.75rem,4vw,2.5rem)] max-w-[22ch]",
};

export function Heading({ as: Tag, children, accent, className, onNavy }: HeadingProps) {
  return (
    <Tag
      className={cn(
        "font-display font-bold leading-[1.15] tracking-[-0.02em]",
        onNavy ? "text-white" : "text-navy",
        sizeByLevel[Tag],
        className,
      )}
    >
      {children}
      {accent ? (
        <>
          {" "}
          <span
            className={cn(
              "font-voice font-medium italic",
              onNavy ? "text-saffron-2" : "text-navy-2",
            )}
          >
            {accent}
          </span>
        </>
      ) : null}
    </Tag>
  );
}
