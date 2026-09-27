export type FieldType =
  | 'text'
  | 'email'
  | 'url'
  | 'textarea'
  | 'number'
  | 'date'
  | 'select'
  | 'checkbox'
  | 'lines'
  | 'table';

export interface FieldColumn {
  key: string;
  label: string;
  type: 'text' | 'number';
}

export interface FieldDef {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  help?: string;
  options?: { value: string; label: string }[];
  optionsFrom?: 'newsCategories' | 'serviceIcons' | 'officialCategories' | 'eventStatuses' | 'projectStatuses' | 'roles';
  columns?: FieldColumn[];
  rows?: number;
}

export interface ColumnDef {
  key: string;
  label: string;
  type?: 'text' | 'date' | 'currency' | 'number' | 'boolean' | 'badge';
  badgeKind?: 'newsStatus' | 'projectStatus' | 'messageStatus' | 'role' | 'eventStatus';
  className?: string;
}

export type ResourceKey =
  | 'news'
  | 'services'
  | 'events'
  | 'announcements'
  | 'officials'
  | 'potentials'
  | 'umkm'
  | 'projects'
  | 'budgets'
  | 'gallery'
  | 'messages'
  | 'users';

export interface ResourceDef {
  key: ResourceKey;
  title: string;
  singular: string;
  description: string;
  emptyMessage: string;
  fields: FieldDef[];
  columns: ColumnDef[];
  searchFields: string[];
  roles: ('ADMIN' | 'STAFF')[];
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
  /** Refresh halaman publik terkait setelah perubahan. */
  revalidate: boolean;
}

const IMAGE_FIELD: FieldDef = {
  name: 'image',
  label: 'URL Gambar',
  type: 'url',
  placeholder: 'https://images.pexels.com/photos/...',
  help: 'Gunakan gambar dari Pexels/Unsplash/Wikimedia. Akan tampil bila URL valid.',
};

