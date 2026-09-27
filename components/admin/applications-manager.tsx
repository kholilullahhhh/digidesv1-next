'use client';

import { useCallback, useEffect, useState } from 'react';
import { APPLICATION_STATUS_LABELS, APPLICATION_STATUS_ORDER } from '@/lib/labels';
import { formatDate } from '@/lib/format';
import { cn } from '@/lib/utils';
import { AlertCircle, CheckCircle2, Eye, Loader2, Search, Trash2 } from 'lucide-react';
import { ApplicationStatusBadge } from '@/components/admin/status-badge';
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
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

type Row = Record<string, any>;

const PAGE_SIZE = 10;

const STATUS_OPTIONS = APPLICATION_STATUS_ORDER.map((value) => ({
  value,
  label: APPLICATION_STATUS_LABELS[value] ?? value,
}));

const ALL_STATUSES = 'ALL';

interface Notice {
  kind: 'success' | 'error';
  text: string;
}

export function ApplicationsManager({ canDelete }: { canDelete: boolean }) {
  const [items, setItems] = useState<Row[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState(ALL_STATUSES);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [loadError, setLoadError] = useState('');

  const [detail, setDetail] = useState<Row | null>(null);
  const [nextStatus, setNextStatus] = useState('');
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  const [deleteTarget, setDeleteTarget] = useState<Row | null>(null);
  const [deleting, setDeleting] = useState(false);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), pageSize: String(PAGE_SIZE) });
      if (query) params.set('q', query);
      if (status !== ALL_STATUSES) params.set('status', status);
      const res = await fetch(`/api/admin/applications?${params.toString()}`);
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
  }, [page, query, status]);

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

  function openDetail(row: Row) {
    setDetail(row);
    setNextStatus(row.status);
    setNote('');
    setFormError('');
  }

  async function saveStatus() {
    if (!detail) return;
    setSaving(true);
    setFormError('');
    try {
      const res = await fetch(`/api/admin/applications/${detail.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus, note }),
      });
      const payload = await res.json();
      if (!res.ok) {
        setFormError(payload.message || 'Gagal memperbarui status.');
        return;
      }
      setDetail(null);
      setNotice({ kind: 'success', text: 'Status pengajuan berhasil diperbarui.' });
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
      const res = await fetch(`/api/admin/applications/${deleteTarget.id}`, { method: 'DELETE' });
      const payload = await res.json().catch(() => ({}));
      setDeleteTarget(null);
      if (!res.ok) {
        setNotice({ kind: 'error', text: payload.message || 'Data gagal dihapus.' });
        return;
      }
      setNotice({ kind: 'success', text: 'Pengajuan berhasil dihapus.' });
      await load();
    } catch {
      setNotice({ kind: 'error', text: 'Tidak dapat terhubung ke server.' });
    } finally {
      setDeleting(false);
    }
  }

  const from = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const to = Math.min(page * PAGE_SIZE, total);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Pengajuan Layanan</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Pantau dan perbarui status pengajuan layanan yang masuk dari masyarakat.
        </p>
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
                placeholder="Cari nomor / pemohon..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex items-center gap-3">
              <Select
                value={status}
                onValueChange={(value) => {
                  setStatus(value);
                  setPage(1);
                }}
              >
                <SelectTrigger className="w-[190px]">
                  <SelectValue placeholder="Semua Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL_STATUSES}>Semua Status</SelectItem>
                  {STATUS_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <CardDescription className="hidden md:block">
                {total > 0 ? `Menampilkan ${from}–${to} dari ${total} data` : 'Tidak ada data'}
              </CardDescription>
            </div>
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
                  <TableHead>Nomor</TableHead>
                  <TableHead>Pemohon</TableHead>
                  <TableHead>Layanan</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead className="w-[110px] text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="py-10 text-center">
                      <span className="inline-flex items-center gap-2 text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Memuat data...
                      </span>
                    </TableCell>
                  </TableRow>
                ) : items.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="py-10 text-center text-muted-foreground">
                      Belum ada pengajuan layanan.
                    </TableCell>
                  </TableRow>
                ) : (
                  items.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell className="font-medium">{row.trackingNumber}</TableCell>
                      <TableCell>{row.applicantName}</TableCell>
                      <TableCell>{row.serviceName}</TableCell>
                      <TableCell>
                        <ApplicationStatusBadge status={row.status} />
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDate(String(row.createdAt).slice(0, 10))}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label="Lihat detail"
                            onClick={() => openDetail(row)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {canDelete && (
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

      <Dialog open={Boolean(detail)} onOpenChange={(open) => !open && setDetail(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          {detail && (
            <>
              <DialogHeader>
                <DialogTitle>{detail.trackingNumber}</DialogTitle>
                <DialogDescription>
                  Detail pengajuan {detail.serviceName} oleh {detail.applicantName}.
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-3 rounded-md border p-4 text-sm sm:grid-cols-2">
                <div>
                  <p className="text-muted-foreground">Pemohon</p>
                  <p className="font-medium">{detail.applicantName}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">No. HP</p>
                  <p className="font-medium">{detail.phone}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Email</p>
                  <p className="font-medium">{detail.email}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Tanggal Pengajuan</p>
                  <p className="font-medium">{formatDate(String(detail.createdAt).slice(0, 10))}</p>
                </div>
                {detail.address && (
                  <div className="sm:col-span-2">
                    <p className="text-muted-foreground">Alamat</p>
                    <p className="font-medium">{detail.address}</p>
                  </div>
                )}
                {detail.notes && (
                  <div className="sm:col-span-2">
                    <p className="text-muted-foreground">Catatan</p>
                    <p className="font-medium">{detail.notes}</p>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-semibold">Riwayat Status</h3>
                <ol className="space-y-3 border-l pl-4">
                  {(detail.histories ?? []).map((history: any) => (
                    <li key={history.id} className="relative">
                      <span className="absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full bg-primary" />
                      <p className="text-sm font-medium">
                        {APPLICATION_STATUS_LABELS[history.status] ?? history.status}
                      </p>
                      {history.note && (
                        <p className="text-sm text-muted-foreground">{history.note}</p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        {formatDate(String(history.createdAt).slice(0, 10))} ·{' '}
                        {String(history.createdAt).slice(11, 16)}
                      </p>
                    </li>
                  ))}
                </ol>
              </div>

              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  saveStatus();
                }}
                className="space-y-4 border-t pt-4"
              >
                <h3 className="text-sm font-semibold">Ubah Status</h3>
                {formError && (
                  <div className="flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}
                <div className="space-y-2">
                  <Label>Status Baru</Label>
                  <Select value={nextStatus} onValueChange={setNextStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih status" />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUS_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="catatan">Catatan (opsional)</Label>
                  <Textarea
                    id="catatan"
                    rows={2}
                    value={note}
                    onChange={(event) => setNote(event.target.value)}
                    placeholder="Contoh: Berkas sudah lengkap."
                  />
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setDetail(null)}>
                    Tutup
                  </Button>
                  <Button type="submit" disabled={saving || nextStatus === detail.status}>
                    {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Simpan Status
                  </Button>
                </DialogFooter>
              </form>
            </>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus pengajuan ini?</AlertDialogTitle>
            <AlertDialogDescription>
              Riwayat pengajuan juga akan ikut terhapus dan tidak dapat dikembalikan.
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
