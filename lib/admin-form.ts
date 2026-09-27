import type { FieldDef } from '@/lib/admin-resources';
import type { AdminMeta, SelectOption } from '@/lib/admin-meta';

export type FormValues = Record<string, any>;

export function today(): string {
  return new Date().toISOString().slice(0, 10);
}

export function optionsFor(field: FieldDef, meta: AdminMeta | null): SelectOption[] {
  if (field.options) return field.options;
  if (field.optionsFrom && meta) {
    return (meta as unknown as Record<string, SelectOption[]>)[field.optionsFrom] ?? [];
  }
  return [];
}

export function initialFor(field: FieldDef, item: FormValues | null, meta: AdminMeta | null): any {
  const existing = item ? item[field.name] : undefined;
  if (item) {
    switch (field.type) {
      case 'date':
        return typeof existing === 'string' ? existing.slice(0, 10) : today();
      case 'lines':
        return Array.isArray(existing) ? existing.join('\n') : '';
      case 'table':
        return Array.isArray(existing) ? existing : [];
      case 'checkbox':
        return Boolean(existing);
      case 'number':
        return existing ?? 0;
      default:
        return existing ?? '';
    }
  }
  switch (field.type) {
    case 'number':
      return field.name === 'year' ? new Date().getFullYear() : 0;
    case 'checkbox':
      return false;
    case 'table':
      return [{ label: '', value: 0, color: '' }];
    case 'date':
      return today();
    case 'select':
      return optionsFor(field, meta)[0]?.value ?? '';
    default:
      return '';
  }
}

export function toPayload(field: FieldDef, value: any): any {
  if (field.type === 'lines') {
    return String(value ?? '')
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);
  }
  if (field.type === 'table') {
    const columns = field.columns ?? [];
    return (Array.isArray(value) ? value : []).map((row: any) => {
      const out: FormValues = {};
      for (const column of columns) {
        out[column.key] =
          column.type === 'number' ? Number(row?.[column.key] ?? 0) : String(row?.[column.key] ?? '');
      }
      return out;
    });
  }
  if (field.type === 'number') return Number(value ?? 0);
  if (field.type === 'checkbox') return Boolean(value);
  return value;
}

export function buildDefaults(
  fields: FieldDef[],
  item: FormValues | null,
  meta: AdminMeta | null,
): FormValues {
  const values: FormValues = {};
  for (const field of fields) values[field.name] = initialFor(field, item, meta);
  return values;
}

export function buildPayload(fields: FieldDef[], values: FormValues): FormValues {
  const payload: FormValues = {};
  for (const field of fields) payload[field.name] = toPayload(field, values[field.name]);
  return payload;
}
