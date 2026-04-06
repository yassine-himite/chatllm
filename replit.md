# LLMChat Web

A Next.js 14 AI chat application (monorepo) migrated from Vercel to Replit.

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

## Replit Migration Notes

- Sentry `withSentryConfig` wrapper removed from `next.config.mjs` (Vercel-specific build plugin)
- `apps/web/app/instrumentation.ts` — Sentry runtime hooks disabled (commented out)
- Dev/start scripts updated to use `-p 5000 -H 0.0.0.0`
- `next` binary is in root `node_modules/.bin/` (not in `apps/web/node_modules`)

## Required Environment Variables

- `DATABASE_URL` — PostgreSQL connection string (Prisma)
- `KV_REST_API_URL` — Upstash/Vercel KV URL (for rate limiting)
- `KV_REST_API_TOKEN` — Upstash/Vercel KV token
- `FREE_CREDITS_LIMIT_REQUESTS_AUTH` — Rate limit for authenticated users
- `FREE_CREDITS_LIMIT_REQUESTS_IP` — Rate limit per IP

### Auth (Clerk)
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`

### Supabase
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
