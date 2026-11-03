# ImageLab

Local-first image analysis and organization application. Images are processed entirely in the
browser with Web Workers; nothing is uploaded to a server.

See [`AGENTS.md`](./AGENTS.md) for permanent engineering requirements and
[`initian-prompt.md`](./initian-prompt.md) for the initial milestone definition.

## Requirements

- Node.js 20.19+ (developed with Node 24)
- npm 10+ (developed with npm 11)

## Setup

```bash
npm install
npm run dev
```

## Scripts

| Script                 | Description                                |
| ---------------------- | ------------------------------------------ |
| `npm run dev`          | Start the Vite development server          |
| `npm run build`        | Type-check and build the production bundle |
| `npm run preview`      | Preview the production build               |
| `npm run typecheck`    | Run TypeScript in build mode (`tsc -b`)    |
| `npm run lint`         | Run ESLint over the repository             |
| `npm run lint:fix`     | Run ESLint and apply safe fixes            |
| `npm run format`       | Format files with Prettier                 |
| `npm run format:check` | Verify formatting without writing          |
| `npm test`             | Run Vitest in watch mode                   |
| `npm run test:run`     | Run the test suite once                    |

## Architecture

The image-processing engine lives under `src/engine` and must not import React, React DOM or any
module from `src/ui`. It is designed to be tested and benchmarked in isolation from the UI. This
boundary is enforced both by ESLint (`no-restricted-imports`) and by
`tests/architecture.test.ts`.

```text
src/
├── engine/              # UI-independent image-processing engine
│   ├── config.ts        # Analysis version and shared configuration
│   ├── import/          # File validation and intake
│   ├── decode/          # Image decoding and downscaling
│   ├── analysis/        # Pure metric algorithms
│   ├── workers/         # Worker entry points and typed protocol
│   ├── queue/           # Bounded queue, worker pool, cancellation
│   ├── duplicates/      # Exact and perceptual duplicate grouping
│   ├── persistence/     # Versioned IndexedDB schema and repository
│   └── benchmark/       # Benchmark metrics and runner
├── ui/                  # React UI (added in a later milestone)
├── App.tsx
└── main.tsx
```

Tests live in `tests/` so that Node-only APIs (fixtures, filesystem) never leak into the browser
bundle. `scripts/` is reserved for development tooling such as synthetic dataset generation.

## Dependency policy

Runtime dependencies are kept minimal. `exifr` will be added in M2 for EXIF extraction because a
correct hand-written EXIF parser is error-prone. `sharp` will be added as a **development**
dependency in M5 for synthetic dataset generation only; it must never enter the browser runtime or
the production bundle.

## Status

- **M0 — Scaffolding:** complete.
- **M1 — Core intake and decoding:** next.
- M2–M6: pending.

No performance numbers are claimed yet. Benchmark results will only be reported after the
reproducible 1,000-image benchmark is implemented and measured.
