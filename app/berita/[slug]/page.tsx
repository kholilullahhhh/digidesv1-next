import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { ArrowLeft, Calendar, Clock, User } from 'lucide-react';
import { PublicLayout } from '@/components/layout/public-layout';
import { getNewsBySlug, getNewsSummaries } from '@/lib/queries';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/format';
import { JsonLd } from '@/components/layout/json-ld';
import { ShareButton } from '@/components/news/share-button';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const article = await getNewsBySlug(params.slug);
  if (!article) return {};
  return { title: article.title, description: article.excerpt };
}

export default async function BeritaDetailPage({ params }: { params: { slug: string } }) {
  const article = await getNewsBySlug(params.slug);
  if (!article) notFound();

  const related = await getNewsSummaries({
    excludeSlug: article.slug,
    category: article.category,
    take: 3,
  });

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    description: article.excerpt,
    image: article.thumbnail,
    datePublished: article.date,
    author: { '@type': 'Person', name: article.author },
  };

  return (
    <PublicLayout>
      <JsonLd data={jsonLd} />
      <article>
        {/* Header */}
        <section className="border-b bg-muted/30">
          <div className="container-mx py-10 lg:py-14 max-w-3xl">
            <Link href="/berita" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors mb-4">
              <ArrowLeft className="h-4 w-4" />
              Kembali ke Berita
            </Link>
            <Badge className="mb-3">{article.category}</Badge>
            <h1 className="font-display text-2xl lg:text-4xl font-bold text-balance leading-tight">{article.title}</h1>
            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <User className="h-4 w-4" />
                {article.author}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                {formatDate(article.date)}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                {article.readTime}
              </span>
            </div>
          </div>
        </section>

        {/* Featured image */}
        <div className="container-mx max-w-4xl -mt-0">
          <div className="relative aspect-[16/9] rounded-2xl overflow-hidden shadow-lg">
            <Image
              src={article.thumbnail}
              alt={article.title}
              fill
              sizes="(max-width: 1024px) 100vw, 768px"
              className="object-cover"
              priority
            />
          </div>
        </div>

        {/* Content */}
        <section className="py-10 lg:py-14">
          <div className="container-mx max-w-3xl">
            <div className="prose prose-sm sm:prose-base max-w-none">
              <p className="text-lg text-muted-foreground leading-relaxed font-medium">{article.excerpt}</p>
              <div className="mt-6 space-y-4 text-muted-foreground leading-relaxed text-pretty">
                {article.content.split('\n\n').map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t flex items-center justify-between">
              <Link href="/berita" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors">
                <ArrowLeft className="h-4 w-4" />
                Kembali
              </Link>
              <ShareButton />
            </div>
          </div>
        </section>

        {/* Related */}
        {related.length > 0 && (
          <section className="py-10 lg:py-14 bg-muted/40 border-t">
            <div className="container-mx">
              <h2 className="font-display text-xl font-bold mb-6">Berita Terkait</h2>
              <div className="grid gap-6 md:grid-cols-3">
                {related.map((rel) => (
                  <Link key={rel.slug} href={`/berita/${rel.slug}`} className="group">
                    <div className="overflow-hidden rounded-xl border bg-card hover:shadow-md transition-all duration-300">
                      <div className="relative aspect-[16/10] overflow-hidden">
                        <Image
                          src={rel.thumbnail}
                          alt={rel.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="p-4">
                        <p className="text-xs text-muted-foreground mb-1">{formatDate(rel.date)}</p>
                        <h3 className="font-semibold text-sm leading-snug group-hover:text-primary transition-colors line-clamp-2">{rel.title}</h3>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </article>
    </PublicLayout>
  );
}
