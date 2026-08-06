// Placeholder only — the real Homepage is a Sanity page-builder-driven document.
// See DOC/PAGE_BUILDER_ARCHITECTURE.md. Implementation begins in Phase 3.
export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center p-8 text-center">
      <div>
        <p className="text-sm uppercase tracking-wide text-neutral-500">
          Distance MBA College
        </p>
        <h1 className="mt-2 text-2xl font-semibold">
          Technical foundation initialized — Phase 2
        </h1>
        <p className="mt-2 text-sm text-neutral-500">
          Homepage content ships in Phase 3. See <code>/DOC</code> for architecture.
        </p>
      </div>
    </main>
  );
}
