import { redirect } from 'next/navigation';
import { getAdminMeta } from '@/lib/admin-meta';
import { ResourceManager, type ResourceMeta } from '@/components/admin/resource-manager';
import { ADMIN_RESOURCES, type ResourceKey } from '@/lib/admin-resources';
import { getCurrentUser } from '@/lib/session';

export async function ResourcePage({ resourceKey }: { resourceKey: ResourceKey }) {
  const [meta, user] = await Promise.all([getAdminMeta(), getCurrentUser()]);
  if (!user) redirect('/admin/login');
  const allowed = ADMIN_RESOURCES[resourceKey]?.roles ?? [];
  if (!allowed.includes(user.role)) redirect('/admin');
  return <ResourceManager resourceKey={resourceKey} meta={meta} />;
}
