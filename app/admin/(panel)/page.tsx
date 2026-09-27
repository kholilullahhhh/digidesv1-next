import Link from 'next/link';
import { format, startOfDay, subDays } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import {
  Activity,
  CheckCircle2,
  ChevronRight,
  Clock3,
  ExternalLink,
  FileStack,
  Files,
  Inbox,
  Loader2,
  Megaphone,
  Newspaper,
  Store,
  XCircle,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ApplicationsChart, type SeriesPoint } from '@/components/admin/applications-chart';
import { ApplicationStatusBadge } from '@/components/admin/status-badge';
import { RelativeTime } from '@/components/admin/relative-time';
import { APPLICATION_STATUS_ORDER, MESSAGE_STATUS_LABELS } from '@/lib/labels';
import { formatDate, formatNumber } from '@/lib/format';
import { cn } from '@/lib/utils';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/session';

export const dynamic = 'force-dynamic';

const SERIES_DAYS = 90;

const STATUS_BAR_COLORS: Record<string, string> = {
  SUBMITTED: 'bg-blue-500',
  VERIFIED: 'bg-cyan-500',
  PROCESSING: 'bg-amber-500',
  REVISION: 'bg-orange-500',
  COMPLETED: 'bg-green-500',
  REJECTED: 'bg-red-500',
};

const ACTION_PHRASES: Record<string, string> = {
  CREATE: 'menambahkan',
  UPDATE: 'mengubah',
  DELETE: 'menghapus',
  STATUS: 'memperbarui status',
  LOGIN: 'masuk ke sistem',
  LOGIN_FAILED: 'gagal masuk',
};

const iso = (value: Date) => value.toISOString().slice(0, 10);

