'use client';

import { useState } from 'react';
import Image from 'next/image';
import { X, Calendar } from 'lucide-react';
import { PublicLayout } from '@/components/layout/public-layout';
import { PageHeader } from '@/components/layout/page-header';
import { galleryItems, galleryCategories } from '@/data/gallery';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/format';

export default function GaleriPage() {
  const [category, setCategory] = useState('all');
  const [lightbox, setLightbox] = useState<string | null>(null);

  const filtered = category === 'all' ? galleryItems : galleryItems.filter((g) => g.category === category);
  const current = galleryItems.find((g) => g.id === lightbox);

  return (
    <PublicLayout>
      <PageHeader
        eyebrow="Dokumentasi"
        title="Galeri Desa"
        description="Dokumentasi kegiatan, pembangunan, budaya, wisata, dan masyarakat Desa Sukamaju."
        breadcrumb={[{ label: 'Beranda', href: '/' }, { label: 'Galeri' }]}
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
            {galleryCategories.map((cat) => (
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
              <p className="text-muted-foreground">Tidak ada foto dalam kategori ini.</p>
            </div>
          ) : (
            <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
              {filtered.map((item) => (
                <Card
                  key={item.id}
                  className="break-inside-avoid overflow-hidden p-0 border-0 cursor-pointer group"
                  onClick={() => setLightbox(item.id)}
                >
                  <div className="relative overflow-hidden rounded-xl">
                    <Image
                      src={item.image}
                      alt={item.title}
                      width={400}
                      height={300}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Badge className="mb-1.5 bg-accent/90 text-accent-foreground border-transparent">{item.category}</Badge>
                      <h3 className="font-display font-semibold text-white text-sm leading-snug">{item.title}</h3>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {current && (
        <div
          className="fixed inset-0 z-[100] bg-foreground/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-4 right-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
            onClick={() => setLightbox(null)}
            aria-label="Tutup"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="max-w-3xl w-full" onClick={(e) => e.stopPropagation()}>
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden">
              <Image
                src={current.image}
                alt={current.title}
                fill
                sizes="100vw"
                className="object-cover"
              />
            </div>
            <div className="mt-4 text-center text-white">
              <Badge className="bg-accent/90 text-accent-foreground border-transparent">{current.category}</Badge>
              <h3 className="mt-2 font-display font-bold text-lg">{current.title}</h3>
              <p className="mt-1 text-sm text-white/70">{current.caption}</p>
              <p className="mt-2 inline-flex items-center gap-1.5 text-xs text-white/50">
                <Calendar className="h-3 w-3" />
                {formatDate(current.date)}
              </p>
            </div>
          </div>
        </div>
      )}
    </PublicLayout>
  );
}
