import { PublicLayout } from '@/components/layout/public-layout';
import { UmkmView } from '@/components/views/umkm-view';
import { getUmkms } from '@/lib/queries';

export const dynamic = 'force-dynamic';

export default async function UmkmPage() {
  const items = await getUmkms();
  return (
    <PublicLayout>
      <UmkmView items={items} />
    </PublicLayout>
  );
}
