import { sanityFetch } from "@/lib/sanity/fetch";
import { siteSettingsQuery, siteSettingsTag } from "@/lib/sanity/queries/siteSettings";
import type { SiteSettings } from "@/lib/sanity/types/siteSettings";
import { FullHeader } from "@/components/layout/FullHeader";
import { FullFooter } from "@/components/layout/FullFooter";
import { MobileActionBar } from "@/components/layout/MobileActionBar";
import { ChatWidgetProvider } from "@/components/chat/ChatWidgetContext";
import { ChatWidget } from "@/components/chat/ChatWidget";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildOrganizationSchema } from "@/lib/seo/schema/organization";
import { buildWebsiteSchema } from "@/lib/seo/schema/website";
import { siteUrl } from "@/lib/seo/site";
import { sanitizeHexColor } from "@/lib/utils/color";

// `(site)` route group layout — full Header/Footer + global chrome, per
// DOC/LAYOUT_ARCHITECTURE.md § 1/4. Site-wide JSON-LD (Organization, WebSite)
// injected once here rather than repeated per page (§ 5). Header/Footer nav
// now comes from Site Settings (the former separate `navigation` singleton
// was absorbed into it — DOC/DATA_MODEL.md § Site Settings) — one fetch,
// one global config document.
//
// Fallback values below cover the case where no real Sanity project is
// connected yet (siteSettings query resolves to null) — see
// PROJECT_STATUS.md open items — so the chrome still renders sensibly rather
// than crashing the route.
export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const siteSettings = await sanityFetch<SiteSettings>({
    query: siteSettingsQuery,
    tags: [siteSettingsTag],
  });

  const phone = siteSettings?.phone ?? "+918669661005";
  const whatsappNumber =
    siteSettings?.whatsappNumber ?? process.env.WHATSAPP_NUMBER ?? "918669661005";
  const siteName = siteSettings?.siteName ?? "Distance MBA College";
  const chatWelcomeMessage =
    siteSettings?.chatWelcomeMessage ??
    "Hi! I'm Aarya, the Distance MBA College AI counsellor. What are you exploring today?";

  const primaryColor = sanitizeHexColor(siteSettings?.theme?.primaryColorOverride);
  const accentColor = sanitizeHexColor(siteSettings?.theme?.accentColorOverride);

  return (
    <ChatWidgetProvider>
      {primaryColor || accentColor ? (
        <style>{`:root{${primaryColor ? `--color-navy:${primaryColor};` : ""}${
          accentColor ? `--color-saffron:${accentColor};` : ""
        }}`}</style>
      ) : null}

      <JsonLd schema={buildOrganizationSchema(siteUrl, siteSettings)} />
      <JsonLd schema={buildWebsiteSchema(siteUrl, siteName)} />

      <FullHeader
        phone={phone}
        programmesLinks={siteSettings?.headerProgrammesLinks ?? []}
        universitiesLinks={siteSettings?.headerUniversitiesLinks ?? []}
      />

      <main>{children}</main>

      <FullFooter
        tagline={siteSettings?.tagline}
        legalEntityName={siteSettings?.legalEntityName}
        cin={siteSettings?.cin}
        registeredOfficeAddress={siteSettings?.registeredOfficeAddress}
        footerColumns={siteSettings?.footerColumns ?? []}
      />

      <MobileActionBar phone={phone} whatsappNumber={whatsappNumber} />
      <ChatWidget welcomeMessage={chatWelcomeMessage} />
    </ChatWidgetProvider>
  );
}
