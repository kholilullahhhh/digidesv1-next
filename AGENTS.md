# AGENTS.md

## What this repo is

- One Next.js **13.5.1** App Router app (not a monorepo): the official village portal for Desa Sukamaju. No `src/`, no packages.
- **Static content only.** All copy/data lives in typed arrays under `data/*.ts`; pages import them directly. There is no database, no API routes, no `.env` usage, and no server actions. `@supabase/supabase-js` is installed but never imported — do not assume a backend exists.
- UI copy, route segments, and validation messages are **Indonesian** (`/profil`, `/berita`, `/transparansi`…). Write new strings in Indonesian.

## Commands

```sh
npm.cmd run dev        # dev server
npm.cmd run lint       # next lint
npm.cmd run typecheck  # tsc --noEmit
npm.cmd run build      # next build
```

- Use **`npm.cmd`**, not `npm` — PowerShell execution policy blocks `npm.ps1` on this machine.
- No test runner, no test script, no CI (`.github/` does not exist). Verification = `lint` + `typecheck`.
- `next build` type-checks but **skips ESLint** (`eslint.ignoreDuringBuilds: true` in `next.config.js`), so lint errors never fail a build. Always run `npm.cmd run lint` explicitly.
- Port 3000 is often taken; `next dev` silently falls back to 3001.

## Known broken state (do not think you caused it)

- `npm.cmd run typecheck` **and** `npm.cmd run build` currently fail at HEAD with two errors, both from `app/layout.tsx`: it exports `viewport: Viewport`, but `Viewport` only exists in Next 14+ while this repo pins 13.5.1 (`TS2614` plus a cascading error in generated `.next/types/app/layout.ts`).
- Fix options: delete the `viewport` export (Next 13.5 reads `themeColor` from `metadata`), or upgrade Next to 14+. Lint passes clean today.

## Architecture

- Root `app/layout.tsx` renders only `<html>/<body>`, fonts, and metadata — **no header/footer**. Every page must wrap its content in `<PublicLayout>` (`components/layout/public-layout.tsx`, which mounts `AnnouncementBar` + `Header` + `Footer`), otherwise it renders bare. `app/error.tsx`, `loading.tsx`, `not-found.tsx` show the pattern.
- Path alias `@/*` → repo root (there is no `src/`), e.g. `@/components`, `@/data`, `@/config/site`.
- `config/site.ts` (`siteConfig`) is the single source for name, address, contact, socials, and the **nav array** used by header/footer. Routes like `/tracking`, `/pembangunan`, `/agenda`, `/data-desa`, `/umkm` are intentionally not in `siteConfig.nav` — they are linked only from the footer.
- Dynamic routes `/berita/[slug]` and `/layanan/[slug]` derive `generateStaticParams` from the `data/` arrays and call `notFound()` for unknown slugs.
- Many pages are `'use client'` even though data is static; that is the established pattern (client-side search/filter state), not an accident.
- `components/ui/*` is shadcn/ui output (`components.json` present, `rsc: true`). Prefer `npx shadcn@latest add <component>` over hand-writing primitives.

## Gotchas

- **Images:** `next.config.js` sets `images.unoptimized: true` and `remotePatterns` limited to `images.pexels.com` and `images.unsplash.com`. `next/image` with any other host throws at runtime — add the host to `remotePatterns` first.
- **Tailwind content globs** only scan `./pages`, `./components`, `./app`. Class strings placed in `data/`, `config/`, or `lib/` will be purged and silently not render.
- `@tailwindcss/typography` is **not** installed, so the `prose` classes on article pages currently do nothing.
- Standard page width wrappers are the custom utilities in `app/globals.css`: `container-mx` (max-w-7xl + `container-px`). Most pages use them instead of Tailwind's `container`.
- Format dates/numbers with `lib/format.ts` (`formatDate`, `formatCurrency` → Indonesian `id-ID` locale), not ad-hoc `toLocaleString`.
- The contact form (`app/kontak`) only fakes submission (`setTimeout` + `console.log`); `hooks/use-toast` and `components/ui/toaster` are not mounted anywhere, so toasts will not appear. Adding `Toaster` to the root layout is required if you use them.
- Canonical domain `https://desasukamaju.id` is hardcoded in `app/layout.tsx`, `app/sitemap.ts`, and `app/robots.ts` — update all three if it changes.
- Deploy: Netlify via `netlify.toml` (`npx next build`, publish `.next`, `@netlify/plugin-nextjs`).
