import { cloneElement, isValidElement, useId } from "react";
import { cn } from "@/lib/utils/cn";

// Field primitive — always generates a matched id/htmlFor pair
// programmatically, per DOC/COMPONENT_ARCHITECTURE.md § 5's accessibility
// contract ("never left to per-page markup"; fixes the mockups' inconsistent
// id/label pairing).
export function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactElement<{ id?: string }>;
  className?: string;
}) {
  const id = useId();
  const input = isValidElement(children) ? cloneElement(children, { id }) : children;

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label
        htmlFor={id}
        className="text-slate text-xs font-semibold uppercase tracking-wide"
      >
        {label}
      </label>
      {input}
    </div>
  );
}
