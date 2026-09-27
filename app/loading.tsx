import { Loader2 } from 'lucide-react';
import { PublicLayout } from '@/components/layout/public-layout';

export default function Loading() {
  return (
    <PublicLayout>
      <section className="min-h-[60vh] flex items-center justify-center py-20">
        <div className="text-center">
          <Loader2 className="h-10 w-10 text-primary animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Memuat...</p>
        </div>
      </section>
    </PublicLayout>
  );
}
