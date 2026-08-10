"use client";

import type { AnchorHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

// `tel:` link instrumented as an anonymous, PII-free intent signal —
// DOC/FORMS_ARCHITECTURE.md § 4: "onClick fires a lightweight beacon to
// /api/leads with channel: 'phone_click' and no PII fields."
export function PhoneLink({
  phone,
  pageType,
  className,
  children,
  ...props
}: {
  phone: string;
  pageType: string;
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href">) {
  function onClick() {
    const payload = JSON.stringify({ channel: "phone_click", context: { pageType } });
    if (navigator.sendBeacon) {
      navigator.sendBeacon(
        "/api/leads",
        new Blob([payload], { type: "application/json" }),
      );
    } else {
      fetch("/api/leads", {
        method: "POST",
        body: payload,
        keepalive: true,
        headers: { "Content-Type": "application/json" },
      }).catch(() => undefined);
    }
  }

  return (
    <a href={`tel:${phone}`} onClick={onClick} className={cn(className)} {...props}>
      {children}
    </a>
  );
}
