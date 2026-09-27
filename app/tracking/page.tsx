'use client';

import { useState } from 'react';
import { Search, FileText, CheckCircle2, Clock, AlertCircle, XCircle, Loader2 } from 'lucide-react';
import { PublicLayout } from '@/components/layout/public-layout';
import { PageHeader } from '@/components/layout/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/format';

interface TrackingResult {
  id: string;
  service: string;
  date: string;
  status: string;
  steps: { label: string; status: 'done' | 'current' | 'pending'; note?: string; date?: string }[];
}

const mockResults: Record<string, TrackingResult> = {
  'DSA-2026-000123': {
    id: 'DSA-2026-000123',
    service: 'Surat Keterangan Domisili',
    date: '2026-09-25',
    status: 'DIPROSES',
    steps: [
      { label: 'DIAJUKAN', status: 'done', date: '2026-09-25', note: 'Pengajuan diterima secara online.' },
      { label: 'DIVERIFIKASI', status: 'done', date: '2026-09-26', note: 'Dokumen terverifikasi oleh petugas.' },
      { label: 'DIPROSES', status: 'current', date: '2026-09-27', note: 'Surat sedang dalam proses pencetakan.' },
      { label: 'SELESAI', status: 'pending' },
    ],
  },
  'DSA-2026-000098': {
    id: 'DSA-2026-000098',
    service: 'Surat Pengantar Nikah',
    date: '2026-09-20',
    status: 'SELESAI',
    steps: [
      { label: 'DIAJUKAN', status: 'done', date: '2026-09-20', note: 'Pengajuan diterima.' },
      { label: 'DIVERIFIKASI', status: 'done', date: '2026-09-21', note: 'Dokumen terverifikasi.' },
      { label: 'DIPROSES', status: 'done', date: '2026-09-22', note: 'Surat diproses dan ditandatangani.' },
      { label: 'SELESAI', status: 'done', date: '2026-09-23', note: 'Surat siap diambil di kantor desa.' },
    ],
  },
};

const statusConfig: Record<string, { icon: typeof CheckCircle2; color: string; bg: string }> = {
  DIAJUKAN: { icon: FileText, color: 'text-blue-600', bg: 'bg-blue-100 text-blue-700 border-blue-200' },
  DIVERIFIKASI: { icon: CheckCircle2, color: 'text-cyan-600', bg: 'bg-cyan-100 text-cyan-700 border-cyan-200' },
  DIPROSES: { icon: Loader2, color: 'text-amber-600', bg: 'bg-amber-100 text-amber-700 border-amber-200' },
  SELESAI: { icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-100 text-green-700 border-green-200' },
  'PERLU PERBAIKAN': { icon: AlertCircle, color: 'text-orange-600', bg: 'bg-orange-100 text-orange-700 border-orange-200' },
  DITOLAK: { icon: XCircle, color: 'text-red-600', bg: 'bg-red-100 text-red-700 border-red-200' },
};

export default function TrackingPage() {
  const [trackingId, setTrackingId] = useState('');
  const [result, setResult] = useState<TrackingResult | null>(null);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      const found = mockResults[trackingId.trim().toUpperCase()];
      setResult(found || null);
      setSearched(true);
      setLoading(false);
    }, 600);
  };

  return (
    <PublicLayout>
      <PageHeader
        eyebrow="Lacak Pengajuan"
        title="Tracking Pengajuan Layanan"
        description="Masukkan nomor pengajuan untuk memantau status layanan Anda."
        breadcrumb={[{ label: 'Beranda', href: '/' }, { label: 'Tracking' }]}
      />

      <section className="py-12 lg:py-16">
        <div className="container-mx max-w-2xl">
          <form onSubmit={handleSearch} className="flex gap-3 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Contoh: DSA-2026-000123"
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button type="submit" disabled={loading || !trackingId}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Lacak'}
            </Button>
          </form>

          {/* Hint */}
          <div className="rounded-lg bg-muted p-4 mb-6 text-sm text-muted-foreground">
            <p className="font-medium text-foreground mb-1">Nomor pengajuan contoh:</p>
            <div className="flex flex-wrap gap-2">
              {Object.keys(mockResults).map((id) => (
                <button
                  key={id}
                  onClick={() => setTrackingId(id)}
                  className="rounded-md bg-background border px-2 py-1 text-xs font-mono hover:border-primary hover:text-primary transition-colors"
                >
                  {id}
                </button>
              ))}
            </div>
          </div>

          {/* Result */}
          {searched && !result && !loading && (
            <Card>
              <CardContent className="p-8 text-center">
                <AlertCircle className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                <p className="font-medium text-foreground">Pengajuan tidak ditemukan</p>
                <p className="text-sm text-muted-foreground mt-1">Periksa kembali nomor pengajuan Anda dan coba lagi.</p>
              </CardContent>
            </Card>
          )}

          {result && (
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-3 mb-6 pb-4 border-b">
                  <div>
                    <p className="text-xs text-muted-foreground">Nomor Pengajuan</p>
                    <p className="font-mono font-bold text-lg">{result.id}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{result.service}</p>
                    <p className="text-xs text-muted-foreground">Diajukan: {formatDate(result.date)}</p>
                  </div>
                  <Badge className={`border ${statusConfig[result.status]?.bg}`}>
                    {result.status}
                  </Badge>
                </div>

                {/* Timeline */}
                <div className="space-y-4">
                  {result.steps.map((step, i) => {
                    const config = statusConfig[step.label];
                    const Icon = config?.icon || Clock;
                    return (
                      <div key={i} className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <div className={`flex h-9 w-9 items-center justify-center rounded-full ${
                            step.status === 'done' ? 'bg-success text-white' :
                            step.status === 'current' ? 'bg-primary text-primary-foreground' :
                            'bg-muted text-muted-foreground'
                          }`}>
                            <Icon className={`h-4 w-4 ${step.status === 'current' ? 'animate-spin' : ''}`} />
                          </div>
                          {i < result.steps.length - 1 && (
                            <div className={`w-px h-8 ${step.status === 'done' ? 'bg-success' : 'bg-border'}`} />
                          )}
                        </div>
                        <div className="pt-1.5">
                          <p className={`font-medium text-sm ${step.status === 'pending' ? 'text-muted-foreground' : 'text-foreground'}`}>
                            {step.label}
                          </p>
                          {step.date && <p className="text-xs text-muted-foreground">{formatDate(step.date)}</p>}
                          {step.note && <p className="mt-1 text-sm text-muted-foreground">{step.note}</p>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </section>
    </PublicLayout>
  );
}
