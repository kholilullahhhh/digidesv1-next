import { PublicLayout } from '@/components/layout/public-layout';
import { PembangunanView } from '@/components/views/pembangunan-view';
import { getProjects } from '@/lib/queries';

export const dynamic = 'force-dynamic';

export default async function PembangunanPage() {
  const projects = await getProjects();
  return (
    <PublicLayout>
      <PembangunanView projects={projects} />
    </PublicLayout>
  );
}
