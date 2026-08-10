"use client";

import { PhoneLink } from "@/components/ui/PhoneLink";
import { WhatsAppLink } from "@/components/ui/WhatsAppLink";
import { useChatWidget } from "@/components/chat/ChatWidgetContext";

// Fixed bottom conversion bar, ≤880px — DOC/REQUIREMENTS_ANALYSIS.md § 7
// `MobileActionBar`: 3 data-driven slots, third slot content-driven by route
// group (`chat` on (site), per DOC/LAYOUT_ARCHITECTURE.md § 4).
export function MobileActionBar({
  phone,
  whatsappNumber,
}: {
  phone: string;
  whatsappNumber: string;
}) {
  const { openChat } = useChatWidget();

  return (
    <div className="border-hairline fixed inset-x-0 bottom-0 z-40 grid h-16 grid-cols-3 border-t bg-white shadow-[0_-4px_12px_rgba(11,31,77,0.08)] md:hidden print:hidden">
      <PhoneLink
        phone={phone}
        pageType="homepage"
        className="text-navy flex flex-col items-center justify-center gap-1 text-xs font-medium"
      >
        <span aria-hidden="true" className="text-lg">
          ☎
        </span>
        Call
      </PhoneLink>
      <WhatsAppLink
        whatsappNumber={whatsappNumber}
        programmeName="a distance MBA"
        pageType="homepage"
        className="text-navy flex flex-col items-center justify-center gap-1 text-xs font-medium"
      >
        <span aria-hidden="true" className="text-lg">
          💬
        </span>
        WhatsApp
      </WhatsAppLink>
      <button
        type="button"
        onClick={() => openChat()}
        className="bg-saffron text-navy flex flex-col items-center justify-center gap-1 text-xs font-semibold"
      >
        <span aria-hidden="true" className="text-lg">
          🤖
        </span>
        Chat with Aarya
      </button>
    </div>
  );
}
