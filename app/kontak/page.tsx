import { PublicLayout } from '@/components/layout/public-layout';
import { KontakView } from '@/components/views/kontak-view';
import { getSiteConfig } from '@/lib/queries';

export const dynamic = 'force-dynamic';

export default async function KontakPage() {
  const site = await getSiteConfig();
  return (
    <PublicLayout>
      <KontakView site={site} />
    </PublicLayout>
  );
}
