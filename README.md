# Distance MBA College

Lead-generation advisory platform helping Indian working professionals choose a
Distance, Online, Executive, or Correspondence MBA from an accredited private
university. See [`/DOC`](DOC/PROJECT_OVERVIEW.md) for the full, approved
architecture — this repository implements it.

**Current phase:** Phase 3 — Foundation CMS & Dynamic Homepage. Status and
remaining work tracked in [`DOC/PROJECT_STATUS.md`](DOC/PROJECT_STATUS.md).

## Stack

Next.js (App Router) · React · TypeScript · Tailwind CSS · Sanity Studio (embedded) · Supabase · ESLint · Prettier — deployed on Vercel.

## Repository layout

```
distance-mba-college/
├── apps/web/       # the Next.js application (site + embedded Sanity Studio)
├── DOC/            # approved architecture & requirements documentation
├── design/         # Phase 1 design references (HTML mockups, brand guidelines) — read-only source material
└── scripts/        # one-time data-prep scripts (e.g. University.csv -> Sanity seed NDJSON)
```

Full target structure: [`DOC/FOLDER_STRUCTURE.md`](DOC/FOLDER_STRUCTURE.md).

## Getting started

```bash
npm install
cp .env.example apps/web/.env.local   # fill in real values — see DOC/DEPLOYMENT_STRATEGY.md § 4
npm run dev                            # http://localhost:3000
```

| Command | What it does |
|---|---|
| `npm run dev` | Start the Next.js dev server |
| `npm run build` | Production build |
| `npm run start` | Run the production build |
| `npm run lint` / `npm run lint:fix` | ESLint |
| `npm run typecheck` | TypeScript, no emit |
| `npm run format` / `npm run format:check` | Prettier |

Sanity Studio is embedded in the app at `/studio` once a real Sanity project ID is configured (see `.env.example`).

## Documentation

Everything architectural lives in [`/DOC`](DOC/PROJECT_OVERVIEW.md) and is the source of truth for this codebase — read it before making a structural decision the docs don't already cover. Start with `PROJECT_OVERVIEW.md`, then `REQUIREMENTS_ANALYSIS.md`, then the architecture documents indexed at the bottom of `PROJECT_OVERVIEW.md`.

## Contributing

Branching, commit conventions, and PR process: [`DOC/GIT_WORKFLOW.md`](DOC/GIT_WORKFLOW.md). Coding standards: [`DOC/DEVELOPMENT_GUIDELINES.md`](DOC/DEVELOPMENT_GUIDELINES.md).
