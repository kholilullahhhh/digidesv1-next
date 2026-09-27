import { PublicLayout } from '@/components/layout/public-layout';
import { TransparansiView } from '@/components/views/transparansi-view';
import { getBudgets } from '@/lib/queries';

export const dynamic = 'force-dynamic';

export default async function TransparansiPage() {
  const budgets = await getBudgets();
  return (
    <PublicLayout>
      <TransparansiView budgets={budgets} />
    </PublicLayout>
  );
}
