# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Development commands

### Install dependencies

Use npm (lockfile is `package-lock.json`):

```bash
npm install
```

### Run the development server

Starts the Next.js dev server on port 3000:

```bash
npm run dev
```

You can also use the equivalent commands from the README if you prefer Yarn, pnpm, or Bun (`yarn dev`, `pnpm dev`, `bun dev`).

### Build for production

Create an optimized production build:

```bash
npm run build
```

### Run the production server

Serve the previously built app:

```bash
npm run start
```

### Lint the codebase

Runs ESLint with the flat config in `eslint.config.mjs`:

```bash
npm run lint
```

### Tests

There is currently no `test` script or test runner configured in `package.json`. Before adding tests or test-related commands, coordinate on the choice of test framework (e.g. Jest, Vitest) and then add appropriate scripts (for example, `"test": "vitest"`) to `package.json`.

## High-level architecture

### Framework and runtime

- This is a Next.js App Router project (created with `create-next-app`), using the `app/` directory as the main entry point.
- React and TypeScript are used throughout the app. The app runs in strict TypeScript mode with `noEmit` (see `tsconfig.json`).
- Routing is file-system based under `app/`. The root route (`/`) is implemented in `app/page.tsx`.
- Global layout and metadata are defined in `app/layout.tsx` via the `RootLayout` component and exported `metadata` object.
- Static assets (such as `next.svg`, `vercel.svg`) are served from `public/` and accessed via the `/` path prefix.

### Styling and theming

- Global styles live in `app/globals.css`.
- Tailwind CSS v4 is integrated via PostCSS:
  - `postcss.config.mjs` registers the `"@tailwindcss/postcss"` plugin.
  - `app/globals.css` starts with `@import "tailwindcss";`, enabling Tailwind utilities across the app.
- Color and font theming is driven by CSS custom properties:
  - `:root` defines `--background` and `--foreground` with a dark-mode override via `@media (prefers-color-scheme: dark)`.
  - An `@theme inline` block maps these to Tailwind theme tokens (`--color-background`, `--color-foreground`, `--font-sans`, `--font-mono`).
- The root layout (`app/layout.tsx`) loads the Geist and Geist Mono fonts via `next/font/google`, wiring them into CSS variables (`--font-geist-sans`, `--font-geist-mono`) that are then used by the theme.

### Linting and code quality

- ESLint is configured using the flat config in `eslint.config.mjs`.
- The config composes Next.js presets:
  - `eslint-config-next/core-web-vitals` for Next/React best practices.
  - `eslint-config-next/typescript` for TypeScript-specific rules.
- `globalIgnores` is used to ignore build artifacts and generated files:
  - `.next/**`, `out/**`, `build/**`, `next-env.d.ts`.
- The `lint` npm script simply runs `eslint`, which will use this flat config.

### TypeScript configuration

- `tsconfig.json` is the single source of TypeScript settings:
  - `strict: true`, `noEmit: true`, `skipLibCheck: true`.
  - `moduleResolution: "bundler"` and `module: "esnext"` for compatibility with Next.js and modern bundlers.
  - JSX is configured as `"react-jsx"`.
- A path alias is defined:
  - `@/*` resolves to the project root (`./*`).
  - Use imports like `import Foo from "@/app/...";` instead of long relative paths.
- The `include` section covers all TypeScript/TSX files and Next.js type definitions under `.next/`.

### App structure

- `app/layout.tsx` defines the HTML shell (`<html>`, `<body>`) and applies font/theme classes.
- `app/page.tsx` currently contains the default landing page from the Next.js starter, with Tailwind utility classes and `next/image` for optimized images.
- `app/globals.css` defines global CSS variables, Tailwind integration, and base body styles.
- `next.config.ts` exports a `NextConfig` object and is currently left at its default shape; extend this file for future Next.js configuration (custom headers, redirects, experimental flags, etc.).
