# Architecture Plan & Phase 1 Decisions

Status: **Phase 1 visual prototype built** (this repository). This document answers the
"Initial Assignment" (spec §15) and records the decisions the remaining phases build on.
Items marked **Decision needed** are the owner's call.

---

## 1. Understanding of the product

A dark, research-oriented engineering portfolio whose primary reader is an EE PhD
admissions professor who may spend 60 seconds on it. Its job is to make four things
obvious quickly: *what problem I worked on, what I personally did, how I verified it,
and what did not work*. Honesty is a feature: limitations, failed attempts and
team/individual credit are first-class content types, and metrics are never invented.

The signature element is a horizontal five-card project deck whose active card drives
a case study directly below it, with no page change. Notebook-style category bookmarks
locate categories inside the deck. Every project has a stable, shareable URL.

Later phases add a private Developer Studio (inline editing, draft → preview → publish,
version history) and an owner-gated workflow that lets AI agents propose, but never
publish, changes.

## 2. Page and component hierarchy

```
app/
├─ layout.tsx                 BackgroundField · SiteHeader · <main> · SiteFooter · MotionProvider
├─ page.tsx  (/)              Hero → About → EducationHonors → Expertise → ProjectsExperience
├─ projects/page.tsx          ProjectsExperience (first project active)
├─ projects/[slug]/page.tsx   ProjectsExperience (slug active, SSG, per-project metadata)
├─ resume/page.tsx            CV download (placeholder until uploaded)
├─ sitemap.ts · robots.ts · not-found.tsx
└─ studio/…                   (Phase 3, private) Dashboard · Requests · Log · Versions · Settings

components/
├─ background/BackgroundField        canvas signal-node field
├─ layout/SiteHeader, SiteFooter, MotionProvider
├─ home/Hero, ProfileSections (About, EducationHonors, Expertise), SectionHeading
├─ projects/
│  ├─ ProjectsExperience             orchestrator: owns selection, layout, transitions
│  ├─ useProjectSelection            single source of truth: index ⇄ URL ⇄ history
│  ├─ StackGallery                   desktop five-card deck (+ keyboard, trackpad)
│  ├─ SwipeGallery                   mobile scroll-snap carousel
│  ├─ CategoryRail / CategoryTabsMobile   bookmark tabs + index rail
│  └─ ProjectDetail                  case study: header → overview/takeaways → sections
├─ blocks/BlockRenderer, CodeBlock   one renderer per content block type
└─ media/Media, PlaceholderArt       next/image or generated placeholder art

content/   schema.ts (types) · site.ts · projects.ts       ← Phase 2 moves data to Supabase
lib/       content.ts (read layer, pure helpers) · site-config.ts
```

Rule: components never import `content/*` data directly for projects; they go through
`lib/content.ts`. In Phase 2 only that file changes.

## 3. Visual prototype plan (implemented)

| Area | Desktop | Mobile |
|---|---|---|
| Home | Two-column hero (name, headline, intro, CTAs / framed portrait), About, Education + Honor cards, four Expertise cards (empty areas hidden) | Single column, same order |
| Gallery | Five-card deck, bookmark rail with per-project ticks, prev/next + counter | Bookmark tabs, scroll-snap cards (84 % width, neighbours peek), dot indicator |
| Detail | Header + 6-field meta grid → overview + ≤3 takeaways → sticky section nav + sections (split / stack / gallery layouts; collapsed sections are `<details>`) | Same content, single column, no side nav |

Visual language: deep navy/near-black, Sapphire for identity fills, Ocean for interaction
and light, Jade only for the active marker, "my work" and verified-result accents.
Placeholder content is always visibly tagged (dashed amber pill).

## 4. Five-card horizontal stack

Implemented in `components/projects/StackGallery.tsx`.

- Let C = container width, front card width W = 0.68·C, strip step s = (C − W)/4.
- Each card's depth k = circular distance from the active index.
  Card k is translated `x = k·s` and scaled `1 − 0.06k` **with `transform-origin: right`**.
  Scaling from the right edge keeps each card's right edge at `k·s + W`, so every
  background card exposes exactly one strip of width s (a slice of its cover, never the
  whole image) while getting shorter for depth.