export const ADMIN_RESOURCES: Record<ResourceKey, ResourceDef> = {
  news: {
    key: 'news',
    title: 'Berita',
    singular: 'Berita',
    description: 'Kelola berita dan informasi desa yang tampil di halaman publik.',
    emptyMessage: 'Belum ada berita.',
    searchFields: ['title', 'slug', 'excerpt', 'author'],
    roles: ['ADMIN'],
    canCreate: true,
    canEdit: true,
    canDelete: true,
    revalidate: true,
    columns: [
      { key: 'title', label: 'Judul' },
      { key: 'category', label: 'Kategori' },
      { key: 'publishedAt', label: 'Tanggal', type: 'date' },
      { key: 'status', label: 'Status', type: 'badge', badgeKind: 'newsStatus' },
    ],
    fields: [
      { name: 'title', label: 'Judul', type: 'text', placeholder: 'Judul berita' },
      { name: 'slug', label: 'Slug', type: 'text', placeholder: 'judul-berita', help: 'Huruf kecil dan tanda minus, dipakai untuk URL.' },
      { name: 'excerpt', label: 'Ringkasan', type: 'textarea', rows: 2 },
      { name: 'content', label: 'Isi Berita', type: 'textarea', rows: 10, help: 'Pisahkan paragraf dengan baris kosong.' },
      { name: 'categoryId', label: 'Kategori', type: 'select', optionsFrom: 'newsCategories' },
      { name: 'author', label: 'Penulis', type: 'text' },
      { name: 'publishedAt', label: 'Tanggal Terbit', type: 'date' },
      { name: 'readTime', label: 'Waktu Baca', type: 'text', placeholder: '3 menit' },
      { name: 'thumbnail', label: 'URL Thumbnail', type: 'url', placeholder: 'https://images.pexels.com/...' },
      { name: 'featured', label: 'Berita Unggulan', type: 'checkbox' },
      {
        name: 'status',
        label: 'Status',
        type: 'select',
        options: [
          { value: 'PUBLISHED', label: 'Terbit' },
          { value: 'DRAFT', label: 'Draf' },
        ],
      },
    ],
  },
  services: {
    key: 'services',
    title: 'Layanan',
    singular: 'Layanan',
    description: 'Kelola layanan administrasi desa beserta persyaratan dan prosedurnya.',
    emptyMessage: 'Belum ada layanan.',
    searchFields: ['name', 'slug', 'description'],
    roles: ['ADMIN'],
    canCreate: true,
    canEdit: true,
    canDelete: true,
    revalidate: true,
    columns: [
      { key: 'name', label: 'Nama Layanan' },
      { key: 'estimate', label: 'Estimasi' },
      { key: 'fee', label: 'Biaya' },
      { key: 'isActive', label: 'Aktif', type: 'boolean' },
    ],
    fields: [
      { name: 'name', label: 'Nama Layanan', type: 'text' },
      { name: 'slug', label: 'Slug', type: 'text', placeholder: 'surat-keterangan' },
      { name: 'description', label: 'Deskripsi', type: 'textarea', rows: 3 },
      { name: 'icon', label: 'Ikon', type: 'select', optionsFrom: 'serviceIcons' },
      { name: 'estimate', label: 'Estimasi Waktu', type: 'text', placeholder: '1 hari kerja' },
      { name: 'fee', label: 'Biaya', type: 'text', placeholder: 'Gratis' },
      { name: 'requirements', label: 'Persyaratan', type: 'lines', rows: 4, help: 'Satu persyaratan per baris.' },
      { name: 'procedure', label: 'Prosedur', type: 'lines', rows: 6, help: 'Satu langkah per baris.' },
      { name: 'documents', label: 'Dokumen', type: 'lines', rows: 3, help: 'Satu dokumen per baris.' },
      { name: 'order', label: 'Urutan', type: 'number' },
      { name: 'isActive', label: 'Aktif', type: 'checkbox' },
    ],
  },
  events: {
    key: 'events',
    title: 'Agenda',
    singular: 'Agenda',
    description: 'Kelola jadwal kegiatan desa yang tampil di halaman agenda.',
    emptyMessage: 'Belum ada agenda.',
    searchFields: ['title', 'location', 'organizer', 'category'],
    roles: ['ADMIN'],
    canCreate: true,
    canEdit: true,
    canDelete: true,
    revalidate: true,
    columns: [
      { key: 'title', label: 'Judul' },
      { key: 'date', label: 'Tanggal', type: 'date' },
      { key: 'location', label: 'Lokasi' },
      { key: 'status', label: 'Status', type: 'badge', badgeKind: 'eventStatus' },
    ],
    fields: [
      { name: 'title', label: 'Judul', type: 'text' },
      { name: 'description', label: 'Deskripsi', type: 'textarea', rows: 3 },
      { name: 'date', label: 'Tanggal', type: 'date' },
      { name: 'time', label: 'Waktu', type: 'text', placeholder: '09.00–12.00 WITA' },
      { name: 'location', label: 'Lokasi', type: 'text' },
      { name: 'organizer', label: 'Penyelenggara', type: 'text' },
      { name: 'category', label: 'Kategori', type: 'text', placeholder: 'Musyawarah' },
      { name: 'status', label: 'Status', type: 'select', optionsFrom: 'eventStatuses' },
    ],
  },
  announcements: {
    key: 'announcements',
    title: 'Pengumuman',
    singular: 'Pengumuman',
    description: 'Kelola pengumuman yang tampil di bar pengumuman website.',
    emptyMessage: 'Belum ada pengumuman.',
    searchFields: ['title', 'content', 'category'],
    roles: ['ADMIN'],
    canCreate: true,
    canEdit: true,
    canDelete: true,
    revalidate: true,
    columns: [
      { key: 'title', label: 'Judul' },
      { key: 'date', label: 'Tanggal', type: 'date' },
      { key: 'category', label: 'Kategori' },
      { key: 'isActive', label: 'Aktif', type: 'boolean' },
    ],
    fields: [
      { name: 'title', label: 'Judul', type: 'text' },
      { name: 'content', label: 'Isi', type: 'textarea', rows: 4 },
      { name: 'date', label: 'Tanggal', type: 'date' },
      { name: 'category', label: 'Kategori', type: 'text', placeholder: 'Libur' },
      { name: 'important', label: 'Penting', type: 'checkbox' },
      { name: 'isActive', label: 'Aktif', type: 'checkbox' },
    ],
  },
  officials: {
    key: 'officials',
    title: 'Pemerintahan',
    singular: 'Perangkat Desa',
    description: 'Kelola perangkat desa yang tampil di halaman pemerintahan.',
    emptyMessage: 'Belum ada perangkat desa.',
    searchFields: ['name', 'position'],
    roles: ['ADMIN'],
    canCreate: true,
    canEdit: true,
    canDelete: true,
    revalidate: true,
    columns: [
      { key: 'name', label: 'Nama' },
      { key: 'position', label: 'Jabatan' },
      { key: 'category', label: 'Kategori', type: 'badge', badgeKind: 'role' },
      { key: 'order', label: 'Urutan', type: 'number' },
    ],
    fields: [
      { name: 'name', label: 'Nama', type: 'text' },
      { name: 'position', label: 'Jabatan', type: 'text' },
      { name: 'category', label: 'Kategori', type: 'select', optionsFrom: 'officialCategories' },
      { name: 'photo', label: 'URL Foto', type: 'url', placeholder: 'https://images.pexels.com/...' },
      { name: 'nip', label: 'NIP', type: 'text' },
      { name: 'phone', label: 'Telepon', type: 'text' },
      { name: 'order', label: 'Urutan', type: 'number' },
    ],
  },
  potentials: {
    key: 'potentials',
    title: 'Potensi Desa',
    singular: 'Potensi',
    description: 'Kelola potensi ekonomi dan wisata desa.',
    emptyMessage: 'Belum ada potensi desa.',
    searchFields: ['name', 'category', 'location', 'description'],
    roles: ['ADMIN'],
    canCreate: true,
    canEdit: true,
    canDelete: true,
    revalidate: true,
    columns: [
      { key: 'name', label: 'Nama' },
      { key: 'category', label: 'Kategori' },
      { key: 'location', label: 'Lokasi' },
      { key: 'isActive', label: 'Aktif', type: 'boolean' },
    ],
    fields: [
      { name: 'name', label: 'Nama Potensi', type: 'text' },
      { name: 'category', label: 'Kategori', type: 'text', placeholder: 'Pertanian' },
      { name: 'description', label: 'Deskripsi', type: 'textarea', rows: 3 },
      { name: 'location', label: 'Lokasi', type: 'text' },
      { name: 'contact', label: 'Kontak', type: 'text' },
      IMAGE_FIELD,
      { name: 'isActive', label: 'Tampilkan di website', type: 'checkbox' },
    ],
  },
  umkm: {
    key: 'umkm',
    title: 'UMKM',
    singular: 'UMKM',
    description: 'Kelola katalog usaha milik masyarakat desa.',
    emptyMessage: 'Belum ada UMKM.',
    searchFields: ['name', 'owner', 'category', 'product', 'location'],
    roles: ['ADMIN'],
    canCreate: true,
    canEdit: true,
    canDelete: true,
    revalidate: true,
    columns: [
      { key: 'name', label: 'Nama Usaha' },
      { key: 'owner', label: 'Pemilik' },
      { key: 'category', label: 'Kategori' },
      { key: 'isActive', label: 'Aktif', type: 'boolean' },
    ],
    fields: [
      { name: 'name', label: 'Nama Usaha', type: 'text' },
      { name: 'owner', label: 'Pemilik', type: 'text' },
      { name: 'category', label: 'Kategori', type: 'text', placeholder: 'Kuliner' },
      { name: 'product', label: 'Produk', type: 'text' },
      { name: 'description', label: 'Deskripsi', type: 'textarea', rows: 3 },
      { name: 'location', label: 'Lokasi', type: 'text' },
      { name: 'contact', label: 'Kontak', type: 'text' },
      IMAGE_FIELD,
      { name: 'isActive', label: 'Tampilkan di website', type: 'checkbox' },
    ],
  },
  projects: {
    key: 'projects',
    title: 'Pembangunan',
    singular: 'Proyek Pembangunan',
    description: 'Kelola proyek pembangunan desa beserta progresnya.',
    emptyMessage: 'Belum ada proyek pembangunan.',
    searchFields: ['name', 'location', 'source'],
    roles: ['ADMIN'],
    canCreate: true,
    canEdit: true,
    canDelete: true,
    revalidate: true,
    columns: [
      { key: 'name', label: 'Proyek' },
      { key: 'year', label: 'Tahun', type: 'number' },
      { key: 'budget', label: 'Anggaran', type: 'currency' },
      { key: 'status', label: 'Status', type: 'badge', badgeKind: 'projectStatus' },
    ],
    fields: [
      { name: 'name', label: 'Nama Proyek', type: 'text' },
      { name: 'location', label: 'Lokasi', type: 'text' },
      { name: 'year', label: 'Tahun', type: 'number' },
      { name: 'budget', label: 'Anggaran (Rp)', type: 'number' },
      { name: 'source', label: 'Sumber Dana', type: 'text', placeholder: 'Dana Desa' },
      { name: 'progress', label: 'Progress (%)', type: 'number' },
      { name: 'status', label: 'Status', type: 'select', optionsFrom: 'projectStatuses' },
      { name: 'description', label: 'Deskripsi', type: 'textarea', rows: 3 },
    ],
  },
  budgets: {
    key: 'budgets',
    title: 'Transparansi',
    singular: 'Laporan Anggaran',
    description: 'Kelola laporan pendapatan dan belanja desa per tahun.',
    emptyMessage: 'Belum ada laporan anggaran.',
    searchFields: [],
    roles: ['ADMIN'],
    canCreate: true,
    canEdit: true,
    canDelete: true,
    revalidate: true,
    columns: [
      { key: 'year', label: 'Tahun', type: 'number' },
      { key: 'totalIncome', label: 'Pendapatan', type: 'currency' },
      { key: 'totalExpenditure', label: 'Belanja', type: 'currency' },
    ],
    fields: [
      { name: 'year', label: 'Tahun', type: 'number' },
      {
        name: 'income',
        label: 'Pendapatan',
        type: 'table',
        columns: [
          { key: 'label', label: 'Nama', type: 'text' },
          { key: 'value', label: 'Nilai (Rp)', type: 'number' },
          { key: 'color', label: 'Warna', type: 'text' },
        ],
      },
      {
        name: 'expenditure',
        label: 'Belanja',
        type: 'table',
        columns: [
          { key: 'label', label: 'Nama', type: 'text' },
          { key: 'value', label: 'Nilai (Rp)', type: 'number' },
          { key: 'color', label: 'Warna', type: 'text' },
        ],
      },
      { name: 'description', label: 'Catatan', type: 'textarea', rows: 2 },
    ],
  },
  gallery: {
    key: 'gallery',
    title: 'Galeri',
    singular: 'Foto',
    description: 'Kelola dokumentasi foto kegiatan desa.',
    emptyMessage: 'Belum ada foto galeri.',
    searchFields: ['title', 'category', 'caption'],
    roles: ['ADMIN'],
    canCreate: true,
    canEdit: true,
    canDelete: true,
    revalidate: true,
    columns: [
      { key: 'title', label: 'Judul' },
      { key: 'category', label: 'Kategori' },
      { key: 'date', label: 'Tanggal', type: 'date' },
    ],
    fields: [
      { name: 'title', label: 'Judul', type: 'text' },
      IMAGE_FIELD,
      { name: 'category', label: 'Kategori', type: 'text', placeholder: 'Kegiatan Desa' },
      { name: 'caption', label: 'Caption', type: 'textarea', rows: 2 },
      { name: 'date', label: 'Tanggal', type: 'date' },
    ],
  },
  messages: {
    key: 'messages',
    title: 'Pesan Masyarakat',
    singular: 'Pesan',
    description: 'Pesan yang dikirim masyarakat melalui halaman kontak.',
    emptyMessage: 'Belum ada pesan masuk.',
    searchFields: ['name', 'email', 'subject', 'message'],
    roles: ['ADMIN'],
    canCreate: false,
    canEdit: true,
    canDelete: true,
    revalidate: false,
    columns: [
      { key: 'name', label: 'Nama' },
      { key: 'email', label: 'Email' },
      { key: 'subject', label: 'Subjek' },
      { key: 'status', label: 'Status', type: 'badge', badgeKind: 'messageStatus' },
      { key: 'createdAt', label: 'Tanggal', type: 'date' },
    ],
    fields: [
      {
        name: 'status',
        label: 'Status Pesan',
        type: 'select',
        options: [
          { value: 'UNREAD', label: 'Belum Dibaca' },
          { value: 'READ', label: 'Sudah Dibaca' },
        ],
      },
    ],
  },
  users: {
    key: 'users',
    title: 'Pengguna',
    singular: 'Pengguna',
    description: 'Kelola akun admin dan petugas.',
    emptyMessage: 'Belum ada pengguna.',
    searchFields: ['name', 'email'],
    roles: ['ADMIN'],
    canCreate: true,
    canEdit: true,
    canDelete: true,
    revalidate: false,
    columns: [
      { key: 'name', label: 'Nama' },
      { key: 'email', label: 'Email' },
      { key: 'role', label: 'Peran', type: 'badge', badgeKind: 'role' },
      { key: 'isActive', label: 'Aktif', type: 'boolean' },
    ],
    fields: [
      { name: 'name', label: 'Nama', type: 'text' },
      { name: 'email', label: 'Email', type: 'email' },
      {
        name: 'role',
        label: 'Peran',
        type: 'select',
        options: [
          { value: 'ADMIN', label: 'Admin' },
          { value: 'STAFF', label: 'Petugas' },
        ],
      },
      { name: 'password', label: 'Password', type: 'text', help: 'Minimal 8 karakter. Kosongkan jika tidak diganti.' },
      { name: 'isActive', label: 'Aktif', type: 'checkbox' },
    ],
  },
};

