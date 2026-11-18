# Instructions for AI coding assistants

Read this file first, then `PROJECT_STRUCTURE.md` and `CONTENT_SCHEMA.md`.

## Non-negotiable content rules

1. **Never fabricate** results, metrics, responsibilities, honors, dates or experience.
   If evidence is missing, leave a bracketed placeholder (`[metric]`) and ask the owner.
2. Preserve exact honor wording. Tau Beta Pi: *invited* three consecutive years — not
   "member" or "inducted".
3. Keep individual vs. team credit explicit (`contributions` block: `mine` / `team`).
4. State limitations and failed attempts; do not reframe them as successes.
5. Record provenance (`source: { ref }`) for technical claims taken from owner materials.
6. Concise, precise academic English. No marketing language.
7. Placeholder content must keep `isPlaceholder: true` (renders a visible tag).

## Code rules

- Data access goes through `src/lib/content.ts`; components must not import project data directly.
- Keep `src/content/schema.ts` as the single content contract; update `CONTENT_SCHEMA.md` with it.
- Active-project state lives only in `useProjectSelection`. Do not add parallel state.
- Animate only `transform`/`opacity`; respect reduced motion (`MotionConfig reducedMotion="user"`).
- Don't intercept vertical scrolling. Keep keyboard and screen-reader behaviour working.
- Run `npm run build` before proposing changes; it type-checks and prerenders every route.
- Log meaningful changes in `CHANGELOG.md`.

## How you get write access (from Phase 4)

You do **not** get credentials from this repository or the website URL.
- **Code changes:** work on a branch, open a pull request with a description and test
  results. The owner reviews and merges; only `main` deploys to production.
- **Content changes:** submit a change request (Phase 4 API). The owner approves it in
  Developer Studio and gives you a one-time, short-lived token scoped to that request.
  Your edits become a *draft revision*; only the owner can publish.
See `SECURITY.md`.

## Workflows

- **Add a project:** append to `projects` in `src/content/projects.ts` with a unique, stable
  `slug`; start with `publication: "draft"`; choose sections per project (none are mandatory).
- **Edit UI:** components in `src/components/*`; tokens in `src/app/globals.css` (`@theme`).
- **Preview:** `npm run dev`, or the Vercel preview deployment attached to your PR.
- **Publish:** owner only — set `publication: "published"` and merge (Phase 1), or use Studio (Phase 3+).
