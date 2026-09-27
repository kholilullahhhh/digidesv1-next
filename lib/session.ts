import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import type { Role } from '@prisma/client';

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: Role;
}

export async function getCurrentUser(): Promise<SessionUser | null> {
  const session = await getServerSession(authOptions);
  const user = session?.user;
  if (!user?.id) return null;
  return {
    id: user.id,
    email: user.email ?? '',
    name: user.name ?? '',
    role: user.role,
  };
}

export async function requireUser(roles?: Role[]): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) throw new Error('Tidak terautentikasi');
  if (roles && !roles.includes(user.role)) throw new Error('Tidak memiliki akses');
  return user;
}
