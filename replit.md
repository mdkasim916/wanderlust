# WanderLux Travel Website

A full-stack responsive travel booking platform where users can browse destinations, filter by category/budget, book trips via a modal, and view their dashboard of booked trips.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080, proxied at `/api`)
- `pnpm --filter @workspace/travel-web run dev` — run the frontend (React + Vite)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string (auto-provisioned by Replit)

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React 18 + Vite + Tailwind CSS v4 + shadcn/ui + Wouter (routing) + TanStack Query
- API: Express 5 (Node.js)
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `lib/api-spec/openapi.yaml` — single source of truth for the API contract
- `lib/db/src/schema/` — DB tables: `destinations`, `bookings`, `testimonials`
- `artifacts/api-server/src/routes/` — Express route handlers
- `artifacts/travel-web/src/` — React frontend pages and components
- `lib/api-client-react/src/generated/` — generated React Query hooks (do not hand-edit)
- `lib/api-zod/src/generated/` — generated Zod validation schemas (do not hand-edit)

## Architecture decisions

- Contract-first API: OpenAPI spec → Orval codegen → typed hooks + Zod schemas. Never hand-write what codegen produces.
- All request bodies use entity-shaped schema names (`BookingInput`, not `CreateBookingBody`) to avoid Orval TS2308 collisions.
- Booking refs are generated server-side as `WL-XXXXXXXX` (prefix + 8 alphanumeric chars).
- `totalPrice` is computed server-side as `destination.price × travelers`.
- Stats endpoint returns live DB counts + a hardcoded offset for `happyTravelers` to show impressive numbers from day one.

## Product

- **Homepage** (`/`): Hero with search/filter bar, featured destinations grid, testimonials carousel, site statistics.
- **Destinations** (`/destinations`): Full listing with sidebar filters (category, price range). "Book Now" opens a booking modal collecting name, email, travelers, special requests. On success: confirmation screen with booking ref.
- **Dashboard** (`/dashboard`): Overview of all booked trips with status badges, pricing, and destination imagery.

## API endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | /api/destinations | List all destinations (filter: category, minPrice, maxPrice, search) |
| GET | /api/destinations/featured | Top 6 highest-rated destinations |
| GET | /api/destinations/:id | Get destination by ID |
| POST | /api/bookings | Create a booking |
| GET | /api/bookings | List all bookings (dashboard) |
| GET | /api/bookings/:id | Get booking by ID |
| GET | /api/testimonials | List customer testimonials |
| GET | /api/stats | Site-wide statistics |

## Gotchas

- Always run `pnpm --filter @workspace/api-spec run codegen` after editing `openapi.yaml`.
- Do NOT hand-edit files under `lib/api-client-react/src/generated/` or `lib/api-zod/src/generated/`.
- The `destinations/featured` route must be registered BEFORE `destinations/:id` in Express to avoid the param route capturing "featured" as an ID.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
