export interface VillageStats {
  population: number;
  malePopulation: number;
  femalePopulation: number;
  families: number;
  dusun: number;
  rt: number;
  rw: number;
  area: number; // km²
  density: number; // per km²
  villages: string[];
}

export const villageStats: VillageStats = {
  population: 4827,
  malePopulation: 2413,
  femalePopulation: 2414,
  families: 1284,
  dusun: 5,
  rt: 12,
  rw: 5,
  area: 8.74,
  density: 552,
  villages: ['Dusun Tengah', 'Dusun Utara', 'Dusun Selatan', 'Dusun Timur', 'Dusun Barat'],
};

export interface AgeGroup {
  range: string;
  total: number;
  male: number;
  female: number;
}

export const ageGroups: AgeGroup[] = [
  { range: '0–14', total: 1012, male: 521, female: 491 },
  { range: '15–29', total: 1284, male: 642, female: 642 },
  { range: '30–44', total: 1123, male: 558, female: 565 },
  { range: '45–59', total: 894, male: 448, female: 446 },
  { range: '60+', total: 514, male: 244, female: 270 },
];

export interface EducationLevel {
  level: string;
  total: number;
}

export const educationLevels: EducationLevel[] = [
  { level: 'Tidak/Belum Sekolah', total: 487 },
  { level: 'SD/Sederajat', total: 1643 },
  { level: 'SMP/Sederajat', total: 1124 },
  { level: 'SMA/Sederajat', total: 982 },
  { level: 'Diploma', total: 341 },
  { level: 'Sarjana', total: 250 },
];

export interface JobCategory {
  category: string;
  total: number;
}

export const jobCategories: JobCategory[] = [
  { category: 'Petani', total: 1487 },
  { category: 'Buruh Harian', total: 642 },
  { category: 'Wiraswasta', total: 524 },
  { category: 'Pelajar/Mahasiswa', total: 984 },
  { category: 'IRT', total: 612 },
  { category: 'PNS/TNI/Polri', total: 87 },
  { category: 'Lainnya', total: 491 },
];
