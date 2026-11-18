# Security

## Current state (Phase 1)

Static site, no authentication, no write endpoints, no secrets. Content changes happen
only through Git commits. Protect the repository:

- Branch protection on `main`: require a pull request, owner review, and passing build.
- Vercel production deploys only from `main`; previews for PRs.
- Never commit `.env*` files (ignored by `.gitignore`).

## Planned controls (Phases 3–4)

### Owner
- Supabase Auth, sign-ups disabled, single allow-listed owner user id, **MFA required (AAL2)**.
- Authorization enforced server-side (server actions verify the user and AAL) **and** in
  Postgres RLS. Middleware/proxy redirects are UX only.
- Public role reads published views only.

### Draft vs. publish permissions

| Permission | Who | What it allows |
|---|---|---|
| Edit draft | Owner session; or an AI agent holding an approved one-time token | Create a new *draft revision* of the specific projects/sections named in the approved request. |
| Publish | **Owner session with MFA only** | Point `published_revision_id` at a reviewed draft. No token type can do this. |
| Merge code | **Owner only**, via GitHub PR review | Changes reach production only through `main`. |

### AI change requests
1. Agent submits a request (intent, scope: content / media / code, target projects). The
   request grants nothing. Intake is rate-limited and size-limited.
2. Owner approves or rejects in Studio (checkpoint 1).
3. On approval the server mints a 256-bit, single-use token, stored hashed, scoped to that
   request, expiring in ≤ 60 minutes, revocable. The owner passes it to the agent.
4. The agent's edits land as a draft revision tagged with the request id.
5. Owner reviews the diff/preview and explicitly publishes (checkpoint 2).
6. Every step is written to the audit log.

Code requests never use tokens: the agent opens a PR; tests and a preview run; the owner reviews and merges.

### Media
MIME allow-list verified by magic bytes, size caps, SVG uploads rejected or sanitized,
images re-encoded, documents served with `Content-Disposition: attachment`, uploaded source
documents private by default.

### Backup and recovery
Revisions are append-only (rollback = new revision). Scheduled database exports; content
exportable as JSON matching `CONTENT_SCHEMA.md`.

## Reporting
Report security issues privately to the site owner rather than in a public issue.
