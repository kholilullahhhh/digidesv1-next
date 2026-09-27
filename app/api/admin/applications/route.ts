import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { apiOk, requireApiRole } from '@/lib/api';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  const auth = await requireApiRole(['ADMIN', 'STAFF']);
  if (!auth.ok) return auth.response;

  const url = new URL(request.url);
  const q = url.searchParams.get('q')?.trim() ?? '';
  const status = url.searchParams.get('status') ?? '';
  const page = Math.max(1, Number(url.searchParams.get('page') ?? 1) || 1);
  const pageSize = Math.min(100, Math.max(1, Number(url.searchParams.get('pageSize') ?? 10) || 10));

  const where = {
    ...(status ? { status: status as never } : {}),
    ...(q
      ? {
          OR: ['trackingNumber', 'applicantName', 'phone', 'email'].map((field) => ({
            [field]: { contains: q, mode: 'insensitive' as const },
          })),
        }
      : {}),
  };

  try {
    const [rows, total] = await Promise.all([
      prisma.application.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          service: { select: { name: true, slug: true } },
          histories: { orderBy: { createdAt: 'asc' } },
        },
      }),
      prisma.application.count({ where }),
    ]);

    return apiOk({
      items: rows.map((row) => ({
        ...row,
        serviceName: row.service.name,
      })),
      total,
      page,
      pageSize,
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: error instanceof Error ? error.message : 'Gagal memuat pengajuan.' },
      { status: 500 },
    );
  }
}
