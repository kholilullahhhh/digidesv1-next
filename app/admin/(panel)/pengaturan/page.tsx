import { redirect } from 'next/navigation';
import { SettingsForm } from '@/components/admin/settings-form';
import { getCurrentUser } from '@/lib/session';

export const dynamic = 'force-dynamic';

export default async function PengaturanPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/admin/login');
  if (user.role !== 'ADMIN') redirect('/admin');
  return <SettingsForm />;
}
