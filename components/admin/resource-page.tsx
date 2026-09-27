import { getAdminMeta } from '@/lib/admin-meta';
import { ResourceManager, type ResourceMeta } from '@/components/admin/resource-manager';
import type { ResourceKey } from '@/lib/admin-resources';

export async function ResourcePage({ resourceKey }: { resourceKey: ResourceKey }) {
  const meta: ResourceMeta = await getAdminMeta();
  return <ResourceManager resourceKey={resourceKey} meta={meta} />;
}
