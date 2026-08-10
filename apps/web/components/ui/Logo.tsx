import Link from "next/link";
import { cn } from "@/lib/utils/cn";

// Brand lockup (icon + wordmark) — inline SVG transcribed from
// design/homepage.html's nav/footer markup. `reverse` variant is used on
// navy surfaces (Footer) per DOC/FRONTEND_ARCHITECTURE.md § 4's logo-variant
// requirement; only primary/reverse exist as markup today (mono/stacked/
// icon/monogram need source files per DOC/PROJECT_STATUS.md open item #6).
export function Logo({
  variant = "default",
  className,
}: {
  variant?: "default" | "reverse";
  className?: string;
}) {
  const strokeColor = variant === "reverse" ? "#FFFFFF" : "#0B1F4D";

  return (
    <Link
      href="/"
      className={cn(
        "font-display inline-flex items-center gap-3 text-xl font-medium leading-none tracking-[-0.01em]",
        variant === "reverse" ? "text-white" : "text-navy",
        className,
      )}
    >
      <svg
        width="32"
        height="30"
        viewBox="0 0 100 95"
        aria-hidden="true"
        className="shrink-0"
      >
        <path
          d="M 12 72 L 12 40 L 50 10 L 88 40 L 88 72"
          fill="none"
          stroke={strokeColor}
          strokeWidth="7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M 5 85 Q 50 102 95 80"
          fill="none"
          stroke="#E8930E"
          strokeWidth="6"
          strokeLinecap="round"
        />
      </svg>
      <span>
        <span className="font-medium">Distance </span>
        <span className="text-saffron font-bold">MBA</span>
        <span className="font-medium"> College</span>
      </span>
    </Link>
  );
}
