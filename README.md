# DigiDesa v1 — Digital Desa Sukamaju

Platform layanan dan informasi digital resmi untuk **Desa Sukamaju** yang dirancang untuk menyediakan informasi desa, pelayanan masyarakat, transparansi pemerintahan, serta sistem pengelolaan konten melalui Admin Dashboard.

Project ini dikembangkan menggunakan **Next.js App Router** dan terintegrasi dengan **PostgreSQL melalui Prisma ORM**, sehingga konten website tidak lagi bergantung sepenuhnya pada data statis.

---

## ✨ Features

### 🌐 Public Website

Website publik menyediakan berbagai informasi dan layanan untuk masyarakat Desa Sukamaju.

Fitur utama:

- 🏠 Landing page Desa Sukamaju
- 🏛️ Profil Desa
- 📰 Berita Desa
- 📋 Layanan Desa
- 📅 Agenda Desa
- 📢 Pengumuman
- 👥 Pemerintahan Desa
- 🌱 Potensi Desa
- 🏪 UMKM
- 🏗️ Pembangunan Desa
- 💰 Transparansi Desa
- 📊 Data Desa
- 🖼️ Galeri
- 🔎 Tracking pengajuan layanan
- 📩 Kontak / Pesan Masyarakat
- 🌙 Light Mode & Dark Mode
- 📱 Responsive design

---

## 🔐 Authentication

DigiDesa menyediakan sistem autentikasi untuk mengakses area administrasi.

Fitur:

- Login administrator
- Session management
- Protected admin routes
- Role-based authorization
- Logout
- Server-side authorization

Area administrasi tidak dapat diakses oleh pengguna yang belum memiliki akses.

---

## 🖥️ Admin Dashboard

Admin Dashboard menjadi pusat pengelolaan seluruh konten website Desa Sukamaju.

### Dashboard

Menampilkan informasi seperti:

- Total pengajuan layanan
- Pengajuan yang sedang diproses
- Pengajuan selesai
- Pesan masyarakat
- Statistik konten
- Aktivitas terbaru
- Pengajuan terbaru
- Quick actions
- Statistik berbasis database

### Manajemen Konten

Admin dapat mengelola:

- Berita
- Agenda
- Pengumuman
- Galeri
- Layanan Desa

### Manajemen Data Desa

Admin dapat mengelola:

- Data Desa
- Pemerintahan
- Potensi Desa
- UMKM
- Pembangunan
- Transparansi

### Pelayanan Masyarakat

Admin dapat mengelola:

- Pengajuan layanan
- Status pengajuan
- Data pemohon
- Tracking pengajuan
- Riwayat status

### Komunikasi

Admin dapat melihat dan mengelola:

- Pesan masyarakat
- Pertanyaan atau masukan masyarakat

### Sistem

Admin dapat mengelola:

- Pengguna
- Pengaturan website
- Konfigurasi tertentu
- Audit/activity log

---

# 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| Next.js 13.5.1 | Web framework |
| React | UI library |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| shadcn/ui | UI components |
| Lucide React | Icons |
| Prisma | ORM |
| PostgreSQL | Database |
| Neon | Cloud PostgreSQL |
| Authentication | Login & session |
| Vercel | Deployment |

---

# 📁 Project Structure

