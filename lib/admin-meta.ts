import { prisma } from '@/lib/db';
import { OFFICIAL_CATEGORIES } from '@/lib/labels';
import { SERVICE_ICON_NAMES } from '@/lib/service-icons';

export interface SelectOption {
  value: string;
  label: string;
}

export interface AdminMeta {
  newsCategories: SelectOption[];
  serviceIcons: SelectOption[];
  officialCategories: SelectOption[];
  eventStatuses: SelectOption[];
  projectStatuses: SelectOption[];
}

export const EVENT_STATUS_OPTIONS: SelectOption[] = [
  { value: 'SCHEDULED', label: 'Terjadwal' },
  { value: 'ONGOING', label: 'Berlangsung' },
  { value: 'DONE', label: 'Selesai' },
  { value: 'CANCELLED', label: 'Dibatalkan' },
];

export const PROJECT_STATUS_OPTIONS: SelectOption[] = [
  { value: 'PLANNING', label: 'Perencanaan' },
  { value: 'IN_PROGRESS', label: 'Berjalan' },
  { value: 'COMPLETED', label: 'Selesai' },
];

/** Opsi select untuk form admin (dari database, aman dipanggil saat build). */
export async function getAdminMeta(): Promise<AdminMeta> {
  let newsCategories: SelectOption[] = [];
  try {
    const categories = await prisma.newsCategory.findMany({ orderBy: { order: 'asc' } });
    newsCategories = categories.map((category) => ({ value: category.id, label: category.name }));
  } catch {
    newsCategories = [];
  }

  return {
    newsCategories,
    serviceIcons: SERVICE_ICON_NAMES.map((name) => ({ value: name, label: name })),
    officialCategories: OFFICIAL_CATEGORIES,
    eventStatuses: EVENT_STATUS_OPTIONS,
    projectStatuses: PROJECT_STATUS_OPTIONS,
  };
}
