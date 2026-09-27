import { PublicLayout } from '@/components/layout/public-layout';
import { PotensiView } from '@/components/views/potensi-view';
import { getPotentials } from '@/lib/queries';

export const dynamic = 'force-dynamic';

export default async function PotensiPage() {
  const items = await getPotentials();
  return (
    <PublicLayout>
      <PotensiView items={items} />
    </PublicLayout>
  );
}
