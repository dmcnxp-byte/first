import { cn } from "@/lib/utils/cn";

// `.wrap` / `.wrap-narrow` from design/homepage.html — DOC/REQUIREMENTS_ANALYSIS.md § 12
// layout tokens (max content width 1180px / 880px narrow, 24px+ gutter).
export function Container({
  narrow,
  className,
  children,
}: {
  narrow?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "mx-auto px-[clamp(20px,4vw,48px)]",
        narrow ? "max-w-(--container-narrow)" : "max-w-(--container-max)",
        className,
      )}
    >
      {children}
    </div>
  );
}
