import { getAdminMeta } from '@/lib/admin-meta';
import { apiOk, requireApiRole } from '@/lib/api';

export async function GET() {
  const auth = await requireApiRole(['ADMIN', 'STAFF']);
  if (!auth.ok) return auth.response;

  const meta = await getAdminMeta();
  return apiOk({ meta });
}
