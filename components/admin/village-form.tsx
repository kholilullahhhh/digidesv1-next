'use client';

import { useEffect, useState } from 'react';
import type { FieldDef } from '@/lib/admin-resources';
import { buildDefaults, buildPayload } from '@/lib/admin-form';
import type { AdminMeta } from '@/lib/admin-meta';
import { AlertCircle, CheckCircle2, Loader2, Save } from 'lucide-react';
import { FieldInput } from '@/components/admin/field-input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const EMPTY_META: AdminMeta = {
  newsCategories: [],
  serviceIcons: [],
  officialCategories: [],
  eventStatuses: [],
  projectStatuses: [],
};

const SECTIONS: { title: string; description: string; fields: FieldDef[] }[] = [
  {
    title: 'Kependudukan',
    description: 'Jumlah penduduk, keluarga, dan wilayah administrasi desa.',
    fields: [
      { name: 'population', label: 'Jumlah Penduduk', type: 'number' },
      { name: 'malePopulation', label: 'Laki-laki', type: 'number' },
      { name: 'femalePopulation', label: 'Perempuan', type: 'number' },
      { name: 'families', label: 'Jumlah KK', type: 'number' },
      { name: 'dusun', label: 'Jumlah Dusun', type: 'number' },
      { name: 'rt', label: 'Jumlah RT', type: 'number' },
      { name: 'rw', label: 'Jumlah RW', type: 'number' },
      { name: 'area', label: 'Luas Wilayah (km²)', type: 'number' },
      { name: 'density', label: 'Kepadatan (jiwa/km²)', type: 'number' },
      { name: 'dusunNames', label: 'Nama Dusun', type: 'lines', rows: 4, help: 'Satu nama dusun per baris.' },
    ],
  },
  {
    title: 'Kelompok Umur',
    description: 'Sebaran penduduk menurut kelompok umur.',
    fields: [
      {
        name: 'ageGroups',
        label: 'Kelompok Umur',
        type: 'table',
        columns: [
          { key: 'range', label: 'Rentang', type: 'text' },
          { key: 'total', label: 'Total', type: 'number' },
          { key: 'male', label: 'Laki-laki', type: 'number' },
          { key: 'female', label: 'Perempuan', type: 'number' },
        ],
      },
    ],
  },
  {
    title: 'Pendidikan & Mata Pencaharian',
    description: 'Tingkat pendidikan dan pekerjaan penduduk desa.',
    fields: [
      {
        name: 'educationLevels',
        label: 'Tingkat Pendidikan',
        type: 'table',
        columns: [
          { key: 'level', label: 'Tingkat', type: 'text' },
          { key: 'total', label: 'Jumlah', type: 'number' },
        ],
      },
      {
        name: 'jobCategories',
        label: 'Mata Pencaharian',
        type: 'table',
        columns: [
          { key: 'category', label: 'Kategori', type: 'text' },
          { key: 'total', label: 'Jumlah', type: 'number' },
        ],
      },
    ],
  },
];

const ALL_FIELDS: FieldDef[] = SECTIONS.flatMap((section) => section.fields);

interface Notice {
  kind: 'success' | 'error';
  text: string;
}

export function VillageForm() {
  const [values, setValues] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [formError, setFormError] = useState('');
  const [notice, setNotice] = useState<Notice | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch('/api/admin/village');
        const payload = await res.json();
        if (!active) return;
        if (!res.ok) throw new Error(payload.message || 'Gagal memuat data.');
        setValues(buildDefaults(ALL_FIELDS, payload.item ?? {}, EMPTY_META));
      } catch (error) {
        if (active) setFormError(error instanceof Error ? error.message : 'Gagal memuat data.');
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(null), 4000);
    return () => clearTimeout(timer);
  }, [notice]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setFormError('');
    setFieldErrors({});
    try {
      const res = await fetch('/api/admin/village', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(buildPayload(ALL_FIELDS, values)),
      });
      const payload = await res.json();
      if (!res.ok) {
        setFieldErrors(payload.errors ?? {});
        setFormError(payload.message || 'Data belum valid, periksa isian form.');
        return;
      }
      setNotice({ kind: 'success', text: 'Data desa berhasil disimpan.' });
    } catch {
      setFormError('Tidak dapat terhubung ke server, coba lagi.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        Memuat data desa...
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">Data Desa</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Angka kependudukan yang tampil di halaman Data Desa dan Profil Desa.
          </p>
        </div>
        <Button type="submit" disabled={saving}>
          {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          Simpan Data
        </Button>
      </div>

      {notice && (
        <div
          className={
            notice.kind === 'success'
              ? 'flex items-start gap-2 rounded-md border border-emerald-600/30 bg-emerald-600/10 p-3 text-sm text-emerald-700 dark:text-emerald-300'
              : 'flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive'
          }
        >
          {notice.kind === 'success' ? (
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
          ) : (
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          )}
          <span>{notice.text}</span>
        </div>
      )}

      {formError && (
        <div className="flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{formError}</span>
        </div>
      )}

      {SECTIONS.map((section) => (
        <Card key={section.title}>
          <CardHeader>
            <CardTitle className="text-base">{section.title}</CardTitle>
            <CardDescription>{section.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              {section.fields.map((field) => (
                <FieldInput
                  key={field.name}
                  field={field}
                  meta={EMPTY_META}
                  value={values[field.name]}
                  error={fieldErrors[field.name]?.[0]}
                  onChange={(value) =>
                    setValues((current) => ({ ...current, [field.name]: value }))
                  }
                />
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      <div className="flex justify-end">
        <Button type="submit" disabled={saving}>
          {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          Simpan Data
        </Button>
      </div>
    </form>
  );
}
