# ServeMed Project [Remix + Hono.js Monorepo (with Bun, TurboRepo, Drizzle ORM, shadcn/ui, Biome)]

This monorepo contains a full-stack TypeScript application inspired by the modern NIX stack architecture but customized for Remix, Hono.js, Drizzle ORM, Bun, TurboRepo, Biome, and shadcn/ui, following best practices.

## 🗂️ Project Structure

```
monorepo/
├── apps/
│   ├── web/    # Remix frontend with shadcn/ui
│   └── api/    # Hono.js backend
├── packages/
│   ├── ui/     # Shared shadcn/ui components
│   ├── db/     # Drizzle ORM setup
│   └── types/  # Shared schemas and types (Zod)
├── bun.lockb
├── biome.json
├── turbo.json
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (v1.x or higher)
- Node.js v18+ (recommended)

### Install dependencies

```bash
bun install
```

---

## 🔥 Development

Start development with TurboRepo (runs both frontend and backend concurrently):

```bash
bun run dev
```

Frontend runs at: [`http://localhost:3000`](http://localhost:3000)  
Backend API at: [`http://localhost:3001`](http://localhost:3001)

---

## 📦 Apps

### Web (Remix + shadcn/ui)

Located at `apps/web`

Run individually:

```sh
cd apps/web
bun run dev
```

### API (Hono + Drizzle ORM)

Located at `apps/api`

```bash
bun run dev
```

---

## 🧩 Shared Packages

### UI (shadcn/ui components)

Shared UI components following official [shadcn/ui monorepo](https://ui.shadcn.com/docs/monorepo) guide.

Location: `packages/ui`

Usage:

```tsx
import { Button } from "@monorepo/ui";

export default function Component() {
  return <Button>Click me</Button>;
```

### Database (Drizzle ORM)

Drizzle ORM and migrations management.

Location: `packages/db`

- Create migration:

```bash
bunx drizzle-kit generate
```

### Types (Zod Schemas)

Shared Zod schemas and types for full-stack type safety.

Location: `packages/types`

Example:

```tsx
import { createUserSchema } from "@monorepo/types";
```

---

## 🧹 Linting & Formatting (Biome)

Lint:

```bash
bun run lint
```

Format code:

```bash
bun run format
```

---

## ⚙️ TurboRepo Tasks

- **Development:** `bun run dev`
- **Build:** `bun run build`

---

## 🌱 Technologies

- **Frontend:** Remix, React, shadcn/ui, TailwindCSS
- **Backend:** Hono.js, Drizzle ORM, PostgreSQL
- **Tooling:** Bun, TurboRepo, Biome

---

## 📌 Troubleshooting

- **Missing module:** run `bun install --force`
- **Vite issues:** clear cache with `rm -rf apps/web/node_modules/.vite`
- **PostCSS issues:** Use CommonJS exports (`module.exports`) in `.cjs` files.

---

## 🛳️ Deployment

- **Remix:** Vercel, Cloudflare Pages, Netlify
- **Hono:** Cloudflare Workers, Docker, Vercel

---

## 🧹 Linting & Formatting

- **Lint:**

```bash
bun run lint
```

- **Format:**

```bash
bun run format
```

---

## 🧑‍💻 Maintainer

Maintainer — maintainer@postmed.com
Theerakarn M. — contact@theerakarnm.dev
