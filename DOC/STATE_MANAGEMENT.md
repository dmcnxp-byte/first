# State Management Strategy

This site is content-heavy and read-dominant; the state-management need is deliberately small. This document exists to make explicit what does **not** need a global store, and to define the few places real client state lives.

## 1. Guiding principle

Server Components + URL + cookies cover the large majority of state needs (per [FRONTEND_ARCHITECTURE.md](FRONTEND_ARCHITECTURE.md)'s Server-Component-by-default rule). A global client state library (Redux/Zustand/Jotai) is **not required** for this application — introducing one would be the kind of premature abstraction this project should avoid. Client state is scoped locally to the handful of interactive components identified below.

## 2. State inventory

| State | Where it lives | Why |
|---|---|---|
| Current page content | Server Component render (no client state at all) | Content is fetched server-side per request/build; there's nothing to "manage" client-side |
| Redirect/personalization context (UTM source, last-viewed entity) | HTTP cookie (`dmc_ctx`), read in Middleware and Server Components | Needs to persist across navigations and be readable before first paint to avoid a personalization flash — a cookie, not client state, is the correct tool. Detailed in [AI_PERSONALIZATION_ARCHITECTURE.md](AI_PERSONALIZATION_ARCHITECTURE.md) |
| Lead form field values + validation state | Local component state inside `LeadForm` (`useState`/`useActionState`) | Scoped to one form instance; no other component needs it |
| FAQ accordion open/closed | Local state inside `FAQAccordion`, one boolean set per item | Purely presentational |
| Mobile nav drawer open/closed | Local state inside `Header` | Purely presentational |
| Chat widget: open/closed, message history, current conversation | Local state inside `ChatWidget`, persisted to `sessionStorage` (not a global store) so a reload within the same tab doesn't lose an in-progress conversation | Session-scoped, not app-wide; sessionStorage is sufficient and avoids shipping a state library for one component |
| EMI calculator inputs/results | Local state inside `EMICalcWidget` | Pure client-side computation, no persistence needed |
| Draft Mode flag | Next.js `draftMode()` server API (cookie-backed, framework-managed) | Not application state — handled entirely by the framework |
| Lead score, chat transcript, submitted-lead records | Server-side only (Supabase) — never held in client state after submission | See [SUPABASE_ARCHITECTURE.md](SUPABASE_ARCHITECTURE.md) |

## 3. Data fetching state

Server Components fetch on the server; the few Client Components that need fresh data after mount (e.g., the chat widget's message send, the lead form's submit) use direct `fetch` calls to Route Handlers with plain `useState`/`useTransition`/`useActionState`, not a client data-fetching library (SWR/React Query) — the app has no scenario requiring background refetching, optimistic cache updates across unrelated components, or shared server-state caching on the client that would justify the dependency.

## 4. Cross-component communication

The only cross-component state sharing in the entire app is: (a) the personalization cookie (read by multiple Server Components independently, no client propagation needed), and (b) the Chat widget's "open" trigger, which other components (nav CTA, mobile action bar, AI-invite section) can programmatically invoke — implemented via a small dedicated Context (`ChatWidgetContext`) scoped to the `(site)`/`(landing)` layouts, providing exactly one function (`openChat(seedMessage?)`) and one boolean (`isOpen`). This is intentionally the **only** React Context in the application, chosen because it is genuinely shared across otherwise-unrelated components in the tree (nav, invite section, mobile bar all need to trigger the same widget instance).

## 5. What this rules out

- No global Redux/Zustand/Jotai store.
- No client-side cache of CMS content beyond what React Server Components + Next.js's own fetch cache already provide.
- No client-side routing state beyond what the App Router itself manages.
