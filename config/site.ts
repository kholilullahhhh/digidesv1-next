export const siteConfig = {
  name: 'Desa Sukamaju',
  shortName: 'Sukamaju',
  tagline: 'Portal Resmi Pemerintah Desa',
  description:
    'Portal digital resmi Pemerintah Desa Sukamaju untuk informasi, pelayanan publik, transparansi anggaran, dan potensi desa.',
  village: 'Sukamaju',
  district: 'Bontonompo',
  regency: 'Gowa',
  province: 'Sulawesi Selatan',
  postalCode: '92172',
  address: 'Jl. Poros Bontonompo, Dusun Tengah, Desa Sukamaju, Kec. Bontonompo, Kab. Gowa, Sulawesi Selatan 92172',
  phone: '(0411) 555-0192',
  email: 'pemdes@desasukamaju.id',
  hours: 'Senin–Jumat: 08.00–16.00 WITA',
  coordinates: { lat: -5.2632, lng: 119.4113 },
  social: {
    facebook: 'https://facebook.com/desasukamaju',
    instagram: 'https://instagram.com/desasukamaju',
    youtube: 'https://youtube.com/@desasukamaju',
  },
  nav: [
    { title: 'Beranda', href: '/' },
    { title: 'Profil Desa', href: '/profil' },
    { title: 'Pemerintahan', href: '/pemerintahan' },
    { title: 'Layanan', href: '/layanan' },
    { title: 'Berita', href: '/berita' },
    { title: 'Potensi Desa', href: '/potensi' },
    { title: 'Transparansi', href: '/transparansi' },
    { title: 'Kontak', href: '/kontak' },
  ],
} as const;

export type SiteConfig = typeof siteConfig;
