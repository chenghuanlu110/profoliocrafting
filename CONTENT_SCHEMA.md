# Content schema

Source of truth: `src/content/schema.ts`. This page explains intent.

## Project

| Field | Notes |
|---|---|
| `slug` | URL segment `/projects/{slug}`. Stable once published. |
| `title`, `subtitle` | |
| `categoryId` | References `Category.id`. |
| `order` | Owner-controlled global order. Bookmarks point to the first project of each category in this order. |
| `publication` | `draft` \| `published`. Only published projects are routed or listed. |
| `isPlaceholder` | Shows a visible "Placeholder" tag. |
| `cover` | `MediaRef` (`image` with optional focal point, or generated `placeholder`). |
| `meta` | `domain`, `duration`, `status` (completed / in-progress / concluded-with-limitations / paused), `context` (academic / research / professional / independent), `team` (individual, or group with size/role). |
| `overview` | 2–3 sentences; must stand alone. |
| `takeaways` | Optional, max 3; `kind`: contribution / outcome / improvement. No invented metrics. |
| `sections` | Ordered, per-project. Any subset, any order. |

## Section

`id` (stable, used for anchors and diffs) · `kind` (question, contributions, methodology,
tools, challenges, validation, lessons, future, materials, custom) · `title` (free text) ·
`hidden` · `layout` (`stack` | `split` prose-left/media-right | `gallery` figure grid) ·
`disclosure` (`open` | `collapsed` → expandable panel) · `blocks[]`.

## Blocks

| Type | Use |
|---|---|
| `paragraph` | Prose. |
| `list` | Bullet or numbered. |
| `figure` | Image + caption (schematics, waveforms, plots, photos). |
| `code` | Syntax-highlighted excerpt (`verilog`, `systemverilog`, `matlab`, `python`, `c`, `text`). |
| `keyValue` | Requirements/specs tables. |
| `tags` | Grouped tools/technologies. |
| `callout` | `note`, `result` (verified evidence), `limitation`. |
| `contributions` | `mine[]` vs `team[]` — explicit credit. |
| `links` | PDFs, reports, repositories, references. |

Most blocks accept `source: { ref, note? }` to record where a claim came from.

## Category

`id`, `label`, `order`. Categories without published projects produce no bookmark.

## Site profile

`src/content/site.ts`: name, headline (+ alternatives), intro, photo, LinkedIn, CV URL, about
paragraphs, personal story (`published: false` until provided), education (first entry shown),
honors, expertise areas (an area with no entries is hidden).

## Phase 2 storage

Each project is stored as an immutable JSONB revision matching this schema; the project row
points at a draft revision and a published revision. See `docs/ARCHITECTURE_PLAN.md` §6.
