export interface VillageOfficial {
  id: string;
  name: string;
  position: string;
  category: 'kepala_desa' | 'sekretariat' | 'kaur' | 'kasi' | 'kadus';
  photo: string;
  nip?: string;
  phone?: string;
  order: number;
}

export const villageOfficials: VillageOfficial[] = [
  {
    id: '1',
    name: 'H. Muh. Yusuf Kara, S.Sos',
    position: 'Kepala Desa',
    category: 'kepala_desa',
    photo: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
    nip: '—',
    phone: '(0411) 555-0192',
    order: 1,
  },
  {
    id: '2',
    name: 'Siti Aisyah Rahman, S.E',
    position: 'Sekretaris Desa',
    category: 'sekretariat',
    photo: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg',
    nip: '—',
    phone: '(0411) 555-0193',
    order: 2,
  },
  {
    id: '3',
    name: 'Abd. Rahman, S.Pd',
    position: 'Kepala Urusan Tata Usaha dan Umum',
    category: 'kaur',
    photo: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg',
    order: 3,
  },
  {
    id: '4',
    name: 'Rahmawati Saleh, S.Ak',
    position: 'Kepala Urusan Keuangan',
    category: 'kaur',
    photo: 'https://images.pexels.com/photos/3760263/pexels-photo-3760263.jpeg',
    order: 4,
  },
  {
    id: '5',
    name: 'Muh. Fadli Akbar',
    position: 'Kepala Urusan Perencanaan',
    category: 'kaur',
    photo: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg',
    order: 5,
  },
  {
    id: '6',
    name: 'Andi Baso Tadda, S.Sos',
    position: 'Kepala Seksi Pemerintahan',
    category: 'kasi',
    photo: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg',
    order: 6,
  },
  {
    id: '7',
    name: 'Nurhaeda, S.Pd',
    position: 'Kepala Seksi Kesejahteraan Rakyat',
    category: 'kasi',
    photo: 'https://images.pexels.com/photos/3777943/pexels-photo-3777943.jpeg',
    order: 7,
  },
  {
    id: '8',
    name: 'Sulaeman, S.T',
    position: 'Kepala Seksi Pelayanan',
    category: 'kasi',
    photo: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg',
    order: 8,
  },
  {
    id: '9',
    name: 'Rusmin Tang',
    position: 'Kepala Dusun Tengah',
    category: 'kadus',
    photo: 'https://images.pexels.com/photos/1300402/pexels-photo-1300402.jpeg',
    order: 9,
  },
  {
    id: '10',
    name: 'A. Mappanyompu',
    position: 'Kepala Dusun Utara',
    category: 'kadus',
    photo: 'https://images.pexels.com/photos/1462637/pexels-photo-1462637.jpeg',
    order: 10,
  },
  {
    id: '11',
    name: 'Muh. Ridwan',
    position: 'Kepala Dusun Selatan',
    category: 'kadus',
    photo: 'https://images.pexels.com/photos/1024311/pexels-photo-1024311.jpeg',
    order: 11,
  },
  {
    id: '12',
    name: 'Ardiansyah, S.E',
    position: 'Kepala Dusun Timur',
    category: 'kadus',
    photo: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg',
    order: 12,
  },
  {
    id: '13',
    name: 'Hasrul Mappa',
    position: 'Kepala Dusun Barat',
    category: 'kadus',
    photo: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg',
    order: 13,
  },
];

export const officialCategories = [
  { value: 'kepala_desa', label: 'Kepala Desa' },
  { value: 'sekretariat', label: 'Sekretariat' },
  { value: 'kaur', label: 'Kepala Urusan' },
  { value: 'kasi', label: 'Kepala Seksi' },
  { value: 'kadus', label: 'Kepala Dusun' },
];