- All geometry is expressed as percentages of W (Motion's percentage `x` is relative to
  the element's own width), so the deck renders correctly on the server with no
  measurement and no layout shift; it also works without JavaScript.
- Inactive cards share one fixed dim overlay (50 %), as specified; depth comes from
  scale, offset and shadow. Overlay is used instead of element opacity so overlapping
  cards don't show through each other.
- With N > 5, the card at k = N−1 is parked off-left (faded, `pointer-events: none`), so
  advancing slides the old front card out to the left; cards at k ≥ 5 wait hidden behind
  the last strip. With N ≤ 5 the front card grows to use the free width.
- Animation: one spring (stiffness 240, damping 32) on `x`/`scale`; `MotionConfig
  reducedMotion="user"` turns transforms into instant changes for reduced-motion users.
- Input: click strip → select; click front card → scroll to case study; ←/→/Home/End when
  the gallery has focus; horizontal trackpad swipes (only gestures whose |Δx| > 1.2·|Δy|
  are consumed, so vertical page scrolling is never hijacked; a 480 ms lock gives one
  step per swipe).

**Decision taken (reversible):** the deck wraps around (next after the last project is the
first), so the five-card window is always full. Alternative: a linear deck that thins out
near the end. One line in `useProjectSelection`/`depthOf` switches it.

## 5. Gallery ⇄ detail synchronisation

- `useProjectSelection` holds one integer, `index`. Gallery, bookmarks, rail, detail,
  `document.title`, the live-region announcement and the URL are all *derived* from it.
  There is no second copy of "active project" that could drift.
- Detail panel: `<AnimatePresence mode="wait">` keyed by slug. Exit 160 ms, enter 320 ms.
  Under rapid switching the outgoing panel finishes its fade and only the **latest**
  selection mounts; intermediate projects never render. Verified with Playwright:
  9 key presses in 360 ms → card, detail and URL agree; never more than one article mounted.
- URL: selection writes `/projects/{slug}` with `history.pushState` (Next.js integrates
  native History API calls with its router, so nothing reloads). Selections < 700 ms apart
  use `replaceState`, so holding an arrow key creates one history entry, not twenty.
  `popstate` re-selects the project in the URL → back/forward works.
- `/projects/{slug}` is statically generated with the project pre-selected, so a shared
  link renders the right card and full case study in the initial HTML (SEO + no flash).

## 6. Data model for editable project sections

Content model: see `CONTENT_SCHEMA.md` (types in `src/content/schema.ts`).
Project → ordered `sections[]` → ordered `blocks[]` (paragraph, list, figure, code,
keyValue, tags, callout, contributions, links). Sections carry `kind`, `layout`,
`disclosure` and `hidden`, so the owner can add/remove/hide/reorder sections and choose
layouts per project. Blocks may carry `source` (provenance) for evidence tracking.

Phase 2 storage (Supabase Postgres):

```
categories        (id, label, sort_order)
projects          (id, slug UNIQUE, category_id, sort_order,
                   draft_revision_id, published_revision_id, updated_at)
project_revisions (id, project_id, content JSONB  -- a full Project document
                   parent_id, created_by, created_at, change_request_id NULL,
                   note)                           -- immutable, append-only
site_revisions    (same pattern for homepage/profile content)
media             (id, storage_path, mime, bytes, width, height, sha256,
                   alt, status: active|orphaned|deleted, created_at)
change_requests   (Phase 4) · audit_log (Phase 3/4)
```

Why whole-document JSONB revisions instead of a row per section/block:
- **Draft/published isolation is a pointer**, not a copy of many rows: publishing sets
  `published_revision_id = draft_revision_id` in one transaction.
- **Rollback is reliable**: restoring = create a new revision whose content equals an old
  one. Text, structure and media references roll back together because they live in one
  document.
- **Diffs are straightforward** (JSON diff between two revisions), and content stays
  portable (export = JSON files matching the TypeScript types).
- Validation: every write is checked against a Zod schema generated from the same types.
- Media rows are never hard-deleted while any revision references them (safe deletion).

## 7. Minimum viable authentication (Phase 3)

- **Identity provider:** Supabase Auth. Sign-ups disabled; exactly one owner account.
  Login via email magic link or passkey/OAuth (GitHub), **plus TOTP MFA required**
  (Supabase AAL2) for anything in `/studio`.
- **Authorization, server-side, in two layers:**
  1. Next.js server actions / route handlers verify the session (`supabase.auth.getUser()`,
     not just the cookie), that `user.id === OWNER_USER_ID` and `aal === 'aal2'`.
  2. Postgres Row-Level Security: write policies on every table require
     `auth.uid() = owner_id AND auth.jwt()->>'aal' = 'aal2'`. Public (anon) role can only
     `SELECT` from views exposing **published revisions**.
- `proxy`/middleware only redirects unauthenticated visitors away from `/studio` for UX;
  it is never the security boundary.
- The service-role key exists only in server env for narrowly scoped jobs (e.g. consuming
  an AI token); it is never sent to the browser and never used to serve owner requests
  that RLS can authorize.
- Preview of drafts uses Next.js Draft Mode, enabled only by an authenticated owner route.
- No custom auth protocol, no long-lived secrets in the browser.

## 8. Main technical and security risks

| Risk | Mitigation |
|---|---|
| Supabase free-tier projects pause after a period of inactivity (verify current terms) — a public site that reads live from the DB would go down | Public pages are statically generated; publishing triggers on-demand revalidation. If the DB pauses, the public site keeps serving the last published build. |
| Owner account takeover = full site control | Mandatory MFA (AAL2), single allow-listed user id, sign-ups off, session re-check on publish. |
| RLS misconfiguration exposes drafts or allows writes | Public reads only via `published_*` views; automated tests that run anon/agent queries and assert denial. |
| AI agent token leakage or scope creep | Tokens: 256-bit random, stored hashed, single request, single use, ≤ 60 min TTL, revocable, scoped to listed project ids and action types; can only create *draft revisions*. No token can publish. |
| Prompt injection via uploaded documents (a PDF instructing an AI to change things) | AI output is only ever a draft + diff; publication requires owner confirmation in Studio. Source documents are never published automatically. |
| Malicious uploads (SVG with script, polyglot files, huge PDFs) | Allow-list MIME by magic bytes; reject SVG uploads (or sanitize server-side); size caps; images re-encoded; files served from storage domain with `Content-Disposition` for documents. |
| XSS through rich text | Content is structured blocks rendered by React, never raw HTML. |
| Unreviewed AI code reaching production | Branch protection on `main` (PR + owner review + passing checks); Vercel production deploys only from `main`; agents get no Vercel/Supabase prod credentials. |
| Preview deployments leaking production secrets | Separate Vercel env scopes; previews use a staging Supabase project or anon-only keys. |
| Animation jank on low-end devices | Transform/opacity-only animation, capped canvas (≤ 56 nodes, 30 fps, DPR ≤ 1.5, paused when hidden), reduced-motion fallbacks. |
| Framework churn (Next 16, Motion, Tailwind 4) | Pinned versions via lockfile; domain logic isolated from UI; docs for agents. |

## 9. Recommended implementation sequence

1. **Phase 1 (done):** prototype; owner reviews look and interaction on real devices.
2. **Phase 2:** Zod schema from types → Supabase tables + RLS + published views →
   swap `lib/content.ts` to Supabase with static generation + revalidation →
   media pipeline (upload, validate, `next/image`) → owner-defined ordering.
3. **Phase 3:** Supabase Auth + MFA → `/studio` shell → revisions/draft/publish →
   inline editing (contentEditable text with schema validation, dnd-kit for ordering) →
   version compare/restore → audit log.
4. **Phase 4:** `change_requests` + approval UI + one-time scoped tokens → agent content
   API (draft-only) → GitHub branch protection + PR template + CI checks → AI workflow docs.
5. **Phase 5:** real project content from your materials (draft → your approval each time).
6. **Phase 6:** accessibility audit (axe + manual screen reader), Lighthouse, security
   review, backup/restore drill, deployment.

## Decisions needed from you

1. **Headline.** Recommended: *"Electrical Engineering Student & Researcher"* — accurate,
   familiar to admissions committees, and doesn't narrow you to IC design. *"Aspiring IC
   Design Engineer"* reads as industry-oriented; *"Unlicensed Engineer"* is memorable but
   risks being read as a licensure statement, so better as a footer/about aside if at all.
   All three are stored in `site.headlineAlternatives`.
2. **Deck wrap-around** (current) vs. linear.
3. **Home page includes the full Projects experience** (current) vs. a teaser linking to `/projects`.
4. Your name, photo, LinkedIn URL, CV PDF, and education details (all placeholders now).
