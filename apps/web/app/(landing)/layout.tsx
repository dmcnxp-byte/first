// Route-group layout for paid-traffic Campaign Landing Pages (/lp/*).
// Per DOC/LAYOUT_ARCHITECTURE.md this will render <Header variant="minimal" />
// and <Footer variant="minimal" /> once those components exist (Phase 3).
export default function LandingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
