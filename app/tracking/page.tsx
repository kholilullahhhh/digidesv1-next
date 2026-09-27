import { PublicLayout } from '@/components/layout/public-layout';
import { TrackingView } from '@/components/views/tracking-view';

export const dynamic = 'force-dynamic';

export default function TrackingPage() {
  return (
    <PublicLayout>
      <TrackingView />
    </PublicLayout>
  );
}
