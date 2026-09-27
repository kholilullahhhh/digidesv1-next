import type { MetadataRoute } from 'next';
import { siteConfig } from '@/config/site';
import { services } from '@/data/services';
import { newsArticles } from '@/data/news';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://desasukamaju.id';
  const staticPages = [
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

  const servicePages = services.map((s) => `/layanan/${s.slug}`);
  const newsPages = newsArticles.map((a) => `/berita/${a.slug}`);

  return [...staticPages, ...servicePages, ...newsPages].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: path === '' ? 1 : 0.7,
  }));
}
