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
    title: 'Identitas Desa',
    description: 'Informasi dasar desa yang tampil di seluruh halaman website.',
    fields: [
      { name: 'name', label: 'Nama Desa', type: 'text' },
      { name: 'district', label: 'Kecamatan', type: 'text' },
      { name: 'regency', label: 'Kabupaten', type: 'text' },
      { name: 'province', label: 'Provinsi', type: 'text' },
      { name: 'postalCode', label: 'Kode Pos', type: 'text' },
      { name: 'phone', label: 'Telepon', type: 'text' },
      { name: 'email', label: 'Email', type: 'email' },
      { name: 'hours', label: 'Jam Pelayanan', type: 'text' },
      { name: 'address', label: 'Alamat', type: 'textarea', rows: 2 },
      { name: 'description', label: 'Deskripsi Desa', type: 'textarea', rows: 3 },
      { name: 'logoUrl', label: 'URL Logo', type: 'url' },
      { name: 'headPhotoUrl', label: 'URL Foto Kepala Desa', type: 'url' },
    ],
  },
  {
    title: 'Koordinat Peta',
    description: 'Titik lokasi desa untuk peta kontak (format desimal).',
    fields: [
      { name: 'lat', label: 'Lintang (Latitude)', type: 'number' },
      { name: 'lng', label: 'Bujur (Longitude)', type: 'number' },
    ],
  },
  {
    title: 'Profil Desa',
    description: 'Sejarah, visi misi, batas wilayah, dan sambutan kepala desa.',
    fields: [
      { name: 'history', label: 'Sejarah Desa', type: 'textarea', rows: 5 },
      { name: 'vision', label: 'Visi Desa', type: 'textarea', rows: 3 },
      { name: 'missions', label: 'Misi Desa', type: 'lines', rows: 5, help: 'Satu butir misi per baris.' },
      { name: 'borderNorth', label: 'Batas Utara', type: 'text' },
      { name: 'borderSouth', label: 'Batas Selatan', type: 'text' },
      { name: 'borderEast', label: 'Batas Timur', type: 'text' },
      { name: 'borderWest', label: 'Batas Barat', type: 'text' },
      { name: 'headOfVillageName', label: 'Nama Kepala Desa', type: 'text' },
      { name: 'headOfVillagePosition', label: 'Jabatan', type: 'text' },
      { name: 'headOfVillagePeriod', label: 'Periode', type: 'text' },
      { name: 'headOfVillageGreeting', label: 'Sambutan Kepala Desa', type: 'textarea', rows: 4 },
    ],
  },
  {
    title: 'Situs & Media Sosial',
    description: 'Judul website, deskripsi SEO, tautan media sosial, dan catatan footer.',
    fields: [
      { name: 'siteName', label: 'Nama Situs', type: 'text' },
      { name: 'shortName', label: 'Nama Singkat', type: 'text' },
      { name: 'tagline', label: 'Tagline', type: 'text' },
      { name: 'siteDescription', label: 'Deskripsi Situs (SEO)', type: 'textarea', rows: 3 },
      { name: 'facebook', label: 'Facebook', type: 'url' },
      { name: 'instagram', label: 'Instagram', type: 'url' },
      { name: 'youtube', label: 'YouTube', type: 'url' },
      { name: 'ogImageUrl', label: 'URL Gambar Bagikan (OG)', type: 'url' },
      { name: 'footerNote', label: 'Catatan Footer', type: 'textarea', rows: 2 },
    ],
  },
];

const ALL_FIELDS: FieldDef[] = SECTIONS.flatMap((section) => section.fields);

interface Notice {
  kind: 'success' | 'error';
  text: string;
}

export function SettingsForm() {
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
        const res = await fetch('/api/admin/settings');
        const payload = await res.json();
        if (!active) return;
        if (!res.ok) throw new Error(payload.message || 'Gagal memuat pengaturan.');
        setValues(buildDefaults(ALL_FIELDS, payload.item ?? {}, EMPTY_META));
      } catch (error) {
        if (active) setFormError(error instanceof Error ? error.message : 'Gagal memuat pengaturan.');
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
      const res = await fetch('/api/admin/settings', {
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
      setNotice({ kind: 'success', text: 'Pengaturan berhasil disimpan.' });
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
        Memuat pengaturan...
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">Pengaturan Situs</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Identitas desa, profil, dan informasi yang tampil di seluruh halaman.
          </p>
        </div>
        <Button type="submit" disabled={saving}>
          {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          Simpan Pengaturan
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
          Simpan Pengaturan
        </Button>
      </div>
    </form>
  );
}
