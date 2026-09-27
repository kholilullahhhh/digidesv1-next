import Link from 'next/link';
import { Home, Search } from 'lucide-react';
import { PublicShell } from '@/components/layout/public-shell';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <PublicShell>
      <section className="min-h-[60vh] flex items-center justify-center py-20">
        <div className="container-mx text-center">
          <p className="font-display text-7xl lg:text-9xl font-bold text-primary/20">404</p>
          <h1 className="font-display text-2xl lg:text-3xl font-bold mt-4">Halaman Tidak Ditemukan</h1>
          <p className="mt-3 text-muted-foreground max-w-md mx-auto">
            Maaf, halaman yang Anda cari tidak tersedia atau telah dipindahkan.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild>
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Kembali ke Beranda
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/layanan">
                <Search className="mr-2 h-4 w-4" />
                Lihat Layanan
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </PublicShell>
  );
}
