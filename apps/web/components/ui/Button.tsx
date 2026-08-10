import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

// Button primitive — DOC/COMPONENT_ARCHITECTURE.md § 2. Variant styling
// transcribed from design/homepage.html's `.btn*` classes (colors/shadows/
// radii match the brand tokens in app/globals.css exactly).
export type ButtonVariant = "primary" | "secondary" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-md font-semibold font-sans leading-none whitespace-nowrap border-[1.5px] border-transparent transition-[transform,box-shadow,background,color] duration-200 focus-visible:outline-2 focus-visible:outline-saffron focus-visible:outline-offset-2";

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-saffron text-navy shadow-[0_1px_0_rgba(11,31,77,0.08),0_4px_12px_rgba(232,147,14,0.25)] hover:bg-[#d8830a] hover:-translate-y-px",
  secondary: "bg-transparent text-navy border-navy hover:bg-navy hover:text-white",
  ghost: "text-navy px-5 hover:text-saffron",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-[18px] py-[10px] text-sm",
  md: "px-7 py-[14px] text-base",
  lg: "px-8 py-[18px] text-lg",
};

type CommonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  block?: boolean;
  withArrow?: boolean;
  className?: string;
  children: React.ReactNode;
};

type ButtonAsButton = CommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof CommonProps> & { href?: undefined };

type ButtonAsAnchor = CommonProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof CommonProps> & { href: string };

export type ButtonProps = ButtonAsButton | ButtonAsAnchor;

export function Button({
  variant = "primary",
  size = "md",
  block,
  withArrow,
  className,
  children,
  ...props
}: ButtonProps) {
  const classes = cn(
    base,
    variantClasses[variant],
    variant !== "ghost" && sizeClasses[size],
    variant === "ghost" && size !== "md" && sizeClasses[size],
    block && "w-full",
    className,
  );

  const content = withArrow ? (
    <>
      {children}
      <span
        className="transition-transform duration-200 group-hover:translate-x-[3px]"
        aria-hidden="true"
      >
        →
      </span>
    </>
  ) : (
    children
  );

  if ("href" in props && props.href) {
    const { href, ...anchorProps } = props;
    const isInPageOrExternal =
      href.startsWith("#") ||
      href.startsWith("http") ||
      href.startsWith("mailto:") ||
      href.startsWith("tel:");
    if (isInPageOrExternal) {
      return (
        <a href={href} className={cn(classes, "group")} {...anchorProps}>
          {content}
        </a>
      );
    }
    return (
      <Link href={href} className={cn(classes, "group")} {...anchorProps}>
        {content}
      </Link>
    );
  }

  const { ...buttonProps } = props as ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button className={cn(classes, "group")} {...buttonProps}>
      {content}
    </button>
  );
}
