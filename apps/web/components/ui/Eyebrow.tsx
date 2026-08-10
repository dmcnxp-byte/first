import { cn } from "@/lib/utils/cn";

// `.eyebrow` from design/homepage.html — small saffron label with a leading
// rule, used ahead of nearly every section heading.
export function Eyebrow({
  children,
  center,
  className,
}: {
  children: React.ReactNode;
  center?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "text-saffron mb-6 inline-flex items-center gap-3 font-sans text-xs font-semibold uppercase tracking-[0.18em]",
        center && "justify-center",
        className,
      )}
    >
      <span aria-hidden="true" className="bg-saffron h-0.5 w-7" />
      {children}
    </span>
  );
}
