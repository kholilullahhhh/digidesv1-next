import { ApplicationsManager } from '@/components/admin/applications-manager';
import { getCurrentUser } from '@/lib/session';

export const dynamic = 'force-dynamic';

export default async function PengajuanPage() {
  const user = await getCurrentUser();
  return <ApplicationsManager canDelete={user?.role === 'ADMIN'} />;
}