export const NAV_GROUPS = [
  'Utama',
  'Pelayanan',
  'Konten',
  'Profil Desa',
  'Komunikasi',
  'Sistem',
] as const;

export const ADMIN_NAV: {
  href: string;
  label: string;
  icon: string;
  group: (typeof NAV_GROUPS)[number];
  roles: ('ADMIN' | 'STAFF')[];
}[] = [
  { href: '/admin', label: 'Dashboard', icon: 'LayoutDashboard', group: 'Utama', roles: ['ADMIN', 'STAFF'] },
  { href: '/admin/pengajuan', label: 'Pengajuan Layanan', icon: 'FileStack', group: 'Pelayanan', roles: ['ADMIN', 'STAFF'] },
  { href: '/admin/layanan', label: 'Layanan Desa', icon: 'Files', group: 'Pelayanan', roles: ['ADMIN'] },
  { href: '/admin/berita', label: 'Berita', icon: 'Newspaper', group: 'Konten', roles: ['ADMIN'] },
  { href: '/admin/agenda', label: 'Agenda', icon: 'CalendarDays', group: 'Konten', roles: ['ADMIN'] },
  { href: '/admin/pengumuman', label: 'Pengumuman', icon: 'Megaphone', group: 'Konten', roles: ['ADMIN'] },
  { href: '/admin/galeri', label: 'Galeri', icon: 'Images', group: 'Konten', roles: ['ADMIN'] },
  { href: '/admin/data-desa', label: 'Data Desa', icon: 'TableProperties', group: 'Profil Desa', roles: ['ADMIN'] },
  { href: '/admin/pemerintahan', label: 'Pemerintahan', icon: 'Landmark', group: 'Profil Desa', roles: ['ADMIN'] },
  { href: '/admin/potensi', label: 'Potensi Desa', icon: 'Sprout', group: 'Profil Desa', roles: ['ADMIN'] },
  { href: '/admin/umkm', label: 'UMKM', icon: 'Store', group: 'Profil Desa', roles: ['ADMIN'] },
  { href: '/admin/pembangunan', label: 'Pembangunan', icon: 'HardHat', group: 'Profil Desa', roles: ['ADMIN'] },
  { href: '/admin/transparansi', label: 'Transparansi', icon: 'Wallet', group: 'Profil Desa', roles: ['ADMIN'] },
  { href: '/admin/pesan', label: 'Pesan Masyarakat', icon: 'Inbox', group: 'Komunikasi', roles: ['ADMIN'] },
  { href: '/admin/pengguna', label: 'Pengguna', icon: 'Users', group: 'Sistem', roles: ['ADMIN'] },
  { href: '/admin/pengaturan', label: 'Pengaturan', icon: 'Settings', group: 'Sistem', roles: ['ADMIN'] },
];
