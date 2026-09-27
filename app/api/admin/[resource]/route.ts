import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { ADMIN_RESOURCES, type ResourceKey } from '@/lib/admin-resources';
import { getCrudDef, prismaMessage } from '@/lib/admin-crud';
import { audit, apiError, apiOk, revalidatePublic, requireApiRole } from '@/lib/api';
import { prisma } from '@/lib/db';

type Ctx = { params: { resource: string } };

function queryArgs(def: ReturnType<typeof getCrudDef>, skip?: number, take?: number) {
  const args: Record<string, unknown> = { orderBy: def!.def.orderBy };
  if (def!.def.include) args.include = def!.def.include;
  if (def!.def.select) args.select = def!.def.select;
  if (skip !== undefined) args.skip = skip;
  if (take !== undefined) args.take = take;
  return args;
}

export async function GET(request: NextRequest, ctx: Ctx) {
  const resource = ctx.params.resource as ResourceKey;
  const meta = ADMIN_RESOURCES[resource];
  const def = getCrudDef(resource);
  if (!meta || !def) return apiError('Resource tidak dikenal.', 404);

  const auth = await requireApiRole(meta.roles);
  if (!auth.ok) return auth.response;

  const url = new URL(request.url);
  const q = url.searchParams.get('q')?.trim() ?? '';
  const page = Math.max(1, Number(url.searchParams.get('page') ?? 1) || 1);
  const pageSize = Math.min(100, Math.max(1, Number(url.searchParams.get('pageSize') ?? 10) || 10));
  const all = url.searchParams.get('all') === '1';

  const searchFields = def.def.searchFields ?? [];
  const where =
    q && searchFields.length
      ? { OR: searchFields.map((field) => ({ [field]: { contains: q, mode: 'insensitive' as const } })) }
      : undefined;

  try {
    const delegate = (prisma as any)[def.def.model];
    const rows = await delegate.findMany({
      where,
      ...queryArgs(def, all ? undefined : (page - 1) * pageSize, all ? undefined : pageSize),
    });
    const total = all ? rows.length : await delegate.count({ where });
    const items = rows.map((row: Record<string, unknown>) =>
      def.def.toRow ? def.def.toRow(row) : row,
    );
    return apiOk({ items, total, page, pageSize });
  } catch (error) {
    const { message, status } = prismaMessage(error);
    return NextResponse.json({ ok: false, message }, { status });
  }
}

export async function POST(request: NextRequest, ctx: Ctx) {
  const resource = ctx.params.resource as ResourceKey;
  const meta = ADMIN_RESOURCES[resource];
  const def = getCrudDef(resource);
  if (!meta || !def) return apiError('Resource tidak dikenal.', 404);
  if (!meta.canCreate) return apiError('Resource ini tidak dapat dibuat.', 405);

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
    const data = await def.def.toCreate(parsed.data as Record<string, unknown>);
    const args: Record<string, unknown> = { data };
    if (def.def.include) args.include = def.def.include;
    if (def.def.select) args.select = def.def.select;
    const created = await delegate.create(args);
    const item = def.def.toRow ? def.def.toRow(created) : created;
    await audit(auth.user.id, 'CREATE', meta.singular, String(created.id));
    if (meta.revalidate) await revalidatePublic();
    return apiOk({ item }, 201);
  } catch (error) {
    const { message, status } = prismaMessage(error);
    return NextResponse.json({ ok: false, message }, { status });
  }
}
