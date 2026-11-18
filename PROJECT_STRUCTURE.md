# Project structure

```
src/
├─ app/                         Routes (App Router)
│  ├─ layout.tsx                Fonts, metadata base, background, header/footer
│  ├─ page.tsx                  Home
│  ├─ projects/page.tsx         Projects index (first project active)
│  ├─ projects/[slug]/page.tsx  Deep link, SSG via generateStaticParams, per-project metadata
│  ├─ resume/page.tsx           CV placeholder
│  ├─ sitemap.ts, robots.ts, not-found.tsx
│  └─ globals.css               Design tokens (@theme) and base styles
├─ components/
│  ├─ background/BackgroundField.tsx   Canvas node field (throttled, reduced-motion aware)
│  ├─ layout/                   SiteHeader, SiteFooter, MotionProvider
│  ├─ home/                     Hero, ProfileSections (About, EducationHonors, Expertise)
│  ├─ projects/
│  │  ├─ ProjectsExperience.tsx Orchestrator (client): gallery + bookmarks + detail
│  │  ├─ useProjectSelection.ts Active index ⇄ URL ⇄ history (single source of truth)
│  │  ├─ StackGallery.tsx       Desktop five-card deck, keyboard + trackpad input
│  │  ├─ SwipeGallery.tsx       Mobile scroll-snap carousel
│  │  ├─ CategoryRail.tsx       Bookmark tabs + index rail; mobile tab row
│  │  └─ ProjectDetail.tsx      Case-study renderer (sections, layouts, disclosure)
│  ├─ blocks/                   BlockRenderer (one case per block type), CodeBlock (highlighter)
│  └─ media/                    Media (next/image | placeholder), PlaceholderArt (SVG motifs)
├─ content/
│  ├─ schema.ts                 Content types — the contract
│  ├─ site.ts                   Profile/home content
│  └─ projects.ts               Categories + projects (placeholder data)
└─ lib/
   ├─ content.ts                Public read layer + pure helpers (markers, labels, paths)
   └─ site-config.ts            Canonical site URL
docs/ARCHITECTURE_PLAN.md       Decisions, risks, phase plan
```

## Data flow

`content/*` → `lib/content.ts` (filters to published, sorts by owner order, builds bookmark
markers) → server pages → `ProjectsExperience` (client) → `useProjectSelection` → all views.

## Planned (not yet present)

`app/studio/*` (Phase 3, private), `app/api/agent/*` (Phase 4), `supabase/migrations/*` (Phase 2),
`lib/validation.ts` (Zod schemas mirroring `schema.ts`).
