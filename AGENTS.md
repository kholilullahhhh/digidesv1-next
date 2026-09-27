# AGENTS.md

## What this repo is

- One Next.js **13.5.1** App Router app (not a monorepo): the official village portal for Desa Sukamaju, sekarang **dinamis** — public site + admin CMS. No `src/`, no packages.
- **Stack:** PostgreSQL (Prisma 6) + `next-auth` v4 (Credentials/JWT) + API route handlers + shadcn/ui. Data tidak lagi diambil dari `data/*.ts`.
- UI copy, route segments, dan pesan validasi **bahasa Indonesia** (`/profil`, `/berita`, `/transparansi`, `/api/...` error message). Tulis string baru dalam bahasa Indonesia.
- **Mutasi data lewat API routes** (`app/api/...`), bukan server actions. Jangan tambah server action.

## Commands

```sh
npm.cmd run dev        # dev server (port 3000, fallback 3001)
npm.cmd run lint       # next lint
npm.cmd run typecheck  # tsc --noEmit
npm.cmd run build      # next build

npm.cmd run dev:db     # PostgreSQL lokal (embedded-postgres, data di .data/postgres)
npm.cmd run db:push    # sinkronkan schema Prisma ke DB (.env.local)
npm.cmd run db:seed    # isi DB dari data/*.ts (hanya bila tabel kosong) + admin
npm.cmd run db:studio  # Prisma Studio
```

- Wajib **`npm.cmd`**, bukan `npm` — PowerShell execution policy memblokir `npm.ps1`.
- Prisma CLI tidak membaca `.env.local` sendiri → semua script db memakai `dotenv -e .env.local -- ...`.
- Tidak ada test runner, test script, atau CI. Verifikasi = `lint` + `typecheck` (+ `build` untuk memastikan).
- `next build` type-checks tapi **melewati ESLint** (`eslint.ignoreDuringBuilds: true`) → selalu jalankan `npm.cmd run lint` terpisah.
- Urutan start dari nol: `dev:db` → `db:push` → `db:seed` → `dev`.
- Port 3000 sering terpakai; `next dev` jatuh ke 3001. Kalau port 3000 memberi 500, pakai 3001.

## Credentials & environment

- `.env.local` (jangan di-commit): `DATABASE_URL` (dev = `postgresql://postgres:password@localhost:5432/digides`), `NEXTAUTH_SECRET`, `SEED_ADMIN_EMAIL/PASSWORD`.
- Admin hasil seed: `admin@desasukamaju.id` / `admin-sukamaju-2026` (role ADMIN); staff: `staff@desasukamaju.id` / password sama (role STAFF).
- Contoh data pengajuan: `DSA-2026-000123`, `DSA-2026-000098`.
- Production: **Vercel** + **Neon** (`DATABASE_URL` Neon + `NEXTAUTH_SECRET` di Vercel env). `netlify.toml`/`@netlify/plugin-nextjs` adalah sisa config era statis.
- `@supabase/supabase-js` terpasang tapi tidak pernah di-import — abaikan.

## Architecture

### Data flow

- Sumber kebenaran = **database**. Halaman publik mengambil data via `lib/queries.ts` (`getNews`, `getServices`, `getSiteConfig`, …) yang membaca Prisma → bentuk `*View` plain object.
- `data/*.ts` **hanya sumber seed** (`prisma/seed.ts`) dan fallback `app/sitemap.ts`. Jangan import `@/data/*` dari halaman/component (kecuali seed/sitemap).
- Semua halaman publik yang query DB mengekspor `export const dynamic = 'force-dynamic'` supaya `next build` tidak perlu DB.
- Format tanggal/angka: `lib/format.ts` (`formatDate`, `formatCurrency` → locale `id-ID`).

### Layout halaman publik

- Root `app/layout.tsx` hanya `<html>/<body>`, font, metadata — **tanpa header/footer**.
- `components/layout/public-layout.tsx` adalah **async server component** (fetch site config + pengumuman) → hanya boleh dipakai dari **server component**. Ini pembungkus semua halaman publik (16 halaman).
- `components/layout/public-shell.tsx` adalah versi **sinkron/statis** (config dari `config/site.ts`) → dipakai `app/error.tsx` dan `app/not-found.tsx` yang tidak boleh async.
- **Jangan ada `app/loading.tsx`.** Loading boundary membuat Next streaming status 200 lebih dulu sehingga `notFound()` di halaman detail tidak bisa mengirim 404 (sudah dibuktikan & dihapus).
- Route detail `/berita/[slug]` dan `/layanan/[slug]`: `generateStaticParams` **dihapus**, diganti `force-dynamic` + `generateMetadata` + `notFound()` untuk slug tak dikenal.

