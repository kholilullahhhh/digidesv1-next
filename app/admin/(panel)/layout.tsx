import { redirect } from 'next/navigation';
import { AdminShell } from '@/components/admin/shell';
import { getCurrentUser } from '@/lib/session';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect('/admin/login');
  if (user.role !== 'ADMIN' && user.role !== 'STAFF') redirect('/admin/login');

  const unreadCount =
    user.role === 'ADMIN'
      ? await prisma.contactMessage.count({ where: { status: 'UNREAD' } })
      : 0;

  return (
    <AdminShell
      user={{ name: user.name, email: user.email, role: user.role }}
      unreadCount={unreadCount}
    >
      {children}
    </AdminShell>
  );
}
