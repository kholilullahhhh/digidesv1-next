import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { potentials } from '@/data/potentials';
import { SectionHeading } from '@/components/layout/section-heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export function PotentialPreview() {
  const featured = potentials.slice(0, 4);

  return (
    <section className="py-16 lg:py-24">
      <div className="container-mx">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10">
          <SectionHeading
            eyebrow="Potensi Desa"
            title="Potensi Ekonomi & Wisata"
            description="Mengenal potensi pertanian, perkebunan, UMKM, dan wisata yang dimiliki Desa Sukamaju."
            align="left"
            className="max-w-xl"
          />
          <Button asChild variant="outline" size="sm" className="shrink-0">
            <Link href="/potensi">
              Jelajahi Potensi
              <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((item) => (
            <Link key={item.id} href="/potensi" className="group relative aspect-[3/4] rounded-xl overflow-hidden">
              <Image
                src={item.image}
                alt={item.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/30 to-transparent" />
              <div className="absolute top-3 left-3">
                <Badge className="bg-accent/90 text-accent-foreground border-transparent">{item.category}</Badge>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="font-display font-bold text-white leading-snug">{item.name}</h3>
                <p className="mt-1 text-xs text-white/75 line-clamp-2">{item.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
