export const APPLICATION_STATUS_LABELS: Record<string, string> = {
  SUBMITTED: 'DIAJUKAN',
  VERIFIED: 'DIVERIFIKASI',
  PROCESSING: 'DIPROSES',
  REVISION: 'PERLU PERBAIKAN',
  COMPLETED: 'SELESAI',
  REJECTED: 'DITOLAK',
};

export const APPLICATION_STATUS_ORDER = [
  'SUBMITTED',
  'VERIFIED',
  'PROCESSING',
  'REVISION',
  'COMPLETED',
  'REJECTED',
] as const;

export const PROJECT_STATUS_LABELS: Record<string, string> = {
  PLANNING: 'PERENCANAAN',
  IN_PROGRESS: 'BERJALAN',
  COMPLETED: 'SELESAI',
};

export const OFFICIAL_CATEGORIES = [
  { value: 'HEAD', label: 'Kepala Desa' },
  { value: 'SECRETARY', label: 'Sekretariat' },
  { value: 'KAUR', label: 'Kepala Urusan' },
  { value: 'KASI', label: 'Kepala Seksi' },
  { value: 'KADUS', label: 'Kepala Dusun' },
];

export const NEWS_STATUS_LABELS: Record<string, string> = {
  DRAFT: 'Draf',
  PUBLISHED: 'Terbit',
};

export const EVENT_STATUS_LABELS: Record<string, string> = {
  SCHEDULED: 'Terjadwal',
  ONGOING: 'Berlangsung',
  DONE: 'Selesai',
  CANCELLED: 'Dibatalkan',
};

export const ROLE_LABELS: Record<string, string> = {
  ADMIN: 'Admin',
  STAFF: 'Petugas',
};

export const MESSAGE_STATUS_LABELS: Record<string, string> = {
  UNREAD: 'Belum Dibaca',
  READ: 'Sudah Dibaca',
};
