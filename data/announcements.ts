export interface Announcement {
  id: string;
  title: string;
  date: string;
  category: string;
  content: string;
  important?: boolean;
}

export const announcements: Announcement[] = [
  {
    id: '1',
    title: 'Pengumuman Libur Hari Sumpah Pemuda',
    date: '2026-10-27',
    category: 'Libur',
    content:
      'Menginformasikan kepada seluruh masyarakat bahwa pelayanan kantor desa diliburkan pada 28 Oktober 2026 dalam rangka Hari Sumpah Pemuda. Pelayanan kembali normal pada 29 Oktober 2026.',
    important: true,
  },
  {
    id: '2',
    title: 'Pendaftaran Bantuan Sosial November',
    date: '2026-10-15',
    category: 'Bansos',
    content:
      'Dibuka pendaftaran bantuan sosial bulan November 2026. Warga yang berhak dapat mendaftar di kantor desa dengan membawa KTP dan KK.',
  },
  {
    id: '3',
    title: 'Undangan Musyawarah Desa',
    date: '2026-10-01',
    category: 'Musyawarah',
    content:
      'Mengundang perwakilan warga seluruh dusun untuk hadir dalam Musyawarah Desa perencanaan pembangunan tahun 2027 pada 4 Oktober 2026 di Balai Desa.',
  },
];
