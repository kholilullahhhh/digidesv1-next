export interface Potential {
  id: string;
  name: string;
  category: string;
  description: string;
  location: string;
  contact?: string;
  image: string;
}

export const potentialCategories = [
  'Pertanian',
  'Perkebunan',
  'Peternakan',
  'UMKM',
  'Kerajinan',
  'Kuliner',
  'Wisata',
  'Produk Unggulan',
];

export const potentials: Potential[] = [
  {
    id: '1',
    name: 'Padi Sawah Irigasi',
    category: 'Pertanian',
    description:
      'Lahan sawah irigasi seluas 120 hektar dengan produktivitas 6 ton/ha per musim panen.',
    location: 'Dusun Timur dan Dusun Selatan',
    image: 'https://images.pexels.com/photos/1684010/pexels-photo-1684010.jpeg',
  },
  {
    id: '2',
    name: 'Kebun Kakao',
    category: 'Perkebunan',
    description:
      'Kebun kakao seluas 45 hektar yang dikelola kelompok tani dengan kualitas ekspor.',
    location: 'Dusun Barat',
    image: 'https://images.pexels.com/photos/5966630/pexels-photo-5966630.jpeg',
  },
  {
    id: '3',
    name: 'Peternakan Sapi Potong',
    category: 'Peternakan',
    description:
      'Kelompok peternakan sapi potong dengan 85 ekor sapi, pemasok daging untuk kabupaten.',
    location: 'Dusun Utara',
    contact: '0812-4321-0098',
    image: 'https://images.pexels.com/photos/4731090/pexels-photo-4731090.jpeg',
  },
  {
    id: '4',
    name: 'Kopi Robusta Sukamaju',
    category: 'Produk Unggulan',
    description:
      'Kopi robusta single origin dengan cita rasa khas, dipasarkan hingga luar daerah.',
    location: 'Dusun Barat',
    contact: '0813-5567-8821',
    image: 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg',
  },
  {
    id: '5',
    name: 'Kerajinan Anyaman Bambu',
    category: 'Kerajinan',
    description:
      'Anyaman bambu berupa bakul, tampah, dan hiasan dinding yang diproduksi kelompok perempuan.',
    location: 'Dusun Tengah',
    contact: '0852-9912-3340',
    image: 'https://images.pexels.com/photos/36596582/pexels-photo-36596582.jpeg',
  },
  {
    id: '6',
    name: 'Coto Makassar Bu Nurdin',
    category: 'Kuliner',
    description:
      'Kuliner khas coto makassar yang telah berjualan sejak 1995, favorit warga dan pelawat.',
    location: 'Dusun Tengah',
    contact: '0812-4455-6677',
    image: 'https://images.pexels.com/photos/5409010/pexels-photo-5409010.jpeg',
  },
  {
    id: '7',
    name: 'Air Terjun Bontosomba',
    category: 'Wisata',
    description:
      'Destinasi wisata air terjun setinggi 18 meter dengan udara sejuk dan trekking ringan.',
    location: 'Dusun Barat',
    image: 'https://images.pexels.com/photos/261403/pexels-photo-261403.jpeg',
  },
  {
    id: '8',
    name: 'Hamparan Sawah Hijau',
    category: 'Wisata',
    description:
      'Spot agro-wisata dengan hamparan sawah hijau dan latar belakang perbukitan.',
    location: 'Dusun Timur',
    image: 'https://images.pexels.com/photos/158028/bellingrath-gardens-alabama-architecture-scenic-158028.jpeg',
  },
];
