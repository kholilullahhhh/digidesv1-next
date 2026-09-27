'use client';

import { useState } from 'react';
import Image from 'next/image';
import { MapPin, Phone, User } from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';
import type { UmkmView as UmkmItem } from '@/lib/queries';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface UmkmViewProps {
  items: UmkmItem[];
}

export function UmkmView({ items }: UmkmViewProps) {
  const [category, setCategory] = useState('all');

  const categories = Array.from(new Set(items.map((item) => item.category)));
  const filtered = category === 'all' ? items : items.filter((u) => u.category === category);

  return (
    <>
      <PageHeader
        eyebrow="Ekonomi Desa"
        title="UMKM Desa Sukamaju"
        description="Katalog usaha mikro, kecil, dan menengah milik masyarakat Desa Sukamaju."
        breadcrumb={[{ label: 'Beranda', href: '/' }, { label: 'UMKM' }]}
      />

      <section className="py-12 lg:py-16">
        <div className="container-mx">
          <div className="flex flex-wrap gap-2 mb-8 justify-center">
            <button
              onClick={() => setCategory('all')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                category === 'all' ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground hover:bg-muted/70'
              }`}
            >
              Semua
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  category === cat ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground hover:bg-muted/70'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground">Tidak ada UMKM dalam kategori ini.</p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((item) => (
                <Card key={item.id} className="overflow-hidden group hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <Badge className="absolute top-3 left-3 bg-accent/90 text-accent-foreground border-transparent">
                      {item.category}
                    </Badge>
                  </div>
                  <CardContent className="p-5">
                    <h3 className="font-display font-semibold text-foreground">{item.name}</h3>
                    <p className="mt-1 text-sm text-muted-foreground leading-relaxed line-clamp-2">{item.description}</p>
                    <div className="mt-3 pt-3 border-t space-y-1.5 text-xs text-muted-foreground">
                      <p className="inline-flex items-center gap-1.5">
                        <User className="h-3.5 w-3.5 text-primary" />
                        Pemilik: {item.owner}
                      </p>
                      <p className="inline-flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-primary" />
                        {item.location}
                      </p>
                      <p className="inline-flex items-center gap-1.5">
                        <Phone className="h-3.5 w-3.5 text-primary" />
                        {item.contact}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
