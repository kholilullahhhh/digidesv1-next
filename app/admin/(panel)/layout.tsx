import { redirect } from 'next/navigation';
import { AdminShell } from '@/components/admin/shell';
import { getCurrentUser } from '@/lib/session';

export default async function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect('/admin/login');
  if (user.role !== 'ADMIN' && user.role !== 'STAFF') redirect('/admin/login');

  return (
    <AdminShell user={{ name: user.name, email: user.email, role: user.role }}>
      {children}
    </AdminShell>
  );
}
