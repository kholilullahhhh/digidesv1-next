import Image from 'next/image';
import { PublicLayout } from '@/components/layout/public-layout';
import { PageHeader } from '@/components/layout/page-header';
import { OFFICIAL_CATEGORIES } from '@/lib/labels';
import { getOfficials } from '@/lib/queries';
import { Card, CardContent } from '@/components/ui/card';
import { Phone } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function PemerintahanPage() {
  const villageOfficials = await getOfficials();

  return (
    <PublicLayout>
      <PageHeader
        eyebrow="Struktur Organisasi"
        title="Pemerintahan Desa"
        description="Susunan perangkat pemerintahan Desa Sukamaju yang melayani masyarakat."
        breadcrumb={[{ label: 'Beranda', href: '/' }, { label: 'Pemerintahan' }]}
      />

      <section className="py-12 lg:py-16">
        <div className="container-mx space-y-12">
          {OFFICIAL_CATEGORIES.map((cat) => {
            const officials = villageOfficials.filter((o) => o.category === cat.value);
            if (officials.length === 0) return null;
            return (
              <div key={cat.value}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-px flex-1 bg-border" />
                  <h2 className="font-display text-lg font-bold text-foreground px-3 py-1 rounded-full bg-primary/10 text-primary">
                    {cat.label}
                  </h2>
                  <div className="h-px flex-1 bg-border" />
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {officials.map((official) => (
                    <Card key={official.id} className="overflow-hidden group hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
                      <div className="relative aspect-square overflow-hidden">
                        <Image
                          src={official.photo}
                          alt={official.name}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 33vw, 25vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <CardContent className="p-4 text-center">
                        <h3 className="font-display font-semibold text-foreground leading-snug">{official.name}</h3>
                        <p className="mt-1 text-sm text-primary font-medium">{official.position}</p>
                        {official.nip && (
                          <p className="mt-1 text-xs text-muted-foreground">NIP: {official.nip}</p>
                        )}
                        {official.phone && (
                          <p className="mt-2 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Phone className="h-3 w-3" />
                            {official.phone}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </PublicLayout>
  );
}
