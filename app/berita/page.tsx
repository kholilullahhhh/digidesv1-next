import { PublicLayout } from '@/components/layout/public-layout';
import { BeritaView } from '@/components/views/berita-view';
import { getNews, getNewsCategories } from '@/lib/queries';

export const dynamic = 'force-dynamic';

export default async function BeritaPage() {
  const [articles, categories] = await Promise.all([getNews(), getNewsCategories()]);
  return (
    <PublicLayout>
      <BeritaView articles={articles} categories={categories} />
    </PublicLayout>
  );
}