export default async function AdminDashboardPage() {
  const user = await getCurrentUser();
  const isAdmin = user?.role === 'ADMIN';

  const today = new Date();
  const sinceSeries = subDays(today, SERIES_DAYS - 1);
  const sinceWeek = startOfDay(subDays(today, 6));
  const yesterday = subDays(today, 1);

  const [
    totalApplications,
    applicationsThisWeek,
    applicationsYesterday,
    statusGroups,
    unreadMessages,
    publishedNews,
    activeServices,
    umkmCount,
    announcementCount,
    recentApplications,
    recentMessages,
    recentActivity,
    createdApplications,
  ] = await Promise.all([
    prisma.application.count(),
    prisma.application.count({ where: { createdAt: { gte: sinceWeek } } }),
    prisma.application.count({
      where: { createdAt: { gte: startOfDay(yesterday), lt: startOfDay(today) } },
    }),
    prisma.application.groupBy({ by: ['status'], _count: { _all: true } }),
    isAdmin
      ? prisma.contactMessage.count({ where: { status: 'UNREAD' } })
      : Promise.resolve(0),
    prisma.news.count({ where: { status: 'PUBLISHED' } }),
    prisma.service.count({ where: { isActive: true } }),
    prisma.umkm.count(),
    prisma.announcement.count(),
    prisma.application.findMany({
      orderBy: { createdAt: 'desc' },
      take: 6,
      include: { service: { select: { name: true } } },
    }),
    prisma.contactMessage.findMany({ orderBy: { createdAt: 'desc' }, take: isAdmin ? 4 : 0 }),
    prisma.auditLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: isAdmin ? 6 : 0,
      include: { user: { select: { name: true } } },
    }),
    prisma.application.findMany({
      where: { createdAt: { gte: sinceSeries } },
      select: { createdAt: true },
    }),
  ]);

  const statusCount = new Map<string, number>();
  for (const group of statusGroups) statusCount.set(group.status, group._count._all);

  const perDay = new Map<string, number>();
  for (const item of createdApplications) {
    const key = format(item.createdAt, 'yyyy-MM-dd');
    perDay.set(key, (perDay.get(key) ?? 0) + 1);
  }
  const series: SeriesPoint[] = [];
  for (let offset = SERIES_DAYS - 1; offset >= 0; offset--) {
    const key = format(subDays(today, offset), 'yyyy-MM-dd');
    series.push({ date: key, total: perDay.get(key) ?? 0 });
  }

  const waiting = (statusCount.get('SUBMITTED') ?? 0) + (statusCount.get('VERIFIED') ?? 0);
  const inProgress =
    (statusCount.get('PROCESSING') ?? 0) + (statusCount.get('REVISION') ?? 0);
  const completed = statusCount.get('COMPLETED') ?? 0;
  const rejected = statusCount.get('REJECTED') ?? 0;

  const stats = [
    {
      label: 'Total Pengajuan',
      value: totalApplications,
      hint: `+${formatNumber(applicationsThisWeek)} dalam 7 hari terakhir`,
      icon: FileStack,
    },
    {
      label: 'Menunggu Diproses',
      value: waiting,
      hint: 'Status diajukan & diverifikasi',
      icon: Clock3,
    },
    {
      label: 'Dalam Proses',
      value: inProgress,
      hint: 'Sedang dikerjakan & perlu perbaikan',
      icon: Loader2,
    },
    {
      label: 'Pengajuan Selesai',
      value: completed,
      hint: 'Telah selesai diproses',
      icon: CheckCircle2,
    },
    isAdmin
      ? {
          label: 'Pesan Belum Dibaca',
          value: unreadMessages,
          hint: 'Pesan masuk dari masyarakat',
          icon: Inbox,
        }
      : {
          label: 'Pengajuan Ditolak',
          value: rejected,
          hint: `+${formatNumber(applicationsYesterday)} masuk kemarin`,
          icon: XCircle,
        },
  ];

  const quickActions = isAdmin
    ? [
        { href: '/admin/berita?new=1', label: 'Tambah Berita', desc: 'Tulis berita desa', icon: Newspaper },
        { href: '/admin/layanan?new=1', label: 'Tambah Layanan', desc: 'Kelola layanan desa', icon: Files },
        { href: '/admin/pengumuman?new=1', label: 'Tambah Pengumuman', desc: 'Info untuk warga', icon: Megaphone },
        { href: '/admin/pengajuan', label: 'Kelola Pengajuan', desc: 'Verifikasi & proses', icon: FileStack },
        { href: '/admin/pesan', label: 'Pesan Masuk', desc: 'Kontak masyarakat', icon: Inbox },
      ]
    : [
        { href: '/admin/pengajuan', label: 'Kelola Pengajuan', desc: 'Verifikasi & proses pengajuan', icon: FileStack },
        { href: '/', label: 'Lihat Situs Publik', desc: 'Pratinjau website desa', icon: ExternalLink },
      ];

  const actionGrid = isAdmin
    ? 'sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5'
    : 'sm:grid-cols-2';

  const contentStats = [
    { label: 'Berita Terbit', value: publishedNews, icon: Newspaper },
    { label: 'Layanan Aktif', value: activeServices, icon: Files },
    { label: 'UMKM', value: umkmCount, icon: Store },
    { label: 'Pengumuman', value: announcementCount, icon: Megaphone },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold">Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Selamat bertugas{user?.name ? `, ${user.name}` : ''}. Berikut ringkasan aktivitas desa
            hari ini.
          </p>
        </div>
        <p className="text-sm text-muted-foreground">
          {format(today, 'EEEE, d MMMM yyyy', { locale: localeId })}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-5">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4 sm:p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs leading-tight text-muted-foreground sm:text-sm">
                    {stat.label}
                  </p>
                  <p className="mt-1 font-display text-2xl font-bold">{formatNumber(stat.value)}</p>
                  <p className="mt-1 hidden truncate text-xs text-muted-foreground sm:block">
                    {stat.hint}
                  </p>
                </div>
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary sm:h-10 sm:w-10">
                  <stat.icon className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Aksi Cepat</CardTitle>
          <CardDescription>Pintasan ke fitur yang sering dipakai.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className={cn('grid gap-3', actionGrid)}>
            {quickActions.map((action) => (
              <Link
                key={action.href + action.label}
                href={action.href}
                className="group flex items-center gap-3 rounded-lg border bg-card p-3.5 text-left transition-colors hover:border-primary/40 hover:bg-primary/5 sm:p-4"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <action.icon className="h-4 w-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold">{action.label}</span>
                  <span className="block truncate text-xs text-muted-foreground">
                    {action.desc}
                  </span>
                </span>
                <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ApplicationsChart data={series} />
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Ringkasan Status</CardTitle>
            <CardDescription>
              {formatNumber(totalApplications)} pengajuan tercatat seluruhnya.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {APPLICATION_STATUS_ORDER.map((status) => {
              const count = statusCount.get(status) ?? 0;
              const pct = totalApplications ? Math.round((count / totalApplications) * 100) : 0;
              return (
                <div key={status}>
                  <div className="flex items-center justify-between gap-3">
                    <ApplicationStatusBadge status={status} />
                    <div className="text-sm">
                      <span className="font-semibold">{formatNumber(count)}</span>
                      <span className="ml-1 text-muted-foreground">{pct}%</span>
                    </div>
                  </div>
                  <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className={`h-full rounded-full ${STATUS_BAR_COLORS[status] ?? 'bg-primary'}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
        <Card className={isAdmin ? 'lg:col-span-2' : 'lg:col-span-3'}>
          <CardHeader>
            <CardTitle className="text-base">Pengajuan Terbaru</CardTitle>
            <CardDescription>Enam pengajuan terakhir yang masuk.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nomor</TableHead>
                  <TableHead>Pemohon</TableHead>
                  <TableHead className="hidden md:table-cell">Layanan</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden text-right md:table-cell">Tanggal</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentApplications.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                      Belum ada pengajuan masuk.
                    </TableCell>
                  </TableRow>
                ) : (
                  recentApplications.map((application) => (
                    <TableRow key={application.id}>
                      <TableCell className="font-medium">{application.trackingNumber}</TableCell>
                      <TableCell>{application.applicantName}</TableCell>
                      <TableCell className="hidden max-w-[180px] truncate text-muted-foreground md:table-cell">
                        {application.service?.name ?? '-'}
                      </TableCell>
                      <TableCell>
                        <ApplicationStatusBadge status={application.status} />
                      </TableCell>
                      <TableCell className="hidden text-right text-muted-foreground md:table-cell">
                        {formatDate(iso(application.createdAt))}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
            <Link
              href="/admin/pengajuan"
              className="mt-3 inline-block text-sm font-medium text-primary hover:underline"
            >
              Lihat semua pengajuan
            </Link>
          </CardContent>
        </Card>

        {isAdmin && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Activity className="h-4 w-4" />
                Aktivitas Terbaru
              </CardTitle>
              <CardDescription>Riwayat perubahan data oleh pengguna.</CardDescription>
            </CardHeader>
            <CardContent>
              {recentActivity.length === 0 ? (
                <p className="text-sm text-muted-foreground">Belum ada aktivitas tercatat.</p>
              ) : (
                <ul className="space-y-4">
                  {recentActivity.map((log) => {
                    const phrase = ACTION_PHRASES[log.action] ?? log.action.toLowerCase();
                    return (
                      <li key={log.id} className="flex items-start gap-3">
                        <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                          <Activity className="h-3.5 w-3.5" />
                        </span>
                        <div className="min-w-0">
                          <p className="text-sm">
                            <span className="font-medium">{log.user?.name ?? 'Sistem'}</span>{' '}
                            <span className="text-muted-foreground">
                              {phrase} {log.entity}
                            </span>
                          </p>
                          <RelativeTime
                            value={log.createdAt.toISOString()}
                            className="text-xs text-muted-foreground"
                          />
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
        {isAdmin && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Pesan Terbaru</CardTitle>
              <CardDescription>Pesan masuk dari formulir kontak.</CardDescription>
            </CardHeader>
            <CardContent>
              {recentMessages.length === 0 ? (
                <p className="text-sm text-muted-foreground">Belum ada pesan masuk.</p>
              ) : (
                <ul className="space-y-3">
                  {recentMessages.map((message) => (
                    <li key={message.id} className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{message.subject}</p>
                        <p className="truncate text-xs text-muted-foreground">{message.name}</p>
                      </div>
                      <Badge variant="secondary" className="shrink-0">
                        {MESSAGE_STATUS_LABELS[message.status] ?? message.status}
                      </Badge>
                    </li>
                  ))}
                </ul>
              )}
              <Link
                href="/admin/pesan"
                className="mt-4 inline-block text-sm font-medium text-primary hover:underline"
              >
                Lihat semua pesan
              </Link>
            </CardContent>
          </Card>
        )}

        {isAdmin && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Konten Terkini</CardTitle>
              <CardDescription>Jumlah konten yang dipublikasikan.</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {contentStats.map((item) => (
                  <li key={item.label} className="flex items-center justify-between gap-3">
                    <span className="flex items-center gap-2 text-sm text-muted-foreground">
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </span>
                    <span className="font-semibold">{formatNumber(item.value)}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