### Halaman client

- Pola lama (`'use client'` di page) sudah dihentikan: page = server component, logika interaktif dipindah ke child client di `components/views/*` yang menerima props plain data.
- Batasan server→client: prop harus serializable. `ServiceView.icon` adalah komponen Lucide — pass **nama ikon** saja, resolve dengan `getServiceIcon()` di `lib/service-icons.ts` di sisi client.
- `PublicLayout` (async) tidak boleh di-import file yang ada `'use client'`.

### Admin CMS

- `app/admin/login/page.tsx` (bebas guard) + `app/admin/(panel)/...` (route group, dijaga `app/admin/(panel)/layout.tsx` via `getCurrentUser`).
- `middleware.ts`: matcher `['/admin', '/admin/((?!login).*)']`, `pages.signIn: '/admin/login'` (diset juga di `lib/auth.ts`).
- Shell/sidebar: `components/admin/shell.tsx` (nav difilter per role, `<Toaster/>` **hanya dipasang di sini**).
- CRUD generik: `components/admin/resource-page.tsx` (server, inject meta) → `resource-manager.tsx` (search, pagination, dialog form, hapus) → `field-input.tsx`.
- Definisi resource & role: `lib/admin-resources.ts` (semua resource hanya ADMIN; nav STAFF hanya Dashboard + Pengajuan).
- Form config/validasi: `lib/admin-form.ts` + `lib/validation.ts` (zod).
- Halaman khusus: dashboard `(panel)/page.tsx`, `pengajuan` (`applications-manager.tsx`), `data-desa` (`village-form.tsx`), `pengaturan` (`settings-form.tsx`).

### API routes

- Admin (butuh session): `app/api/admin/[resource]` (GET list + POST), `app/api/admin/[resource]/[id]` (PATCH/DELETE), plus `/api/admin/meta`, `/api/admin/village`, `/api/admin/settings`, `/api/admin/applications`.
- Logika CRUD bersama: `lib/admin-crud.ts` (`CRUD_DEFS`, `toCreate/toUpdate/toRow`, `prismaMessage` → pesan Indonesia + status HTTP, P2002/P2003 → 409).
- Auth helper: `lib/api.ts` (`requireApiRole`, `audit`, `apiOk/apiError`, `revalidatePublic`).
- Publik: `POST /api/contact`, `POST /api/applications` (no-auth, tracking `DSA-YYYY-NNNNNN` + history), `GET /api/tracking?trackingNumber=...`.
- Catatan POST create: hanya boleh kirim `data` + `include`/`select` ke Prisma — **jangan** kirim `orderBy/skip/take` (pernah bikin 500).

## Gotchas

- **Images:** `next.config.js` set `images.unoptimized: true` dan `remotePatterns` hanya `images.pexels.com` + `images.unsplash.com`. Host lain harus ditambahkan dulu.
- **Tailwind content globs** hanya memindai `./pages`, `./components`, `./app`. Class string di `data/`, `config/`, atau `lib/` akan di-purge dan hilang diam-diam.
- `@tailwindcss/typography` **tidak terpasang** → class `prose` di halaman artikel tidak berpengaruh.
- Lebar container bawaan = utilitas custom di `app/globals.css`: `container-mx` (max-w-7xl + `container-px`).
- Toast (`hooks/use-toast` + `components/ui/toaster`) hanya termount di admin shell — kalau dipakai di halaman publik, mount `Toaster` dulu.
- Canonical domain `https://desasukamaju.id` hardcode di `app/layout.tsx`, `app/sitemap.ts`, `app/robots.ts` — ganti ketiganya kalau berubah.
- `next lint` bisa melaporkan rule `@typescript-eslint/no-explicit-any` tidak terdaftar; komentar `eslint-disable` untuk rule itu harus dihapus (pakai `any` biasa saja).
- **Jangan tulis file via PowerShell `Get-Content`/`Set-Content`** — pernah merusak encoding (`©`/em dash jadi mojibake, BOM nambah). Pakai tool Edit/Write; jika terpaksa PowerShell, gunakan `[System.IO.File]::ReadAllText/WriteAllText` dengan `UTF8Encoding($false)`.
