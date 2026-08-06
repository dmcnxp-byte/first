// Route-group layout for the public marketing site.
// Per DOC/LAYOUT_ARCHITECTURE.md this will render <Header variant="full" />,
// <Footer variant="full" />, <MobileActionBar /> and <ChatWidget /> once those
// components exist (Phase 3). Passthrough only for now.
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
