# twelo.ai

A Next.js 14 AI chat application (monorepo) migrated from Vercel to Replit, rebranded from LLMChat/llmchat.co to twelo.ai with full Dutch (NL) UI translation.

## Project Structure

- **apps/web** — Main Next.js 14 app (the frontend + API routes)
- **packages/prisma** — Prisma schema and client (PostgreSQL)
- **packages/ai** — AI integration utilities
- **packages/common**, **packages/shared**, **packages/ui** — Shared packages

## Package Manager

Uses **Bun** (`bun@1.1.19`) with Turborepo for monorepo management.

## Running the App

The workflow runs: `cd apps/web && ../../node_modules/.bin/next dev -p 5000 -H 0.0.0.0`

Port 5000, bound to 0.0.0.0 for Replit compatibility.

## Branding & UI

- **Brand name**: twelo.ai (rebranded from llmchat.co)
- **Brand color**: `#864ffe` (HSL `259 99% 65%`) — set via `--brand` CSS variable in `apps/web/app/globals.css`
- **Dark/light mode**: ThemeProvider enabled; sun/moon toggle in sidebar for all auth states
- **Language**: Entire UI translated to Dutch (NL)
  - Sidebar, settings modal, chat input, intro dialog, sign-in, feedback widget, command search, message actions, example prompts, error pages — all in Dutch

## Replit Migration Notes

- Sentry `withSentryConfig` wrapper removed from `next.config.mjs` (Vercel-specific build plugin)
- `apps/web/app/instrumentation.ts` — Sentry runtime hooks disabled (commented out)
- Dev/start scripts updated to use `-p 5000 -H 0.0.0.0`
- `next` binary is in root `node_modules/.bin/` (not in `apps/web/node_modules`)

## Authentication

Custom-built email + password auth system (no Clerk):
- **Session tokens**: Random 48-char tokens stored in `Session` DB table; set as `twelo_session` httpOnly cookie (30-day expiry)
- **Password hashing**: `bcryptjs` with cost factor 12
- **API routes**:
  - `POST /api/auth/register` — create account
  - `POST /api/auth/login` — log in
  - `POST /api/auth/logout` — log out
  - `GET /api/auth/me` — get current user
  - `PATCH /api/auth/me` — update name/email/password
  - `DELETE /api/auth/me` — delete account
- **Server-side session**: `getServerSession()` in `apps/web/lib/auth.ts` reads cookie + queries DB
- **Client-side**: `AuthProvider` in `packages/common/context/auth-context.tsx` with `useAuth()`, `useUser()`, `useClerk()` drop-in replacements
- **User management**: "Profiel" tab in settings modal for name/email/password/delete

## Database Schema (Prisma)

- `User` — id, email (unique), name, password (hashed), createdAt, updatedAt
- `Session` — id, userId (FK→User), token (unique), expiresAt, createdAt
- `Feedback` — id, userId, feedback, metadata, createdAt

## Required Environment Variables

- `DATABASE_URL` — PostgreSQL connection string (Prisma)
- `KV_REST_API_URL` — Upstash/Vercel KV URL (for rate limiting)
- `KV_REST_API_TOKEN` — Upstash/Vercel KV token
- `FREE_CREDITS_LIMIT_REQUESTS_AUTH` — Rate limit for authenticated users
- `FREE_CREDITS_LIMIT_REQUESTS_IP` — Rate limit per IP

### Supabase (optional, used for storage)
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
