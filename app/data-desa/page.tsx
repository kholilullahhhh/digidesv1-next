import { PublicLayout } from '@/components/layout/public-layout';
import { DataDesaView } from '@/components/views/data-desa-view';
import { getVillageData } from '@/lib/queries';

export const dynamic = 'force-dynamic';

export default async function DataDesaPage() {
  const data = await getVillageData();
  return (
    <PublicLayout>
      <DataDesaView data={data} />
    </PublicLayout>
  );
}
