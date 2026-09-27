'use client';

import { AlertCircle, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminPanelError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <Card className="mx-auto max-w-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <AlertCircle className="h-4 w-4 text-destructive" />
          Terjadi kesalahan
        </CardTitle>
        <CardDescription>
          Halaman admin ini gagal dimuat. Silakan coba lagi, atau muat ulang peramban jika masalah
          berlanjut.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground">
          {error.message || 'Kesalahan tidak diketahui.'}
        </p>
        <Button size="sm" onClick={reset}>
          <RotateCcw className="mr-2 h-4 w-4" />
          Coba Lagi
        </Button>
      </CardContent>
    </Card>
  );
}
