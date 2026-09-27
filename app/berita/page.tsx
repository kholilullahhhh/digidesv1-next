'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Clock, User, Search } from 'lucide-react';
import { PublicLayout } from '@/components/layout/public-layout';
import { PageHeader } from '@/components/layout/page-header';
import { newsArticles, newsCategories } from '@/data/news';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { formatDate } from '@/lib/format';

export default function BeritaPage() {
  const [category, setCategory] = useState<string>('all');
  const [search, setSearch] = useState('');

  const filtered = newsArticles.filter((a) => {
    const matchCat = category === 'all' || a.category === category;
    const matchSearch = a.title.toLowerCase().includes(search.toLowerCase()) || a.excerpt.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <PublicLayout>
      <PageHeader
        eyebrow="Informasi"
        title="Berita & Informasi Desa"
        description="Berita terbaru seputar kegiatan, pembangunan, dan informasi penting Desa Sukamaju."
        breadcrumb={[{ label: 'Beranda', href: '/' }, { label: 'Berita' }]}
      />

      <section className="py-12 lg:py-16">
        <div className="container-mx">
          {/* Filters */}
          <div className="flex flex-col lg:flex-row gap-4 mb-8">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari berita..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setCategory('all')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  category === 'all' ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground hover:bg-muted/70'
                }`}
              >
                Semua
              </button>
              {newsCategories.map((cat) => (
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
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground">Tidak ada berita yang ditemukan.</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((article) => (
                <Link key={article.slug} href={`/berita/${article.slug}`} className="group">
                  <Card className="h-full overflow-hidden hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <Image
                        src={article.thumbnail}
                        alt={article.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <Badge className="absolute top-3 left-3 bg-primary/90 text-primary-foreground border-transparent">
                        {article.category}
                      </Badge>
                    </div>
                    <CardContent className="p-5">
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(article.date)}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {article.readTime}
                        </span>
                      </div>
                      <h3 className="font-display font-semibold text-foreground leading-snug group-hover:text-primary transition-colors line-clamp-2">
                        {article.title}
                      </h3>
                      <p className="mt-2 text-sm text-muted-foreground line-clamp-2 leading-relaxed">{article.excerpt}</p>
                    </CardContent>
                    <CardFooter className="px-5 pb-5 pt-0">
                      <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                        <User className="h-3 w-3" />
                        {article.author}
                      </span>
                    </CardFooter>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </PublicLayout>
  );
}
