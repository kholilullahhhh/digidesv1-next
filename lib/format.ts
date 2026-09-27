import { format, parseISO } from 'date-fns';
import { id as localeId } from 'date-fns/locale';

export function formatDate(dateStr: string): string {
  try {
    return format(parseISO(dateStr), 'd MMMM yyyy', { locale: localeId });
  } catch {
    return dateStr;
  }
}

export function formatDateShort(dateStr: string): string {
  try {
    return format(parseISO(dateStr), 'd MMM yyyy', { locale: localeId });
  } catch {
    return dateStr;
  }
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('id-ID').format(value);
}

const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

export function getDayOfMonth(dateStr: string): number {
  const parts = dateStr.split('-');
  return parseInt(parts[2], 10);
}

export function getMonthShort(dateStr: string): string {
  const parts = dateStr.split('-');
  const monthIdx = parseInt(parts[1], 10) - 1;
  return MONTHS_SHORT[monthIdx] ?? '';
}
