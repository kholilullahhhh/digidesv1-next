export interface BudgetItem {
  label: string;
  value: number;
  color: string;
}

export interface BudgetYear {
  year: number;
  income: BudgetItem[];
  expenditure: BudgetItem[];
  totalIncome: number;
  totalExpenditure: number;
}

export const budgetYears: BudgetYear[] = [
  {
    year: 2026,
    income: [
      { label: 'Pendapatan Asli Desa', value: 125000000, color: 'hsl(var(--chart-1))' },
      { label: 'Dana Desa', value: 850000000, color: 'hsl(var(--chart-2))' },
      { label: 'Alokasi Dana Desa', value: 420000000, color: 'hsl(var(--chart-3))' },
      { label: 'Bantuan Provinsi', value: 180000000, color: 'hsl(var(--chart-4))' },
    ],
    expenditure: [
      { label: 'Bidang Pemerintahan', value: 285000000, color: 'hsl(var(--chart-1))' },
      { label: 'Bidang Pembangunan', value: 720000000, color: 'hsl(var(--chart-2))' },
      { label: 'Bidang Pemberdayaan', value: 310000000, color: 'hsl(var(--chart-3))' },
      { label: 'Bidang Kemasyarakatan', value: 260000000, color: 'hsl(var(--chart-4))' },
    ],
    totalIncome: 1575000000,
    totalExpenditure: 1575000000,
  },
  {
    year: 2025,
    income: [
      { label: 'Pendapatan Asli Desa', value: 108000000, color: 'hsl(var(--chart-1))' },
      { label: 'Dana Desa', value: 780000000, color: 'hsl(var(--chart-2))' },
      { label: 'Alokasi Dana Desa', value: 390000000, color: 'hsl(var(--chart-3))' },
      { label: 'Bantuan Provinsi', value: 165000000, color: 'hsl(var(--chart-4))' },
    ],
    expenditure: [
      { label: 'Bidang Pemerintahan', value: 260000000, color: 'hsl(var(--chart-1))' },
      { label: 'Bidang Pembangunan', value: 660000000, color: 'hsl(var(--chart-2))' },
      { label: 'Bidang Pemberdayaan', value: 285000000, color: 'hsl(var(--chart-3))' },
      { label: 'Bidang Kemasyarakatan', value: 238000000, color: 'hsl(var(--chart-4))' },
    ],
    totalIncome: 1443000000,
    totalExpenditure: 1443000000,
  },
  {
    year: 2024,
    income: [
      { label: 'Pendapatan Asli Desa', value: 95000000, color: 'hsl(var(--chart-1))' },
      { label: 'Dana Desa', value: 720000000, color: 'hsl(var(--chart-2))' },
      { label: 'Alokasi Dana Desa', value: 360000000, color: 'hsl(var(--chart-3))' },
      { label: 'Bantuan Provinsi', value: 150000000, color: 'hsl(var(--chart-4))' },
    ],
    expenditure: [
      { label: 'Bidang Pemerintahan', value: 240000000, color: 'hsl(var(--chart-1))' },
      { label: 'Bidang Pembangunan', value: 610000000, color: 'hsl(var(--chart-2))' },
      { label: 'Bidang Pemberdayaan', value: 265000000, color: 'hsl(var(--chart-3))' },
      { label: 'Bidang Kemasyarakatan', value: 210000000, color: 'hsl(var(--chart-4))' },
    ],
    totalIncome: 1325000000,
    totalExpenditure: 1325000000,
  },
];

export interface DevelopmentProject {
  id: string;
  name: string;
  location: string;
  year: number;
  budget: number;
  source: string;
  progress: number;
  status: 'PERENCANAAN' | 'BERJALAN' | 'SELESAI';
}

export const developmentProjects: DevelopmentProject[] = [
  {
    id: '1',
    name: 'Pembangunan Saluran Irigasi Dusun Timur',
    location: 'Dusun Timur',
    year: 2026,
    budget: 285000000,
    source: 'Dana Desa',
    progress: 35,
    status: 'BERJALAN',
  },
  {
    id: '2',
    name: 'Pengerasan Jalan Dusun Barat',
    location: 'Dusun Barat',
    year: 2026,
    budget: 420000000,
    source: 'Alokasi Dana Desa',
    progress: 0,
    status: 'PERENCANAAN',
  },
  {
    id: '3',
    name: 'Renovasi Balai Desa',
    location: 'Dusun Tengah',
    year: 2026,
    budget: 175000000,
    source: 'Dana Desa',
    progress: 60,
    status: 'BERJALAN',
  },
  {
    id: '4',
    name: 'Pengadaan Pompa Air Bersih',
    location: 'Dusun Selatan',
    year: 2025,
    budget: 95000000,
    source: 'Dana Desa',
    progress: 100,
    status: 'SELESAI',
  },
  {
    id: '5',
    name: 'Pembangunan Pos Kamling Dusun Utara',
    location: 'Dusun Utara',
    year: 2025,
    budget: 45000000,
    source: 'APBD Provinsi',
    progress: 100,
    status: 'SELESAI',
  },
  {
    id: '6',
    name: 'Peningkatan Sarana Posyandu',
    location: 'Seluruh Dusun',
    year: 2025,
    budget: 120000000,
    source: 'Alokasi Dana Desa',
    progress: 100,
    status: 'SELESAI',
  },
];
