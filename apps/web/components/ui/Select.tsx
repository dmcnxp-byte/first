import type { SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

export function Select({
  options,
  className,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & { options: string[] }) {
  return (
    <select
      className={cn(
        "border-hairline text-ink focus:border-saffron w-full rounded-md border bg-white px-4 py-3 text-base transition-[border-color,box-shadow] duration-150 focus:shadow-[0_0_0_4px_rgba(232,147,14,0.15)] focus:outline-none",
        className,
      )}
      {...props}
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}
