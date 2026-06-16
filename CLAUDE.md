# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev      # start dev server (localhost:3000)
npm run build    # production build
npm run lint     # run ESLint
```

Prisma:
```bash
npx prisma migrate dev   # apply schema changes and regenerate client
npx prisma studio        # open DB browser UI
```

The Prisma client is generated into `src/generated/prisma/` (not `node_modules`). After any schema change, regenerate it with `npx prisma generate`.

## Architecture

**FinTrack** is a personal finance dashboard built with Next.js App Router, Prisma (SQLite via libsql), and shadcn/ui components.

### Data layer

- `prisma/schema.prisma` — two models: `Transaction` (income/expenses) and `Position` (stock holdings by ticker + share count).
- `src/lib/prisma.ts` — singleton `PrismaClient` using `@prisma/adapter-libsql`. In development it falls back to a local `prisma/dev.db` file; in production it reads `DATABASE_URL`.
- Database is SQLite accessed through the libsql adapter (not the default Prisma SQLite driver).

### Server Actions

All mutations go through Next.js Server Actions in `src/actions/`:

- `transactionActions.ts` — CRUD for transactions; filters by current month for dashboard.
- `portfolioActions.ts` — upsert/delete stock positions.
- `stockActions.ts` — fetches live prices from `yahoo-finance2` for a list of tickers.

Actions call `revalidatePath` after mutations to invalidate affected routes.

### Routes & components

| Route | Purpose |
|---|---|
| `/` | Dashboard: summary cards, recent transactions, expense pie chart |
| `/transactions` | Full transaction list with create/edit/delete modal |
| `/portfolio` | Stock positions table with live price lookup and upsert modal |

Pages are async Server Components that fetch data directly; they pass data down to client components for interactivity.

UI primitives live in `src/components/ui/` (shadcn-generated: Button, Card, Input, Select, Label, Badge, Dialog, Table). Feature components are colocated under `src/components/dashboard/`, `src/components/transactions/`, and `src/components/portfolio/`.

### Styling

Tailwind CSS v4 with `tw-animate-css`. Global styles in `src/app/globals.css`. The `cn()` helper (`src/lib/utils.ts`) merges class names via `clsx` + `tailwind-merge`.
