"use client";

import type { AnchorHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

// WhatsApp deep link — DOC/FORMS_ARCHITECTURE.md § 4: fixed `wa.me` format,
// `programme_name` interpolated at render time (never hardcoded per page),
// instrumented the same way as PhoneLink (anonymous intent signal).
export function WhatsAppLink({
  whatsappNumber,
  programmeName,
  pageType,
  className,
  children,
  ...props
}: {
  whatsappNumber: string;
  programmeName: string;
  pageType: string;
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href">) {
  const href = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`I'm interested in ${programmeName}`)}`;

  function onClick() {
    const payload = JSON.stringify({ channel: "whatsapp_click", context: { pageType } });
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
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onClick}
      className={cn(className)}
      {...props}
    >
      {children}
    </a>
  );
}
