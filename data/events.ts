export interface VillageEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  organizer: string;
  category: string;
  description: string;
}

export const villageEvents: VillageEvent[] = [
  {
    id: '1',
    title: 'Musyawarah Desa Perencanaan 2027',
    date: '2026-10-04',
    time: '09.00–12.00 WITA',
    location: 'Balai Desa Sukamaju',
    organizer: 'Pemerintah Desa',
    category: 'Musyawarah',
    description:
      'Pembahasan usulan program pembangunan tahun 2027 bersama perwakilan warga dan tokoh masyarakat.',
  },
  {
    id: '2',
    title: 'Gotong Royong Lingkungan',
    date: '2026-10-11',
    time: '07.00–10.00 WITA',
    location: 'Seluruh Dusun',
    organizer: 'Kepala Dusun',
    category: 'Sosial',
    description:
      'Kegiatan gotong royong pembersihan lingkungan dan saluran air di seluruh dusun.',
  },
  {
    id: '3',
    title: 'Posyandu Balita',
    date: '2026-10-14',
    time: '08.00–11.00 WITA',
    location: 'Posyandu Masing-Masing Dusun',
    organizer: 'Kader Posyandu',
    category: 'Kesehatan',
    description:
      'Pelayanan posyandu balita rutin: penimbangan, vitamin A, dan imunisasi dasar.',
  },
  {
    id: '4',
    title: 'Pelatihan Digital Marketing UMKM',
    date: '2026-10-20',
    time: '13.00–16.00 WITA',
    location: 'Balai Desa Sukamaju',
    organizer: 'Pemerintah Desa',
    category: 'Pelatihan',
    description:
      'Pelatihan pemasaran digital untuk pelaku UMKM desa agar produk lebih luas jangkauannya.',
  },
  {
    id: '5',
    title: 'Peringatan Hari Sumpah Pemuda',
    date: '2026-10-28',
    time: '08.00–selesai',
    location: 'Lapangan Desa Sukamaju',
    organizer: 'Karang Taruna',
    category: 'Peringatan',
    description:
      'Peringatan Hari Sumpah Pemuda ke-98 dengan berbagai lomba dan pentas seni.',
  },
  {
    id: '6',
    title: 'Pemeriksaan Kesehatan Lansia',
    date: '2026-11-03',
    time: '08.00–11.00 WITA',
    location: 'Balai Desa Sukamaju',
    organizer: 'Posyandu Lansia',
    category: 'Kesehatan',
    description:
      'Pemeriksaan kesehatan gratis untuk lansia: cek tekanan darah, gula darah, dan konsultasi.',
  },
];
