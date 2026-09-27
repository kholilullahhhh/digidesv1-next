export interface NewsArticle {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  thumbnail: string;
  featured?: boolean;
}

export const newsCategories = [
  'Berita Desa',
  'Pemerintahan',
  'Kegiatan',
  'Pembangunan',
  'Sosial',
  'Pengumuman',
];

export const newsArticles: NewsArticle[] = [
  {
    slug: 'gotong-royong-pembersihan-sungai-2026',
    title: 'Gotong Royong Pembersihan Sungai di Dusun Tengah',
    excerpt:
      'Warga Dusun Tengah bersama pemdes menggelar gotong royong pembersihan sungai untuk mencegah banjir saat musim hujan.',
    content:
      'Masyarakat Dusun Tengah bersama perangkat Desa Sukamaju menggelar kegiatan gotong royong pembersihan sungai pada Sabtu pagi. Kegiatan ini diikuti oleh lebih dari 100 warga dari berbagai usia. Kepala Dusun Tengah, Rusmin Tang, menyampaikan bahwa kegiatan ini menjadi rutinitas menjelang musim hujan untuk mencegah banjir. "Alhamdulillah, partisipasi warga sangat tinggi. Ini menunjukkan semangat kebersamaan masyarakat kita," ujar Kepala Desa H. Muh. Yusuf Kara. Kegiatan dimulai pukul 07.00 WITA dan berlangsung hingga siang.',
    category: 'Kegiatan',
    author: 'Humas Desa Sukamaju',
    date: '2026-09-20',
    readTime: '3 menit',
    thumbnail: 'https://images.pexels.com/photos/6644386/pexels-photo-6644386.jpeg',
    featured: true,
  },
  {
    slug: 'penyaluran-bantuan-pkh-tahap-3',
    title: 'Penyaluran Bantuan PKH Tahap 3 Tahun 2026',
    excerpt:
      'Pemerintah desa menyalurkan bantuan Program Keluarga Harapan (PKH) tahap ketiga kepada 187 penerima manfaat.',
    content:
      'Pemerintah Desa Sukamaju telah menyalurkan bantuan Program Keluarga Harapan (PKH) tahap ketiga tahun 2026 kepada 187 penerima manfaat. Penyaluran dilakukan langsung di Kantor Desa Sukamaju pada Selasa lalu. Kepala Desa H. Muh. Yusuf Kara mengimbau kepada seluruh penerima manfaat untuk menggunakan dana bantuan secara tepat guna, khususnya untuk kebutuhan kesehatan dan pendidikan keluarga.',
    category: 'Sosial',
    author: 'Kasi Kesra',
    date: '2026-09-18',
    readTime: '2 menit',
    thumbnail: 'https://images.pexels.com/photos/6646918/pexels-photo-6646918.jpeg',
  },
  {
    slug: 'pembangunan-irigasi-dusun-timur',
    title: 'Pembangunan Saluran Irigasi Dusun Timur Dimulai',
    excerpt:
      'Proyek pembangunan saluran irigasi sepanjang 1,2 km di Dusun Timur mulai dikerjakan awal September 2026.',
    content:
      'Pembangunan saluran irigasi sepanjang 1,2 km di Dusun Timur resmi dimulai pada awal September 2026. Proyek dengan anggaran Rp 285 juta dari Dana Desa ini diharapkan dapat mengairi 45 hektar sawah di Dusun Timur. "Dengan adanya irigasi ini, produktivitas pertanian kita akan meningkat. Petani tidak lagi bergantung pada musim hujan," ungkap Kepala Desa. Proyek ditargetkan selesai dalam 90 hari kerja.',
    category: 'Pembangunan',
    author: 'Kasi Pelayanan',
    date: '2026-09-15',
    readTime: '4 menit',
    thumbnail: 'https://images.pexels.com/photos/265906/pexels-photo-265906.jpeg',
    featured: true,
  },
  {
    slug: 'pelatihan-tata-boga-umkm-desa',
    title: 'Pelatihan Tata Boga untuk Pelaku UMKM Desa',
    excerpt:
      'Sebanyak 35 pelaku UMKM kuliner mengikuti pelatihan tata boga untuk meningkatkan kualitas produk.',
    content:
      'Sebanyak 35 pelaku UMKM kuliner di Desa Sukamaju mengikuti pelatihan tata boga yang diselenggarakan oleh Pemerintah Desa bekerja sama dengan Dinas Koperasi dan UMKM Kabupaten Gowa. Pelatihan berlangsung selama tiga hari di Balai Desa. Materi mencakup higienitas pangan, pengemasan, dan pemasaran digital. "Kami berharap pelaku UMKM dapat meningkatkan kualitas dan daya saing produk mereka," kata Sekretaris Desa Siti Aisyah Rahman.',
    category: 'Kegiatan',
    author: 'Humas Desa Sukamaju',
    date: '2026-09-12',
    readTime: '3 menit',
    thumbnail: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg',
  },
  {
    slug: 'posyandu-balita-september-2026',
    title: 'Posyandu Balita Rutin Bulan September',
    excerpt:
      'Posyandu balita di lima dusun rutin digelar untuk memantau tumbuh kembang dan status gizi balita.',
    content:
      'Posyandu balita rutin bulan September digelar serentak di lima dusun Desa Sukamaju. Kegiatan mencakup penimbangan, pemberian vitamin A, dan imunisasi dasar. Kepala Seksi Kesejahteraan Rakyat Nurhaeda melaporkan bahwa cakupan posyandu bulan ini mencapai 87% dari target. "Alhamdulillah antusiasme warga tinggi. Kami terus berupaya meningkatkan cakupan setiap bulan," katanya.',
    category: 'Sosial',
    author: 'Kasi Kesra',
    date: '2026-09-08',
    readTime: '2 menit',
    thumbnail: 'https://images.pexels.com/photos/33687869/pexels-photo-33687869.jpeg',
  },
  {
    slug: 'musyawarah-desa-perencanaan-2027',
    title: 'Musdes Perencanaan Pembangunan Tahun 2027',
    excerpt:
      'Musyawarah desa membahas usulan program pembangunan tahun 2027 yang bersumber dari Dana Desa.',
    content:
      'Pemerintah Desa Sukamaju menggelar Musyawarah Desa (Musdes) perencanaan pembangunan tahun 2027 di Balai Desa. Musdes dihadiri perwakilan warga dari lima dusun, tokoh masyarakat, dan perangkat desa. Beberapa usulan yang masuk antara lain pembangunan jalan dusun, pengadaan pompa air, dan peningkatan sarana posyandu. Hasil musdes akan menjadi dasar penyusunan Rencana Kerja Pemerintah Desa tahun 2027.',
    category: 'Pemerintahan',
    author: 'Kaur Perencanaan',
    date: '2026-09-05',
    readTime: '5 menit',
    thumbnail: 'https://images.pexels.com/photos/3184398/pexels-photo-3184398.jpeg',
  },
];
