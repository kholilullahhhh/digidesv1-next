'use client';

import { useCallback, useEffect, useState } from 'react';
import type { AdminMeta } from '@/lib/admin-meta';
import { ADMIN_RESOURCES, type ColumnDef, type ResourceKey } from '@/lib/admin-resources';
import { buildDefaults, buildPayload } from '@/lib/admin-form';
import {
  EVENT_STATUS_LABELS,
  MESSAGE_STATUS_LABELS,
  NEWS_STATUS_LABELS,
  PROJECT_STATUS_LABELS,
  ROLE_LABELS,
} from '@/lib/labels';
import { formatCurrency, formatDate, formatNumber } from '@/lib/format';
import { cn } from '@/lib/utils';
import { AlertCircle, CheckCircle2, Loader2, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { FieldInput } from '@/components/admin/field-input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export type ResourceMeta = AdminMeta;

type Row = Record<string, any>;
type Values = Record<string, any>;

const PAGE_SIZE = 10;


function badgeLabel(kind: ColumnDef['badgeKind'], value: unknown): string {
  const key = String(value ?? '');
  const map =
    kind === 'newsStatus'
      ? NEWS_STATUS_LABELS
      : kind === 'projectStatus'
        ? PROJECT_STATUS_LABELS
        : kind === 'eventStatus'
          ? EVENT_STATUS_LABELS
          : kind === 'role'
            ? ROLE_LABELS
            : kind === 'messageStatus'
              ? MESSAGE_STATUS_LABELS
              : {};
  return map[key] ?? key;
}

interface Notice {
  kind: 'success' | 'error';
  text: string;
}

export function ResourceManager({
  resourceKey,
  meta,
}: {
  resourceKey: ResourceKey;
  meta: ResourceMeta;
}) {
  const def = ADMIN_RESOURCES[resourceKey];

  const [items, setItems] = useState<Row[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [loadError, setLoadError] = useState('');

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Row | null>(null);
  const [values, setValues] = useState<Values>({});
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<Row | null>(null);
  const [deleting, setDeleting] = useState(false);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        pageSize: String(PAGE_SIZE),
      });
      if (query) params.set('q', query);
      const res = await fetch(`/api/admin/${resourceKey}?${params.toString()}`);
      const payload = await res.json();
      if (!res.ok) throw new Error(payload.message || 'Gagal memuat data.');
      setItems(payload.items ?? []);
      setTotal(payload.total ?? 0);
      setLoadError('');
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : 'Gagal memuat data.');
    } finally {
      setLoading(false);
    }
  }, [page, query, resourceKey]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setQuery(search.trim());
      setPage(1);
    }, 350);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(null), 4000);
    return () => clearTimeout(timer);
  }, [notice]);

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get('new') !== '1') return;
    setEditing(null);
    setValues(buildDefaults(def.fields, null, meta));
    setFieldErrors({});
    setFormError('');
    setFormOpen(true);
    window.history.replaceState(null, '', window.location.pathname);
  }, [def, meta]);

  function openCreate() {
    const defaults = buildDefaults(def.fields, null, meta);
    setEditing(null);
    setValues(defaults);
    setFieldErrors({});
    setFormError('');
    setFormOpen(true);
  }

  function openEdit(row: Row) {
    const defaults = buildDefaults(def.fields, row, meta);
    setEditing(row);
    setValues(defaults);
    setFieldErrors({});
    setFormError('');
    setFormOpen(true);
  }

  async function submitForm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setFormError('');
    setFieldErrors({});
    try {
      const body = buildPayload(def.fields, values);
      const url = editing ? `/api/admin/${resourceKey}/${editing.id}` : `/api/admin/${resourceKey}`;
      const res = await fetch(url, {
        method: editing ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const payload = await res.json();
      if (!res.ok) {
        setFieldErrors(payload.errors ?? {});
        setFormError(payload.message || 'Data belum valid, periksa isian form.');
        return;
      }
      setFormOpen(false);
      setNotice({ kind: 'success', text: `Data berhasil ${editing ? 'diperbarui' : 'ditambahkan'}.` });
      await load();
    } catch {
      setFormError('Tidak dapat terhubung ke server, coba lagi.');
    } finally {
      setSaving(false);
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/${resourceKey}/${deleteTarget.id}`, { method: 'DELETE' });
      const payload = await res.json().catch(() => ({}));
      if (!res.ok) {
        setNotice({ kind: 'error', text: payload.message || 'Data gagal dihapus.' });
        setDeleteTarget(null);
        return;
      }
      setDeleteTarget(null);
      setNotice({ kind: 'success', text: 'Data berhasil dihapus.' });
      await load();
    } catch {
      setNotice({ kind: 'error', text: 'Tidak dapat terhubung ke server.' });
    } finally {
      setDeleting(false);
    }
  }

  function renderCell(column: ColumnDef, row: Row) {
    const value = row[column.key];
    switch (column.type) {
      case 'date':
        return formatDate(String(value ?? '').slice(0, 10));
      case 'currency':
        return formatCurrency(Number(value ?? 0));
      case 'number':
        return formatNumber(Number(value ?? 0));
      case 'boolean':
        return value ? 'Ya' : 'Tidak';
      case 'badge':
        return <Badge variant="secondary">{badgeLabel(column.badgeKind, value)}</Badge>;
      default:
        return <span className="line-clamp-2">{String(value ?? '-')}</span>;
    }
  }

  const from = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const to = Math.min(page * PAGE_SIZE, total);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">{def.title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{def.description}</p>
        </div>
        {def.canCreate && (
          <Button onClick={openCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Tambah {def.singular}
          </Button>
        )}
      </div>

      {notice && (
        <div
          className={cn(
            'flex items-start gap-2 rounded-md border p-3 text-sm',
            notice.kind === 'success'
              ? 'border-emerald-600/30 bg-emerald-600/10 text-emerald-700 dark:text-emerald-300'
              : 'border-destructive/30 bg-destructive/10 text-destructive',
          )}
        >
          {notice.kind === 'success' ? (
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
          ) : (
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          )}
          <span>{notice.text}</span>
        </div>
      )}

      <Card>
        <CardHeader className="gap-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={`Cari ${def.title.toLowerCase()}...`}
                aria-label={`Cari ${def.title}`}
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="pl-9"
              />
            </div>
            <CardDescription>
              {total > 0 ? `Menampilkan ${from}–${to} dari ${total} data` : 'Tidak ada data'}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          {loadError && (
            <div className="mb-4 flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{loadError}</span>
            </div>
          )}

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {def.columns.map((column) => (
                    <TableHead key={column.key}>{column.label}</TableHead>
                  ))}
                  <TableHead className="w-[110px] text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={def.columns.length + 1} className="py-10 text-center">
                      <span className="inline-flex items-center gap-2 text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Memuat data...
                      </span>
                    </TableCell>
                  </TableRow>
                ) : items.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={def.columns.length + 1} className="py-10 text-center text-muted-foreground">
                      {def.emptyMessage}
                    </TableCell>
                  </TableRow>
                ) : (
                  items.map((row) => (
                    <TableRow key={row.id}>
                      {def.columns.map((column) => (
                        <TableCell key={column.key}>{renderCell(column, row)}</TableCell>
                      ))}
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          {def.canEdit && (
                            <Button
                              variant="ghost"
                              size="icon"
                              aria-label="Ubah"
                              onClick={() => openEdit(row)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                          )}
                          {def.canDelete && (
                            <Button
                              variant="ghost"
                              size="icon"
                              aria-label="Hapus"
                              className="text-destructive hover:text-destructive"
                              onClick={() => setDeleteTarget(row)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {totalPages > 1 && (
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-muted-foreground">
                Halaman {page} dari {totalPages}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1 || loading}
                  onClick={() => setPage((value) => Math.max(1, value - 1))}
                >
                  Sebelumnya
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages || loading}
                  onClick={() => setPage((value) => value + 1)}
                >
                  Berikutnya
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editing ? `Ubah ${def.singular}` : `Tambah ${def.singular}`}
            </DialogTitle>
            <DialogDescription>
              {editing
                ? 'Perubahan akan langsung tersimpan dan tampil di website.'
                : 'Isi data di bawah ini untuk menambahkan konten baru.'}
            </DialogDescription>
          </DialogHeader>

          {editing && resourceKey === 'messages' && (
            <div className="space-y-1 rounded-md border bg-muted/40 p-4 text-sm">
              <p className="font-medium">{editing.subject}</p>
              <p className="text-muted-foreground">
                Dari {editing.name} &lt;{editing.email}&gt; · {editing.phone}
              </p>
              <p className="text-muted-foreground">{formatDate(String(editing.createdAt).slice(0, 10))}</p>
              <p className="mt-2 whitespace-pre-wrap text-foreground">{editing.message}</p>
            </div>
          )}

          <form onSubmit={submitForm} className="space-y-4">
            {formError && (
              <div className="flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              {def.fields.map((field) => (
                <FieldInput
                  key={field.name}
                  field={field}
                  meta={meta}
                  value={values[field.name]}
                  error={fieldErrors[field.name]?.[0]}
                  onChange={(value) => setValues((current) => ({ ...current, [field.name]: value }))}
                />
              ))}
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setFormOpen(false)}>
                Batal
              </Button>
              <Button type="submit" disabled={saving}>
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Simpan
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={Boolean(deleteTarget)} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus data ini?</AlertDialogTitle>
            <AlertDialogDescription>
              Data yang dihapus tidak dapat dikembalikan. Pastikan data ini sudah tidak
              diperlukan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Batal</AlertDialogCancel>
            <AlertDialogAction
              disabled={deleting}
              className="bg-destructive text-white hover:bg-destructive/90"
              onClick={(event) => {
                event.preventDefault();
                confirmDelete();
              }}
            >
              {deleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
