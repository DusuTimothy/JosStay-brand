# JosStay-brand

JosStay is a verifiable hotel marketplace for Jos. This repository is the npm-workspace monorepo for the product.

## Layout

| Path | Workspace | Purpose |
|---|---|---|
| `client/` | `@josstay/client` | Next.js frontend |
| `server/` | `@josstay/server` | Express API |
| `packages/shared/` | `@josstay/shared` | Zod schemas and shared types |
| `docs/` | — | Product, backend, legal and build documentation |

## Commands

Run from the repository root after one `npm install`:

```bash
npm run dev          # client on http://localhost:4300
npm run dev:server   # API on http://localhost:10000/health
npm run typecheck    # all three workspaces
npm run build        # shared, client, then server
npm run build:shared # shared schemas only
npm run start        # built client
npm run start:server # built API
```

Copy `client/.env.example` to `client/.env.local` and `server/.env.example` to `server/.env` for local values. Real keys are never committed. See `docs/12-ENVIRONMENT-KEYS.md`.

All listings are demo content until real hotels are inspected and onboarded. No ratings, counts or verification claims are fabricated.
