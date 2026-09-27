import Link from 'next/link';
import { FileStack, Inbox, Newspaper, Files } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { APPLICATION_STATUS_LABELS, MESSAGE_STATUS_LABELS } from '@/lib/labels';
import { formatDate } from '@/lib/format';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/session';

export const dynamic = 'force-dynamic';

const iso = (value: Date) => value.toISOString().slice(0, 10);

export default async function AdminDashboardPage() {
  const user = await getCurrentUser();

  const [
    totalApplications,
    submittedApplications,
    unreadMessages,
    publishedNews,
    activeServices,
    recentApplications,
    recentMessages,
  ] = await Promise.all([
    prisma.application.count(),
    prisma.application.count({ where: { status: 'SUBMITTED' } }),
    prisma.contactMessage.count({ where: { status: 'UNREAD' } }),
    prisma.news.count({ where: { status: 'PUBLISHED' } }),
    prisma.service.count({ where: { isActive: true } }),
    prisma.application.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: { service: { select: { name: true } } },
    }),
    prisma.contactMessage.findMany({ orderBy: { createdAt: 'desc' }, take: 5 }),
  ]);

  const stats = [
    { label: 'Total Pengajuan', value: totalApplications, icon: FileStack },
    { label: 'Pengajuan Baru', value: submittedApplications, icon: FileStack },
    { label: 'Pesan Belum Dibaca', value: unreadMessages, icon: Inbox },
    { label: 'Berita Terbit', value: publishedNews, icon: Newspaper },
    { label: 'Layanan Aktif', value: activeServices, icon: Files },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Selamat bertugas{user?.name ? `, ${user.name}` : ''}. Berikut ringkasan aktivitas desa
          hari ini.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="mt-1 font-display text-2xl font-bold">{stat.value}</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <stat.icon className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Pengajuan Terbaru</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nomor</TableHead>
                  <TableHead>Pemohon</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Tanggal</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentApplications.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground">
                      Belum ada pengajuan.
                    </TableCell>
                  </TableRow>
                ) : (
                  recentApplications.map((application) => (
                    <TableRow key={application.id}>
                      <TableCell className="font-medium">{application.trackingNumber}</TableCell>
                      <TableCell>{application.applicantName}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {APPLICATION_STATUS_LABELS[application.status] ?? application.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground">
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

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Pesan Terbaru</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pengirim</TableHead>
                  <TableHead>Subjek</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentMessages.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-muted-foreground">
                      Belum ada pesan masuk.
                    </TableCell>
                  </TableRow>
                ) : (
                  recentMessages.map((message) => (
                    <TableRow key={message.id}>
                      <TableCell className="font-medium">{message.name}</TableCell>
                      <TableCell className="max-w-[200px] truncate">{message.subject}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {MESSAGE_STATUS_LABELS[message.status] ?? message.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
            <Link
              href="/admin/pesan"
              className="mt-3 inline-block text-sm font-medium text-primary hover:underline"
            >
              Lihat semua pesan
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
