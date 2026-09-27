import type { MetadataRoute } from 'next';
import { prisma } from '@/lib/db';
import { services as staticServices } from '@/data/services';
import { newsArticles as staticNews } from '@/data/news';

export const dynamic = 'force-dynamic';

const BASE_URL = 'https://desasukamaju.id';

const STATIC_PAGES = [
  '',
  '/profil',
  '/pemerintahan',
  '/layanan',
  '/berita',
  '/agenda',
  '/potensi',
  '/umkm',
  '/transparansi',
  '/pembangunan',
  '/galeri',
  '/data-desa',
  '/tracking',
  '/kontak',
];

async function buildEntries(): Promise<MetadataRoute.Sitemap> {
  let serviceSlugs: string[] = staticServices.map((service) => service.slug);
  let newsSlugs: string[] = staticNews.map((article) => article.slug);

  try {
    const [dbServices, dbNews] = await Promise.all([
      prisma.service.findMany({ where: { isActive: true }, select: { slug: true } }),
      prisma.news.findMany({ where: { status: 'PUBLISHED' }, select: { slug: true } }),
    ]);
    serviceSlugs = dbServices.map((service) => service.slug);
    newsSlugs = dbNews.map((article) => article.slug);
  } catch {
    // Database tidak tersedia — gunakan data statis.
  }

  const paths = [
    ...STATIC_PAGES,
    ...serviceSlugs.map((slug) => `/layanan/${slug}`),
    ...newsSlugs.map((slug) => `/berita/${slug}`),
  ];

  return paths.map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: path === '' ? 1 : 0.7,
  }));
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function GET(): Promise<Response> {
  const entries = await buildEntries();
  const urls = entries
    .map(
      (entry) =>
        `  <url>\n    <loc>${escapeXml(entry.url)}</loc>\n    <lastmod>${new Date(entry.lastModified ?? Date.now()).toISOString()}</lastmod>\n    <changefreq>${entry.changeFrequency}</changefreq>\n    <priority>${entry.priority}</priority>\n  </url>`,
    )
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
}
