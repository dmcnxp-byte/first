# Git Workflow

## 1. Branching model

Trunk-based with short-lived feature branches — appropriate for a small-to-mid team shipping continuously against Vercel's preview-per-PR model (not Git Flow's long-lived release branches, which would fight the deployment strategy in [DEPLOYMENT_STRATEGY.md](DEPLOYMENT_STRATEGY.md)).

```
main                 — always deployable; auto-deploys to Production on merge
 └─ feat/<slug>       — one feature/task, branched from main
 └─ fix/<slug>        — bug fix
 └─ chore/<slug>      — tooling, deps, docs
 └─ content/<slug>    — schema-only changes to Sanity schema types (reviewed by both dev + content lead)
```

No `develop` branch, no `release/*` branches — every PR to `main` gets its own Vercel Preview Deployment (see [DEPLOYMENT_STRATEGY.md § 2](DEPLOYMENT_STRATEGY.md#2-promotion-flow)), which serves the role a shared staging branch would otherwise play, without the merge-conflict overhead of keeping a long-lived branch in sync.

## 2. Branch naming

`<type>/<short-kebab-slug>`, e.g. `feat/compare-page-template`, `fix/lead-form-phone-validation`, `content/university-schema-fee-fields`. Type prefixes match Conventional Commits types (§3) so branch and commit history stay legible together.

## 3. Commit convention

[Conventional Commits](https://www.conventionalcommits.org/): `type(scope): summary`

| Type | Use |
|---|---|
| `feat` | new capability |
| `fix` | bug fix |
| `refactor` | no behavior change |
| `perf` | performance improvement |
| `docs` | documentation only (including `/DOC` updates) |
| `chore` | tooling/deps |
| `content-schema` | Sanity schema type changes (distinct from `feat` so schema migrations are easy to `git log` for) |
| `test` | test-only changes |

Scope examples: `(university-page)`, `(lead-form)`, `(sanity-schema)`, `(supabase)`. Breaking changes flagged with `!` after type/scope, per Conventional Commits.

## 4. Pull request process

1. Branch from `main`, open a PR as soon as work starts (draft PR) so the preview deployment is available early for stakeholder/content review.
2. PR description must state: what changed, which requirement/doc it satisfies (link to the relevant `/DOC` file), and a manual test note for anything not covered by automated tests.
3. Required checks before merge (see [DEPLOYMENT_STRATEGY.md](DEPLOYMENT_STRATEGY.md) for CI specifics): typecheck, lint, unit tests, Lighthouse budget gate on the preview URL.
4. At least one reviewer approval; schema changes (`content-schema/*` branches) additionally require sign-off from whoever owns the content/editorial side, since a schema change can break existing published documents.
5. Squash-merge to `main` — keeps the trunk's history one commit per logical change, matching the PR's own conventional-commit-formatted title.
6. Delete the branch on merge.

## 5. Environment/config safety

- `.env.local`, Supabase service-role keys, and Sanity write tokens are **never committed** — enforced by `.gitignore` plus a pre-commit secret-scan hook (see [DEVELOPMENT_GUIDELINES.md](DEVELOPMENT_GUIDELINES.md)).
- Environment variable *names* (not values) are documented in an `.env.example` checked into the repo, kept in sync with the matrix in [DEPLOYMENT_STRATEGY.md § 4](DEPLOYMENT_STRATEGY.md#4-environment-variables).

## 6. Tagging & releases

Because Vercel deploys `main` continuously, there is no separate "release" ceremony — a lightweight `vX.Y.Z` git tag is cut on `main` only at meaningful milestones (e.g. "Sprint 1 launch," "Phase 2 complete") for traceability against the phased rollout in [PROJECT_STATUS.md](PROJECT_STATUS.md), not as a deployment trigger.
