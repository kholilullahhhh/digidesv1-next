import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { ADMIN_RESOURCES, type ResourceKey } from '@/lib/admin-resources';
import { getCrudDef, prismaMessage } from '@/lib/admin-crud';
import { audit, apiError, apiOk, revalidatePublic, requireApiRole } from '@/lib/api';
import { prisma } from '@/lib/db';

type Ctx = { params: { resource: string; id: string } };

export async function PATCH(request: NextRequest, ctx: Ctx) {
  const resource = ctx.params.resource as ResourceKey;
  const meta = ADMIN_RESOURCES[resource];
  const def = getCrudDef(resource);
  if (!meta || !def) return apiError('Resource tidak dikenal.', 404);
  if (!meta.canEdit) return apiError('Resource ini tidak dapat diubah.', 405);

  const auth = await requireApiRole(meta.roles);
  if (!auth.ok) return auth.response;

  const body = await request.json().catch(() => null);
  if (!body) return apiError('Permintaan tidak valid.');

  const parsed = def.def.schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        message: 'Data belum valid, periksa isian form.',
        errors: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  try {
    const delegate = (prisma as any)[def.def.model];
    const data = await def.def.toUpdate(parsed.data as Record<string, unknown>, ctx.params.id);
    const args: Record<string, unknown> = { where: { id: ctx.params.id }, data };
    if (def.def.include) args.include = def.def.include;
    if (def.def.select) args.select = def.def.select;
    const updated = await delegate.update(args);
    const item = def.def.toRow ? def.def.toRow(updated) : updated;
    await audit(auth.user.id, 'UPDATE', meta.singular, ctx.params.id);
    if (meta.revalidate) await revalidatePublic();
    return apiOk({ item });
  } catch (error) {
    const { message, status } = prismaMessage(error);
    return NextResponse.json({ ok: false, message }, { status });
  }
}

export async function DELETE(_request: NextRequest, ctx: Ctx) {
  const resource = ctx.params.resource as ResourceKey;
  const meta = ADMIN_RESOURCES[resource];
  const def = getCrudDef(resource);
  if (!meta || !def) return apiError('Resource tidak dikenal.', 404);
  if (!meta.canDelete) return apiError('Resource ini tidak dapat dihapus.', 405);

  const auth = await requireApiRole(meta.roles);
  if (!auth.ok) return auth.response;

  try {
    const delegate = (prisma as any)[def.def.model];
    await delegate.delete({ where: { id: ctx.params.id } });
    await audit(auth.user.id, 'DELETE', meta.singular, ctx.params.id);
    if (meta.revalidate) await revalidatePublic();
    return apiOk();
  } catch (error) {
    const { message, status } = prismaMessage(error);
    return NextResponse.json({ ok: false, message }, { status });
  }
}
