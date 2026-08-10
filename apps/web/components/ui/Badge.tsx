import { cn } from "@/lib/utils/cn";

// Text-only accreditation/status pill — DOC/COMPONENT_ARCHITECTURE.md § 2
// `Badge` contract (no logo-image slot).
export type BadgeTone = "accreditation" | "success" | "neutral";

const toneClasses: Record<BadgeTone, string> = {
  accreditation: "bg-saffron-50 text-navy border-saffron/30",
  success: "bg-[#ECFDF5] text-[#047857] border-success/30",
  neutral: "bg-mist text-slate border-hairline",
};

export function Badge({
  tone = "accreditation",
  children,
  className,
}: {
  tone?: BadgeTone;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center whitespace-nowrap rounded-full border px-3 py-1 text-xs font-semibold",
        toneClasses[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
