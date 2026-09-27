export interface GalleryItem {
  id: string;
  title: string;
  category: string;
  image: string;
  date: string;
  caption: string;
}

export const galleryCategories = [
  'Kegiatan Desa',
  'Pembangunan',
  'Budaya',
  'Wisata',
  'Masyarakat',
];

export const galleryItems: GalleryItem[] = [
  {
    id: '1',
    title: 'Gotong Royong Sungai',
    category: 'Kegiatan Desa',
    image: 'https://images.pexels.com/photos/6644386/pexels-photo-6644386.jpeg',
    date: '2026-09-20',
    caption: 'Warga Dusun Tengah bersama pemdes membersihkan sungai.',
  },
  {
    id: '2',
    title: 'Saluran Irigasi Baru',
    category: 'Pembangunan',
    image: 'https://images.pexels.com/photos/265906/pexels-photo-265906.jpeg',
    date: '2026-09-15',
    caption: 'Pengerjaan saluran irigasi Dusun Timur.',
  },
  {
    id: '3',
    title: 'Tarian Tradisional',
    category: 'Budaya',
    image: 'https://images.pexels.com/photos/4939461/pexels-photo-4939461.jpeg',
    date: '2026-08-17',
    caption: 'Penampilan tarian tradisional pada peringatan HUT RI.',
  },
  {
    id: '4',
    title: 'Air Terjun Bontosomba',
    category: 'Wisata',
    image: 'https://images.pexels.com/photos/261403/pexels-photo-261403.jpeg',
    date: '2026-08-10',
    caption: 'Destinasi wisata air terjun di Dusun Barat.',
  },
  {
    id: '5',
    title: 'Panen Raya Padi',
    category: 'Masyarakat',
    image: 'https://images.pexels.com/photos/1684010/pexels-photo-1684010.jpeg',
    date: '2026-07-25',
    caption: 'Petani Dusun Timur merayakan panen raya.',
  },
  {
    id: '6',
    title: 'Pelatihan UMKM',
    category: 'Kegiatan Desa',
    image: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg',
    date: '2026-09-12',
    caption: 'Pelatihan tata boga untuk pelaku UMKM desa.',
  },
  {
    id: '7',
    title: 'Hamparan Sawah',
    category: 'Wisata',
    image: 'https://images.pexels.com/photos/158028/bellingrath-gardens-alabama-architecture-scenic-158028.jpeg',
    date: '2026-07-01',
    caption: 'Hamparan sawah hijau di Dusun Timur.',
  },
  {
    id: '8',
    title: 'Penyaluran Bantuan PKH',
    category: 'Masyarakat',
    image: 'https://images.pexels.com/photos/6646918/pexels-photo-6646918.jpeg',
    date: '2026-09-18',
    caption: 'Penyaluran bantuan PKH tahap 3 di kantor desa.',
  },
  {
    id: '9',
    title: 'Posyandu Balita',
    category: 'Masyarakat',
    image: 'https://images.pexels.com/photos/6103/people.jpg',
    date: '2026-09-08',
    caption: 'Kegiatan posyandu balita rutin di seluruh dusun.',
  },
  {
    id: '10',
    title: 'Musyawarah Desa',
    category: 'Kegiatan Desa',
    image: 'https://images.pexels.com/photos/3184398/pexels-photo-3184398.jpeg',
    date: '2026-09-05',
    caption: 'Musdes perencanaan pembangunan tahun 2027.',
  },
  {
    id: '11',
    title: 'Peternakan Sapi',
    category: 'Masyarakat',
    image: 'https://images.pexels.com/photos/16280/cows-countryside-agriculture.jpg',
    date: '2026-06-20',
    caption: 'Kelompok peternakan sapi potong di Dusun Utara.',
  },
  {
    id: '12',
    title: 'Kopi Robusta',
    category: 'Budaya',
    image: 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg',
    date: '2026-06-15',
    caption: 'Proses pengeringan kopi robusta di Dusun Barat.',
  },
];
