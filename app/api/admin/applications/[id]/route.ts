import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { apiError, apiOk, audit, requireApiRole } from '@/lib/api';
import { prisma } from '@/lib/db';
import { applicationStatusSchema } from '@/lib/validation';

type Ctx = { params: { id: string } };

export async function PATCH(request: NextRequest, ctx: Ctx) {
  const auth = await requireApiRole(['ADMIN', 'STAFF']);
  if (!auth.ok) return auth.response;

  const body = await request.json().catch(() => null);
  if (!body) return apiError('Permintaan tidak valid.');

  const parsed = applicationStatusSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        message: 'Status tidak valid.',
        errors: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  try {
    const existing = await prisma.application.findUnique({ where: { id: ctx.params.id } });
    if (!existing) return apiError('Pengajuan tidak ditemukan.', 404);

    const note = parsed.data.note?.trim() || null;
    const updated = await prisma.$transaction([
      prisma.application.update({
        where: { id: ctx.params.id },
        data: { status: parsed.data.status },
      }),
      prisma.applicationStatusHistory.create({
        data: {
          applicationId: ctx.params.id,
          status: parsed.data.status,
          note,
          changedById: auth.user.id,
        },
      }),
    ]);

    await audit(auth.user.id, 'STATUS', 'Pengajuan Layanan', ctx.params.id, {
      trackingNumber: existing.trackingNumber,
      from: existing.status,
      to: parsed.data.status,
      note,
    });

    return apiOk({ item: updated[0] });
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: error instanceof Error ? error.message : 'Gagal memperbarui status.' },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: NextRequest, ctx: Ctx) {
  const auth = await requireApiRole(['ADMIN']);
  if (!auth.ok) return auth.response;

  try {
    const existing = await prisma.application.findUnique({ where: { id: ctx.params.id } });
    if (!existing) return apiError('Pengajuan tidak ditemukan.', 404);

    await prisma.application.delete({ where: { id: ctx.params.id } });
    await audit(auth.user.id, 'DELETE', 'Pengajuan Layanan', ctx.params.id, {
      trackingNumber: existing.trackingNumber,
    });
    return apiOk();
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: error instanceof Error ? error.message : 'Gagal menghapus pengajuan.' },
      { status: 500 },
    );
  }
}
