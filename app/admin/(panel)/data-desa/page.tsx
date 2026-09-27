import { redirect } from 'next/navigation';
import { VillageForm } from '@/components/admin/village-form';
import { getCurrentUser } from '@/lib/session';

export const dynamic = 'force-dynamic';

export default async function DataDesaPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/admin/login');
  if (user.role !== 'ADMIN') redirect('/admin');
  return <VillageForm />;
}
