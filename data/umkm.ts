export interface UMKM {
  id: string;
  name: string;
  owner: string;
  category: string;
  product: string;
  location: string;
  contact: string;
  image: string;
  description: string;
}

export const umkmCategories = [
  'Kuliner',
  'Kerajinan',
  'Pertanian',
  'Perdagangan',
  'Jasa',
];

export const umkms: UMKM[] = [
  {
    id: '1',
    name: 'Kopi Sukamaju',
    owner: 'Muh. Fadli Akbar',
    category: 'Pertanian',
    product: 'Biji kopi robusta olahan',
    location: 'Dusun Barat',
    contact: '0813-5567-8821',
    image: 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg',
    description:
      'Produsen kopi robusta single origin dengan pengolahan pasca panen modern.',
  },
  {
    id: '2',
    name: 'Anyaman Bambu Lestari',
    owner: 'Hj. Andi Tenri',
    category: 'Kerajinan',
    product: 'Bakul, tampah, hiasan dinding',
    location: 'Dusun Tengah',
    contact: '0852-9912-3340',
    image: 'https://images.pexels.com/photos/6103/people.jpg',
    description:
      'Kelompok perajin anyaman bambu yang memanfaatkan bambu lokal menjadi produk bernilai.',
  },
  {
    id: '3',
    name: 'Coto Bu Nurdin',
    owner: 'Nurdin Halid',
    category: 'Kuliner',
    product: 'Coto Makassar',
    location: 'Dusun Tengah',
    contact: '0812-4455-6677',
    image: 'https://images.pexels.com/photos/5409010/pexels-photo-5409010.jpeg',
    description:
      'Warung coto makassar legendaris sejak 1995, favorit warga dan pelawat.',
  },
  {
    id: '4',
    name: 'Toko Sembako Berkah',
    owner: 'Rahmawati Saleh',
    category: 'Perdagangan',
    product: 'Sembako dan kebutuhan harian',
    location: 'Dusun Utara',
    contact: '0811-2233-4455',
    image: 'https://images.pexels.com/photos/264537/pexels-photo-264537.jpeg',
    description:
      'Toko sembako yang menyediakan kebutuhan pokok warga dengan harga terjangkau.',
  },
  {
    id: '5',
    name: 'Pupuk Organik Lestari',
    owner: 'Sulaeman Tang',
    category: 'Pertanian',
    product: 'Pupuk organik cair',
    location: 'Dusun Timur',
    contact: '0821-9988-7766',
    image: 'https://images.pexels.com/photos/2284166/pexels-photo-2284166.jpeg',
    description:
      'Produsen pupuk organik cair dari limbah peternakan untuk pertanian ramah lingkungan.',
  },
  {
    id: '6',
    name: 'Pangkas Rambut Barokah',
    owner: 'Ardiansyah',
    category: 'Jasa',
    product: 'Pangkas rambut',
    location: 'Dusun Timur',
    contact: '0853-1122-3344',
    image: 'https://images.pexels.com/photos/1813272/pexels-photo-1813272.jpeg',
    description:
      'Pangkas rambut dengan layanan ramah dan harga terjangkau untuk warga desa.',
  },
];
