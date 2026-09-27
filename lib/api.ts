import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import type { Prisma, Role } from '@prisma/client';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export type ApiAuth =
  | { ok: true; user: { id: string; email: string; role: Role } }
  | { ok: false; response: NextResponse };

export function apiError(message: string, status = 400) {
  return NextResponse.json({ ok: false, message }, { status });
}

export function apiOk(data: Record<string, unknown> = {}, status = 200) {
  return NextResponse.json({ ok: true, ...data }, { status });
}

/** Authorization wajib di server untuk semua endpoint admin. */
export async function requireApiRole(roles: Role[]): Promise<ApiAuth> {
  const session = await getServerSession(authOptions);
  const user = session?.user;
  if (!user?.id) {
    return {
      ok: false,
      response: NextResponse.json(
        { ok: false, message: 'Sesi berakhir, silakan login kembali.' },
        { status: 401 },
      ),
    };
  }
  if (!roles.includes(user.role)) {
    return {
      ok: false,
      response: NextResponse.json(
        { ok: false, message: 'Anda tidak memiliki akses untuk operasi ini.' },
        { status: 403 },
      ),
    };
  }
  return { ok: true, user: { id: user.id, email: user.email ?? '', role: user.role } };
}

export async function audit(
  userId: string | null,
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'STATUS' | 'LOGIN_FAILED',
  entity: string,
  entityId?: string | null,
  detail?: Record<string, unknown>,
) {
  try {
    await prisma.auditLog.create({
      data: {
        userId,
        action,
        entity,
        entityId: entityId ?? null,
        detail: detail ? (detail as Prisma.InputJsonValue) : undefined,
      },
    });
  } catch {
    // Jangan gagalkan operasi utama hanya karena audit log.
  }
}

/** Buang cache publik setelah perubahan konten agar website menampilkan data terbaru. */
export async function revalidatePublic(paths: string[] = ['/']) {
  const { revalidatePath } = await import('next/cache');
  try {
    for (const path of paths) {
      revalidatePath(path, 'layout');
    }
  } catch {
    // no-op
  }
}
