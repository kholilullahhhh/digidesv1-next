import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Calendar, Clock, User } from 'lucide-react';
import { SectionHeading } from '@/components/layout/section-heading';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/format';
import type { NewsSummaryView } from '@/lib/queries';

interface LatestNewsProps {
  news: NewsSummaryView[];
}

export function LatestNews({ news }: LatestNewsProps) {
  const articles = news.slice(0, 3);

  return (
    <section className="py-16 lg:py-24">
      <div className="container-mx">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10">
          <SectionHeading
            eyebrow="Informasi"
            title="Berita & Informasi Desa"
            description="Dapatkan kabar terbaru seputar kegiatan, pembangunan, dan informasi penting desa."
            align="left"
            className="max-w-xl"
          />
          <Button asChild variant="outline" size="sm" className="shrink-0">
            <Link href="/berita">
              Semua Berita
              <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {articles.map((article) => (
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
      </div>
    </section>
  );
}