```text
digidesv1-next/
│
├── app/
│   ├── (public)/
│   ├── admin/
│   ├── login/
│   ├── berita/
│   ├── layanan/
│   ├── agenda/
│   ├── profil/
│   ├── pemerintahan/
│   ├── potensi/
│   ├── umkm/
│   ├── pembangunan/
│   ├── transparansi/
│   ├── data-desa/
│   ├── galeri/
│   ├── tracking/
│   ├── kontak/
│   ├── layout.tsx
│   ├── loading.tsx
│   ├── error.tsx
│   └── not-found.tsx
│
├── components/
│   ├── layout/
│   ├── ui/
│   ├── admin/
│   ├── public/
│   └── ...
│
├── config/
│   └── site.ts
│
├── data/
│   └── ...
│
├── lib/
│   ├── auth.ts
│   ├── prisma.ts
│   ├── format.ts
│   └── ...
│
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
│
├── public/
│   ├── images/
│   └── ...
│
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
├── package.json
└── README.md

Struktur aktual dapat berkembang mengikuti implementasi aplikasi.

🚀 Getting Started
1. Clone Repository
git clone <repository-url>
cd digidesv1-next
2. Install Dependencies

Project menggunakan Node.js dan npm.

Pada Windows PowerShell, gunakan:

npm.cmd install

Gunakan npm.cmd apabila PowerShell memblokir npm.ps1.

🔐 Environment Variables

Buat file:

.env

atau:

.env.local

Contoh:

DATABASE_URL="postgresql://username:password@host/database?sslmode=require"

AUTH_SECRET="your-secure-auth-secret"

Jangan commit file .env ke repository.

Pastikan environment variables production juga dikonfigurasi di Vercel.

🗄️ Database

Project menggunakan:

PostgreSQL
+
Prisma ORM
+
Neon

Pastikan DATABASE_URL sudah mengarah ke database Neon.

Prisma Generate

Jalankan:

npx prisma generate
Database Push

Untuk development:

npx prisma db push
Database Migration

Jika menggunakan migration:

npx prisma migrate dev
Seed Database

Jika project memiliki seed:

npx prisma db seed
Prisma Studio

Untuk melihat data database:

npx prisma studio

Prisma Studio dapat digunakan untuk memeriksa:

users
berita
layanan
agenda
pengumuman
pengajuan
UMKM
pembangunan
pesan masyarakat
dan data lainnya.
💻 Development

Jalankan development server:

npm.cmd run dev

Default:

http://localhost:3000

Jika port 3000 sedang digunakan, Next.js dapat menjalankan server pada port lain seperti:

http://localhost:3001
🧪 Verification

Sebelum melakukan commit atau deployment, jalankan:

npm.cmd run lint

Kemudian:

npm.cmd run typecheck

Dan:

npm.cmd run build

Idealnya seluruh command harus berhasil.

📜 Available Scripts

Contoh command yang digunakan dalam project:

npm.cmd run dev
npm.cmd run lint
npm.cmd run typecheck
npm.cmd run build

Untuk Prisma:

npx prisma generate
npx prisma db push
npx prisma migrate dev
npx prisma db seed
npx prisma studio
🌐 Application Routes
Public Routes
Route	Description
/	Beranda
/profil	Profil Desa
/berita	Berita Desa
/berita/[slug]	Detail Berita
/layanan	Layanan Desa
/layanan/[slug]	Detail Layanan
/agenda	Agenda Desa
/pemerintahan	Pemerintahan Desa
/potensi	Potensi Desa
/umkm	UMKM Desa
/pembangunan	Pembangunan Desa
/transparansi	Transparansi Desa
/data-desa	Data Desa
/galeri	Galeri Desa
/tracking	Tracking Pengajuan
/kontak	Kontak Desa
Authentication Routes
Route	Description
/login	Login administrator
Admin Routes

Area admin menggunakan prefix:

/admin

Contoh:

/admin
/admin/berita
/admin/layanan
/admin/agenda
/admin/pengumuman
/admin/pengajuan
/admin/pemerintahan
/admin/potensi
/admin/umkm
/admin/pembangunan
/admin/transparansi
/admin/galeri
/admin/data-desa
/admin/pesan
/admin/pengguna
/admin/pengaturan

Route dapat berkembang sesuai modul yang tersedia.

🗂️ Content Management

Salah satu tujuan utama DigiDesa adalah mengurangi ketergantungan terhadap data statis.

Alur pengelolaan:

Admin
  │
  ▼
Admin Dashboard
  │
  ▼
CRUD
  │
  ▼
Prisma ORM
  │
  ▼
Neon PostgreSQL
  │
  ▼
Public Website

Contoh:

Admin menambahkan berita
        ↓
Data disimpan ke PostgreSQL
        ↓
Public page melakukan query
        ↓
Berita tampil di /berita

Perubahan konten tidak memerlukan perubahan manual terhadap source code.

🔄 Revalidation

Setelah administrator melakukan:

Create
Update
Delete

halaman publik yang berkaitan harus diperbarui melalui mekanisme revalidation yang sesuai dengan Next.js.

Contoh:

revalidatePath("/berita");
revalidatePath(`/berita/${slug}`);

Tujuannya agar perubahan dari Admin Dashboard dapat tercermin pada website publik.

🎨 Design System

DigiDesa menggunakan pendekatan desain:

Modern
Clean
Professional
Government Digital Service
Responsive
Accessible

Public website dibuat lebih:

Visual
Informative
Welcoming
Editorial

Sedangkan Admin Dashboard lebih:

Structured
Data-driven
Efficient
Functional

Keduanya tetap menggunakan identitas visual yang sama.

🌙 Dark Mode

Website mendukung:

Light
Dark
System

Dark mode dirancang agar tetap mengikuti identitas visual Desa Sukamaju.

Dark mode diterapkan pada:

Public website
Admin dashboard
Sidebar
Header
Table
Form
Modal
Card
Chart
Dropdown
Navigation

Theme preference harus tetap tersimpan ketika halaman di-refresh.

📱 Responsive Design

Website dirancang untuk:

Mobile
Tablet
Desktop
Large Desktop

Breakpoint utama mengikuti responsive system Tailwind CSS.

Target pengujian:

320px
375px
390px
414px
768px
1024px
1280px
1440px
1920px

Area yang menjadi perhatian:

navbar
mobile menu
sidebar
table
form
modal
card
hero
footer
dashboard.
🔒 Security

Beberapa prinsip keamanan yang diterapkan:

Authentication
Server-side authorization
Protected admin routes
Role-based access
Password hashing
Environment variables
Prisma parameterized queries
Input validation
Secure session handling
Tidak menyimpan secret di client
Tidak menampilkan database credentials kepada user

Jangan pernah commit:

.env
.env.local
DATABASE_URL
AUTH_SECRET
API keys
private credentials
☁️ Deployment

Production menggunakan:

Vercel
+
Neon PostgreSQL

Architecture:

                   ┌──────────────────┐
                   │      Vercel      │
                   │    Next.js App   │
                   └────────┬─────────┘
                            │
                            │ Prisma
                            ▼
                   ┌──────────────────┐
                   │       Neon       │
                   │ PostgreSQL       │
                   └──────────────────┘
⚙️ Vercel Environment Variables

Tambahkan environment variables pada:

Vercel
→ Project
→ Settings
→ Environment Variables

Minimal:

DATABASE_URL=...
AUTH_SECRET=...

Jika authentication atau service lain membutuhkan environment variable tambahan, tambahkan sesuai konfigurasi project.

🚀 Production Build

Sebelum deploy:

npm.cmd run lint
npm.cmd run typecheck
npm.cmd run build

Jika seluruh proses berhasil, project siap untuk deployment.

🩺 Troubleshooting
Port 3000 digunakan

Jika muncul bahwa port 3000 sudah digunakan, Next.js dapat menggunakan port lain.

Atau hentikan proses yang menggunakan port tersebut.

Windows:

netstat -ano | findstr :3000

Kemudian hentikan process sesuai PID jika diperlukan.

Prisma Client Error

Coba:

npx prisma generate

Kemudian:

npm.cmd run dev
Database Connection Error

Periksa:

DATABASE_URL

Pastikan:

URL benar
Neon database aktif
SSL configuration benar
environment variable tersedia
database dapat diakses dari environment deployment.
Build Error

Jalankan:

npm.cmd run typecheck

Kemudian:

npm.cmd run lint

Setelah error diperbaiki:

npm.cmd run build
📊 Performance

Beberapa prinsip performance yang digunakan:

Server Components sebagai default
Client Components hanya ketika diperlukan
Optimized images
Responsive image sizes
Database pagination
Database aggregation untuk statistik
Menghindari N+1 query
Revalidation
Lazy loading
Minimal client-side JavaScript

Target utama:

Fast initial load
Low layout shift
Responsive interaction
Efficient database queries
♿ Accessibility

Website memperhatikan:

semantic HTML
keyboard navigation
focus state
accessible form labels
alt text
color contrast
accessible buttons
responsive text
dialog accessibility.
🧪 Quality Checklist

Sebelum release, pastikan:

Public Website
 Semua route dapat dibuka
 Tidak ada broken image
 Tidak ada horizontal overflow
 Mobile responsive
 Tablet responsive
 Desktop responsive
 Light mode bekerja
 Dark mode bekerja
 Navigation bekerja
 Form bekerja
Authentication
 Login berhasil
 Login gagal ditangani
 Logout bekerja
 Admin route terlindungi
 Authorization server-side
Admin Dashboard
 Dashboard menampilkan data database
 Sidebar responsive
 CRUD bekerja
 Form validation bekerja
 Delete confirmation bekerja
 Loading state tersedia
 Empty state tersedia
 Error state tersedia
Database
 Prisma generate berhasil
 Database connection berhasil
 Migration/push berhasil
 Seed berhasil jika digunakan
 Tidak ada query yang tidak diperlukan
Build
 Lint berhasil
 Typecheck berhasil
 Production build berhasil
📌 Development Principles

Project ini mengikuti beberapa prinsip:

1. Preserve Existing Features

Jangan menghapus fitur yang sudah berjalan tanpa alasan.

2. Root Cause First

Cari penyebab masalah sebelum memperbaikinya.

3. Minimal Changes

Gunakan perubahan sekecil mungkin untuk menyelesaikan masalah.

4. Server First

Gunakan Server Components untuk data dan rendering jika memungkinkan.

5. Database as Source of Truth

Data dinamis harus berasal dari PostgreSQL.

6. Secure by Default

Authorization harus dilakukan di server.

7. Responsive by Default

Setiap fitur baru harus dapat digunakan pada mobile, tablet, dan desktop.

8. Accessibility Matters

UI harus tetap dapat digunakan dengan keyboard dan memiliki contrast yang baik.

🗺️ Development Roadmap

Pengembangan DigiDesa dapat dilakukan secara bertahap:

Phase 1 — Foundation
 Next.js application
 Public website
 Responsive design
 Dark mode
Phase 2 — Backend
 Prisma
 PostgreSQL
 Neon
 Database schema
Phase 3 — Authentication
 Login
 Session
 Protected routes
 Role authorization
Phase 4 — Admin Dashboard
 Dashboard
 Sidebar
 CRUD
 Statistics
 Content management
Phase 5 — Dynamic Website
 Dynamic news
 Dynamic services
 Dynamic agenda
 Dynamic announcements
 Dynamic village data
Phase 6 — Quality
 Comprehensive responsive testing
 Performance optimization
 Accessibility audit
 Production monitoring
 Final security audit
👨‍💻 Development

Saat mengembangkan fitur baru:

Pahami struktur existing.
Gunakan komponen yang sudah tersedia.
Jangan membuat duplicate component tanpa alasan.
Gunakan TypeScript.
Gunakan Prisma untuk database.
Gunakan Server Components jika memungkinkan.
Validasi input.
Terapkan authorization.
Periksa responsive.
Test light/dark mode.
Jalankan lint.
Jalankan typecheck.
Jalankan production build.
📄 License

Project ini dibuat untuk kebutuhan Digitalisasi Informasi dan Pelayanan Desa Sukamaju.

Penggunaan, distribusi, dan modifikasi source code mengikuti ketentuan yang ditetapkan oleh pemilik/project maintainer.

🌱 DigiDesa Sukamaju

Membangun Desa yang Terhubung, Transparan, dan Melayani.
