import Link from 'next/link';
import { ArrowRight, FileText, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function CtaService() {
  return (
    <section className="py-16 lg:py-24">
      <div className="container-mx">
        <div className="relative overflow-hidden rounded-3xl bg-primary px-6 py-14 lg:px-16 lg:py-20 text-center">
          <div className="absolute inset-0 bg-grid opacity-10" />
          <div className="relative">
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-primary-foreground text-balance">
              Ajukan Layanan Online Sekarang
            </h2>
            <p className="mt-4 text-primary-foreground/85 max-w-xl mx-auto text-pretty">
              Urus kebutuhan administrasi desa kapan saja dan di mana saja. Pantau status pengajuan Anda secara real-time.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90">
                <Link href="/layanan">
                  <FileText className="mr-2 h-4 w-4" />
                  Ajukan Layanan
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground">
                <Link href="/tracking">
                  <Search className="mr-2 h-4 w-4" />
                  Lacak Pengajuan
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
