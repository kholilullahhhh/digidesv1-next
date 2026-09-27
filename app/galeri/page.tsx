import { PublicLayout } from '@/components/layout/public-layout';
import { GaleriView } from '@/components/views/galeri-view';
import { getGallery } from '@/lib/queries';

export const dynamic = 'force-dynamic';

export default async function GaleriPage() {
  const items = await getGallery();
  return (
    <PublicLayout>
      <GaleriView items={items} />
    </PublicLayout>
  );
}
