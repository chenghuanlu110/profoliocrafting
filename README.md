# Engineering Portfolio

A dark, research-oriented engineering portfolio for EE PhD applications. Built around a
five-card project deck that drives an evidence-based case study directly below it.

**Status:** Phase 1, visual prototype. All project content is labelled placeholder data.
No authentication or Developer Studio yet. See `docs/ARCHITECTURE_PLAN.md`.

## Stack

Next.js 16 (App Router, static generation) · React 19 · TypeScript 5 · Tailwind CSS 4 ·
Motion for React. Planned: Supabase (Postgres, Auth, Storage), GitHub, Vercel.

## Run locally

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build + type check
npm run typecheck
```

Requires Node.js 20+. Fonts (Inter, Space Grotesk, JetBrains Mono) are downloaded and
self-hosted at build time by `next/font`.

## Routes

| Route | Purpose |
|---|---|
| `/` | Home (hero, about, education & honors, expertise) + Projects experience |
| `/projects` | Projects experience |
| `/projects/{slug}` | Deep link: same experience with that project active (SSG, own metadata) |
| `/resume` | CV download (placeholder until a PDF is added) |

## Editing content (Phase 1)

- Profile/home: `src/content/site.ts`
- Projects and categories: `src/content/projects.ts` (shape: `src/content/schema.ts`, docs: `CONTENT_SCHEMA.md`)
- Only `publication: "published"` projects appear publicly; drafts get no route.
- Order is the `order` field (owner-controlled, not chronological).

## Deploy (Vercel)

Import the GitHub repo in Vercel, set `NEXT_PUBLIC_SITE_URL` to the production origin,
and protect `main` (see `SECURITY.md`). No other env vars are needed in Phase 1.

## Documentation

`AGENTS.md` (AI assistants) · `PROJECT_STRUCTURE.md` · `CONTENT_SCHEMA.md` · `SECURITY.md` ·
`CHANGELOG.md` · `docs/ARCHITECTURE_PLAN.md`
