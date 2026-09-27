import { z } from 'zod';

export const imageUrl = z
  .string()
  .trim()
  .min(1, 'URL gambar wajib diisi')
  .refine((v) => /^https?:\/\/\S+$/i.test(v) || v.startsWith('/'), {
    message: 'URL gambar tidak valid (harus http/https)',
  });

export const dateInput = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Format tanggal harus YYYY-MM-DD');

export const slugInput = z
  .string()
  .trim()
  .min(3, 'Slug minimal 3 karakter')
  .max(160, 'Slug terlalu panjang')
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Gunakan huruf kecil, angka, dan tanda minus');

export const linesInput = z
  .array(z.string().trim().min(1, 'Baris tidak boleh kosong'))
  .min(1, 'Minimal satu baris');

export const loginSchema = z.object({
  email: z.string().trim().email('Email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
});

export const contactSchema = z.object({
  name: z.string().trim().min(3, 'Nama minimal 3 karakter'),
  email: z.string().trim().email('Email tidak valid'),
  phone: z.string().trim().min(8, 'Nomor HP tidak valid'),
  subject: z.string().trim().min(3, 'Subjek minimal 3 karakter'),
  message: z.string().trim().min(10, 'Pesan minimal 10 karakter'),
});

export type ContactInput = z.infer<typeof contactSchema>;

export const applicationSchema = z.object({
  serviceSlug: slugInput,
  applicantName: z.string().trim().min(3, 'Nama minimal 3 karakter'),
  phone: z.string().trim().min(8, 'Nomor HP tidak valid'),
  email: z.string().trim().email('Email tidak valid'),
  address: z.string().trim().max(300).optional().or(z.literal('')),
  notes: z.string().trim().max(1000).optional().or(z.literal('')),
});

export const trackingSchema = z.object({
  trackingNumber: z.string().trim().min(4, 'Masukkan nomor pengajuan'),
});

export const newsSchema = z.object({
  title: z.string().trim().min(3, 'Judul minimal 3 karakter').max(200),
  slug: slugInput,
  excerpt: z.string().trim().min(10, 'Ringkasan minimal 10 karakter').max(500),
  content: z.string().trim().min(20, 'Isi berita minimal 20 karakter'),
  categoryId: z.string().min(1, 'Kategori wajib dipilih'),
  author: z.string().trim().min(2, 'Penulis wajib diisi'),
  publishedAt: dateInput,
  readTime: z.string().trim().min(1, 'Waktu baca wajib diisi'),
  thumbnail: imageUrl,
  featured: z.boolean(),
  status: z.enum(['DRAFT', 'PUBLISHED']),
});

export const serviceSchema = z.object({
  name: z.string().trim().min(3, 'Nama layanan minimal 3 karakter').max(160),
  slug: slugInput,
  description: z.string().trim().min(10, 'Deskripsi minimal 10 karakter'),
  icon: z.string().min(1, 'Ikon wajib dipilih'),
  estimate: z.string().trim().min(1, 'Estimasi waktu wajib diisi'),
  fee: z.string().trim().min(1, 'Biaya wajib diisi'),
  requirements: linesInput,
  procedure: linesInput,
  documents: linesInput,
  isActive: z.boolean(),
  order: z.coerce.number().int().min(0),
});

export const eventSchema = z.object({
  title: z.string().trim().min(3, 'Judul minimal 3 karakter'),
  description: z.string().trim().min(10, 'Deskripsi minimal 10 karakter'),
  date: dateInput,
  time: z.string().trim().min(1, 'Waktu wajib diisi'),
  location: z.string().trim().min(2, 'Lokasi wajib diisi'),
  organizer: z.string().trim().min(2, 'Penyelenggara wajib diisi'),
  category: z.string().trim().min(2, 'Kategori wajib diisi'),
  status: z.enum(['SCHEDULED', 'ONGOING', 'DONE', 'CANCELLED']),
});

export const announcementSchema = z.object({
  title: z.string().trim().min(3, 'Judul minimal 3 karakter'),
  content: z.string().trim().min(10, 'Isi minimal 10 karakter'),
  date: dateInput,
  category: z.string().trim().min(2, 'Kategori wajib diisi'),
  important: z.boolean(),
  isActive: z.boolean(),
});

export const officialSchema = z.object({
  name: z.string().trim().min(3, 'Nama minimal 3 karakter'),
  position: z.string().trim().min(2, 'Jabatan wajib diisi'),
  category: z.enum(['HEAD', 'SECRETARY', 'KAUR', 'KASI', 'KADUS']),
  photo: imageUrl,
  nip: z.string().trim().optional().or(z.literal('')),
  phone: z.string().trim().optional().or(z.literal('')),
  order: z.coerce.number().int().min(0),
});

export const potentialSchema = z.object({
  name: z.string().trim().min(3, 'Nama minimal 3 karakter'),
  category: z.string().trim().min(2, 'Kategori wajib diisi'),
  description: z.string().trim().min(10, 'Deskripsi minimal 10 karakter'),
  location: z.string().trim().min(2, 'Lokasi wajib diisi'),
  contact: z.string().trim().optional().or(z.literal('')),
  image: imageUrl,
  isActive: z.boolean(),
});

export const umkmSchema = z.object({
  name: z.string().trim().min(3, 'Nama minimal 3 karakter'),
  owner: z.string().trim().min(2, 'Pemilik wajib diisi'),
  category: z.string().trim().min(2, 'Kategori wajib diisi'),
  product: z.string().trim().min(2, 'Produk wajib diisi'),
  location: z.string().trim().min(2, 'Lokasi wajib diisi'),
  contact: z.string().trim().min(6, 'Kontak wajib diisi'),
  image: imageUrl,
  description: z.string().trim().min(10, 'Deskripsi minimal 10 karakter'),
  isActive: z.boolean(),
});

export const projectSchema = z.object({
  name: z.string().trim().min(3, 'Nama proyek minimal 3 karakter'),
  location: z.string().trim().min(2, 'Lokasi wajib diisi'),
  year: z.coerce.number().int().min(2000).max(2100),
  budget: z.coerce.number().min(0, 'Anggaran tidak boleh negatif'),
  source: z.string().trim().min(2, 'Sumber dana wajib diisi'),
  progress: z.coerce.number().min(0).max(100),
  status: z.enum(['PLANNING', 'IN_PROGRESS', 'COMPLETED']),
  description: z.string().trim().optional().or(z.literal('')),
});

const budgetItemSchema = z.object({
  label: z.string().trim().min(1, 'Nama item wajib diisi'),
  value: z.coerce.number().min(0, 'Nilai tidak boleh negatif'),
  color: z.string().trim().optional().or(z.literal('')),
});

export const budgetSchema = z.object({
  year: z.coerce.number().int().min(2000).max(2100),
  income: z.array(budgetItemSchema).min(1, 'Minimal satu item pendapatan'),
  expenditure: z.array(budgetItemSchema).min(1, 'Minimal satu item belanja'),
  description: z.string().trim().optional().or(z.literal('')),
});

export const gallerySchema = z.object({
  title: z.string().trim().min(3, 'Judul minimal 3 karakter'),
  image: imageUrl,
  category: z.string().trim().min(2, 'Kategori wajib diisi'),
  caption: z.string().trim().optional().or(z.literal('')),
  date: dateInput,
});

export const statsTableSchema = z.array(
  z.object({
    label: z.string().trim().min(1),
    value: z.coerce.number(),
  }),
);

export const villageSchema = z.object({
  population: z.coerce.number().int().min(0),
  malePopulation: z.coerce.number().int().min(0),
  femalePopulation: z.coerce.number().int().min(0),
  families: z.coerce.number().int().min(0),
  dusun: z.coerce.number().int().min(0),
  rt: z.coerce.number().int().min(0),
  rw: z.coerce.number().int().min(0),
  area: z.coerce.number().min(0),
  density: z.coerce.number().int().min(0),
  dusunNames: linesInput,
  ageGroups: z
    .array(
      z.object({
        range: z.string().trim().min(1, 'Rentang wajib diisi'),
        total: z.coerce.number().int().min(0),
        male: z.coerce.number().int().min(0),
        female: z.coerce.number().int().min(0),
      }),
    )
    .min(1, 'Minimal satu kelompok umur'),
  educationLevels: z
    .array(
      z.object({
        level: z.string().trim().min(1, 'Tingkat wajib diisi'),
        total: z.coerce.number().int().min(0),
      }),
    )
    .min(1, 'Minimal satu tingkat pendidikan'),
  jobCategories: z
    .array(
      z.object({
        category: z.string().trim().min(1, 'Kategori wajib diisi'),
        total: z.coerce.number().int().min(0),
      }),
    )
    .min(1, 'Minimal satu mata pencaharian'),
});

export const settingsSchema = z.object({
  name: z.string().trim().min(2, 'Nama desa wajib diisi'),
  district: z.string().trim().min(2, 'Kecamatan wajib diisi'),
  regency: z.string().trim().min(2, 'Kabupaten wajib diisi'),
  province: z.string().trim().min(2, 'Provinsi wajib diisi'),
  postalCode: z.string().trim().min(3, 'Kode pos wajib diisi'),
  address: z.string().trim().min(5, 'Alamat wajib diisi'),
  phone: z.string().trim().min(5, 'Telepon wajib diisi'),
  email: z.string().trim().email('Email tidak valid'),
  hours: z.string().trim().min(3, 'Jam pelayanan wajib diisi'),
  description: z.string().trim().min(10, 'Deskripsi minimal 10 karakter'),
  logoUrl: z.string().trim().optional().or(z.literal('')),
  headPhotoUrl: imageUrl.optional().or(z.literal('')),
  lat: z.coerce.number().min(-90).max(90),
  lng: z.coerce.number().min(-180).max(180),
  history: z.string().trim().optional().or(z.literal('')),
  vision: z.string().trim().min(10, 'Visi minimal 10 karakter'),
  missions: linesInput,
  borderNorth: z.string().trim().optional().or(z.literal('')),
  borderSouth: z.string().trim().optional().or(z.literal('')),
  borderEast: z.string().trim().optional().or(z.literal('')),
  borderWest: z.string().trim().optional().or(z.literal('')),
  headOfVillageName: z.string().trim().min(2, 'Nama kepala desa wajib diisi'),
  headOfVillagePosition: z.string().trim().min(2, 'Jabatan wajib diisi'),
  headOfVillagePeriod: z.string().trim().min(2, 'Periode wajib diisi'),
  headOfVillageGreeting: z.string().trim().min(10, 'Sambutan minimal 10 karakter'),
  siteName: z.string().trim().min(2, 'Nama situs wajib diisi'),
  shortName: z.string().trim().min(2, 'Nama singkat wajib diisi'),
  tagline: z.string().trim().min(3, 'Tagline wajib diisi'),
  siteDescription: z.string().trim().min(10, 'Deskripsi minimal 10 karakter'),
  facebook: z
    .string()
    .trim()
    .refine((v) => v === '' || /^https?:\/\/\S+$/i.test(v), 'URL Facebook tidak valid'),
  instagram: z
    .string()
    .trim()
    .refine((v) => v === '' || /^https?:\/\/\S+$/i.test(v), 'URL Instagram tidak valid'),
  youtube: z
    .string()
    .trim()
    .refine((v) => v === '' || /^https?:\/\/\S+$/i.test(v), 'URL YouTube tidak valid'),
  ogImageUrl: z
    .string()
    .trim()
    .refine((v) => v === '' || /^https?:\/\/\S+$/i.test(v), 'URL gambar tidak valid'),
  footerNote: z.string().trim().min(3, 'Catatan footer wajib diisi'),
});

export const userSchema = z.object({
  name: z.string().trim().min(3, 'Nama minimal 3 karakter'),
  email: z.string().trim().email('Email tidak valid'),
  role: z.enum(['ADMIN', 'STAFF']),
  isActive: z.boolean(),
  password: z
    .string()
    .optional()
    .or(z.literal(''))
    .refine((v) => v === undefined || v === '' || v.length >= 8, {
      message: 'Password minimal 8 karakter',
    }),
});

export const applicationStatusSchema = z.object({
  status: z.enum(['SUBMITTED', 'VERIFIED', 'PROCESSING', 'REVISION', 'COMPLETED', 'REJECTED']),
  note: z.string().trim().max(500).optional().or(z.literal('')),
});

export const messageStatusSchema = z.object({
  status: z.enum(['UNREAD', 'READ']),
});

export type NewsInput = z.infer<typeof newsSchema>;
export type ServiceInput = z.infer<typeof serviceSchema>;
export type EventInput = z.infer<typeof eventSchema>;
export type AnnouncementInput = z.infer<typeof announcementSchema>;
export type OfficialInput = z.infer<typeof officialSchema>;
export type PotentialInput = z.infer<typeof potentialSchema>;
export type UmkmInput = z.infer<typeof umkmSchema>;
export type ProjectInput = z.infer<typeof projectSchema>;
export type BudgetInput = z.infer<typeof budgetSchema>;
export type GalleryInput = z.infer<typeof gallerySchema>;
export type VillageInput = z.infer<typeof villageSchema>;
export type SettingsInput = z.infer<typeof settingsSchema>;
export type UserInput = z.infer<typeof userSchema>;
