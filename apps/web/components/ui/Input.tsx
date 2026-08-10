import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

// Input primitive — reproduces the mockups' `+91`-prefixed phone field as a
// real, accessible affix (not a CSS `::before`), per
// DOC/COMPONENT_ARCHITECTURE.md § 2.
export function Input({
  phonePrefix,
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { phonePrefix?: string }) {
  const inputClasses = cn(
    "w-full rounded-md border border-hairline bg-white px-4 py-3 text-base text-ink placeholder:text-slate-2 transition-[border-color,box-shadow] duration-150 focus:border-saffron focus:shadow-[0_0_0_4px_rgba(232,147,14,0.15)] focus:outline-none",
    phonePrefix && "rounded-l-none",
    className,
  );

  if (phonePrefix) {
    return (
      <div className="flex items-stretch">
        <span className="border-hairline bg-mist text-slate flex items-center rounded-l-md border border-r-0 px-3 text-base">
          {phonePrefix}
        </span>
        <input className={inputClasses} {...props} />
      </div>
    );
  }

  return <input className={inputClasses} {...props} />;
}
