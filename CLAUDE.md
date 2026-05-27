# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start Express + Vite dev server (port 5000)
npm run build      # Build Vite client + esbuild server bundle
npm start          # Run production server
npm run check      # TypeScript type checking
npm run db:push    # Push Drizzle schema migrations to database
```

There is no test runner configured. Type checking (`npm run check`) is the primary correctness verification tool.

## Architecture

Colorkart is a color palette generator with a **hybrid React/Vite + Next.js architecture** — a progressive migration is underway from a Vite-based SPA to Next.js. Both systems run simultaneously: the legacy React/Vite app serves on port 5000 via Express, while Next.js handles newer pages.

### Routing

- **React/Vite** (`client/src/App.tsx`): Wouter SPA router with lazy-loaded pages (`/generator`, `/visualize`, `/image-palette`, guide pages)
- **Next.js** (`pages/`): File-based routing for migrated pages (`pages/index.tsx`, `pages/palette/[id].tsx`) and all API routes (`pages/api/`)

### State Management

- `PaletteContext` (`client/src/contexts/PaletteContext.tsx`) — central state for colors, locking, color theory mode, and palette generation logic
- `AuthContext` (`client/src/contexts/AuthContext.tsx`) — user session state
- **React Query** — server state and mutations
- **localStorage** (`client/src/lib/localStorageService.ts`) — persisting palettes client-side

### Backend

Express server (`server/`) proxies requests and serves the Vite client. Authentication uses Passport.js with `passport-local` and PostgreSQL-backed sessions (`connect-pg-simple`).

### Database

PostgreSQL via Neon serverless. Schema defined in `shared/schema.ts` using Drizzle ORM + Zod. Two tables: `users` and `palettes` (colors stored as JSON). Run `npm run db:push` after schema changes.

### Color System

Color logic lives in `client/src/lib/colorUtils.ts`. All colors are managed in HSL space internally. `PaletteContext` implements color theory algorithms (complementary, analogous, triadic, tetradic, monochromatic) using hue-shifting.

### Component Structure

- `client/src/components/ui/` — shadcn/ui components (Radix UI primitives, do not edit directly)
- `client/src/components/` — feature components (ColorCard, modals, Header, Footer)
- `components/` — Next.js-specific shared components (SEO, AdSense, CommonHead)

### Path Aliases

- `@/*` → `client/src/*`
- `@shared/*` → `shared/*`

### Key Environment Variables

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | Neon PostgreSQL connection string |
| `SESSION_SECRET` | Session encryption key |
| `VITE_GA_ID` | Google Analytics tracking ID |
| `VITE_BASE_URL` | Client base URL |
