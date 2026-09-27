'use client';

import { useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import { PublicLayout } from '@/components/layout/public-layout';
import { Button } from '@/components/ui/button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);
  return (
    <PublicLayout>
      <section className="min-h-[60vh] flex items-center justify-center py-20">
        <div className="container-mx text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10 text-destructive mx-auto mb-4">
            <AlertCircle className="h-8 w-8" />
          </div>
          <h1 className="font-display text-2xl font-bold">Terjadi Kesalahan</h1>
          <p className="mt-3 text-muted-foreground max-w-md mx-auto">
            Maaf, terjadi kesalahan saat memuat halaman. Silakan coba lagi.
          </p>
          <Button onClick={reset} className="mt-6">
            Coba Lagi
          </Button>
        </div>
      </section>
    </PublicLayout>
  );
}
