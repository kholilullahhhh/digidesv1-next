import type { LucideIcon } from 'lucide-react';
import { prisma } from '@/lib/db';
import { getServiceIcon } from '@/lib/service-icons';
import { PROJECT_STATUS_LABELS } from '@/lib/labels';
import { staticSiteConfigView, type SiteConfigView } from '@/lib/site-view';

export type { SiteConfigView };
export { staticSiteConfigView };

const iso = (value: Date | string) =>
  typeof value === 'string' ? value.slice(0, 10) : value.toISOString().slice(0, 10);

/** Konfigurasi situs dari database, dengan fallback statis bila database tidak tersedia (aman untuk build). */
export async function getSiteConfig(): Promise<SiteConfigView> {
  try {
    const [village, settings] = await Promise.all([
      prisma.village.findUnique({ where: { id: 'village' } }),
      prisma.siteSetting.findUnique({ where: { id: 'site' } }),
    ]);
    const base = staticSiteConfigView();
    if (!village && !settings) return base;
    return {
      name: settings?.siteName ?? (village ? `Desa ${village.name}` : base.name),
      shortName: settings?.shortName ?? base.shortName,
      tagline: settings?.tagline ?? base.tagline,
      description: settings?.description || village?.description || base.description,
      village: village?.name ?? base.village,
      district: village?.district ?? base.district,
      regency: village?.regency ?? base.regency,
      province: village?.province ?? base.province,
      postalCode: village?.postalCode ?? base.postalCode,
      address: village?.address ?? base.address,
      phone: village?.phone ?? base.phone,
      email: village?.email ?? base.email,
      hours: village?.hours ?? base.hours,
      coordinates: village
        ? { lat: village.lat, lng: village.lng }
        : base.coordinates,
      social: {
        facebook: settings?.facebook ?? base.social.facebook,
        instagram: settings?.instagram ?? base.social.instagram,
        youtube: settings?.youtube ?? base.social.youtube,
      },
      ogImageUrl: settings?.ogImageUrl || base.ogImageUrl,
      footerNote: settings?.footerNote || base.footerNote,
    };
  } catch {
    return staticSiteConfigView();
  }
}

export interface AnnouncementView {
  id: string;
  title: string;
  content: string;
  date: string;
}

export async function getAnnouncements(): Promise<AnnouncementView[]> {
  try {
    const items = await prisma.announcement.findMany({
      where: { isActive: true },
      orderBy: { date: 'desc' },
    });
    return items.map((item) => ({
      id: item.id,
      title: item.title,
      content: item.content,
      date: iso(item.date),
    }));
  } catch {
    return [];
  }
}

export interface NewsView {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  thumbnail: string;
  featured: boolean;
}

function toNewsView(article: {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishedAt: Date;
  readTime: string;
  thumbnail: string;
  featured: boolean;
  category: { name: string };
}): NewsView {
  return {
    slug: article.slug,
    title: article.title,
    excerpt: article.excerpt,
    content: article.content,
    category: article.category.name,
    author: article.author,
    date: iso(article.publishedAt),
    readTime: article.readTime,
    thumbnail: article.thumbnail,
    featured: article.featured,
  };
}

export async function getNews(options?: { publishedOnly?: boolean }) {
  const articles = await prisma.news.findMany({
    where: options?.publishedOnly === false ? {} : { status: 'PUBLISHED' },
    orderBy: { publishedAt: 'desc' },
    include: { category: true },
  });
  return articles.map(toNewsView);
}

export type NewsSummaryView = Omit<NewsView, 'content'>;

const NEWS_SUMMARY_SELECT = {
  slug: true,
  title: true,
  excerpt: true,
  author: true,
  publishedAt: true,
  readTime: true,
  thumbnail: true,
  featured: true,
  category: { select: { name: true } },
} as const;

function toNewsSummaryView(article: {
  slug: string;
  title: string;
  excerpt: string;
  author: string;
  publishedAt: Date;
  readTime: string;
  thumbnail: string;
  featured: boolean;
  category: { name: string };
}): NewsSummaryView {
  return {
    slug: article.slug,
    title: article.title,
    excerpt: article.excerpt,
    category: article.category.name,
    author: article.author,
    date: iso(article.publishedAt),
    readTime: article.readTime,
    thumbnail: article.thumbnail,
    featured: article.featured,
  };
}

export async function getNewsSummaries(options?: {
  publishedOnly?: boolean;
  take?: number;
  excludeSlug?: string;
  category?: string;
}): Promise<NewsSummaryView[]> {
  const articles = await prisma.news.findMany({
    where: {
      ...(options?.publishedOnly === false ? {} : { status: 'PUBLISHED' }),
      ...(options?.excludeSlug ? { slug: { not: options.excludeSlug } } : {}),
      ...(options?.category ? { category: { name: options.category } } : {}),
    },
    orderBy: { publishedAt: 'desc' },
    take: options?.take,
    select: NEWS_SUMMARY_SELECT,
  });
  return articles.map(toNewsSummaryView);
}

export async function getNewsBySlug(slug: string): Promise<NewsView | null> {
  const article = await prisma.news.findUnique({
    where: { slug },
    include: { category: true },
  });
  if (!article || article.status !== 'PUBLISHED') return null;
  return toNewsView(article);
}

export async function getNewsCategories(): Promise<string[]> {
  const categories = await prisma.newsCategory.findMany({ orderBy: { order: 'asc' } });
  return categories.map((c) => c.name);
}

export interface ServiceView {
  slug: string;
  name: string;
  icon: LucideIcon;
  description: string;
  estimate: string;
  fee: string;
  requirements: string[];
  procedure: string[];
  documents: string[];
}

function toServiceView(service: {
  slug: string;
  name: string;
  icon: string;
  description: string;
  estimate: string;
  fee: string;
  procedure: string[];
  documents: string[];
  requirements: { text: string; order: number }[];
}): ServiceView {
  const requirements = [...service.requirements].sort((a, b) => a.order - b.order);
  return {
    slug: service.slug,
    name: service.name,
    icon: getServiceIcon(service.icon),
    description: service.description,
    estimate: service.estimate,
    fee: service.fee,
    requirements: requirements.map((r) => r.text),
    procedure: service.procedure,
    documents: service.documents,
  };
}

const serviceInclude = {
  requirements: { orderBy: { order: 'asc' as const } },
};

export async function getServices(): Promise<ServiceView[]> {
  const services = await prisma.service.findMany({
    where: { isActive: true },
    orderBy: { order: 'asc' },
    include: serviceInclude,
  });
  return services.map(toServiceView);
}

export async function getServiceBySlug(slug: string): Promise<ServiceView | null> {
  const service = await prisma.service.findUnique({
    where: { slug },
    include: serviceInclude,
  });
  if (!service || !service.isActive) return null;
  return toServiceView(service);
}

export interface EventView {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  organizer: string;
  category: string;
  description: string;
}

export async function getEvents(): Promise<EventView[]> {
  const events = await prisma.event.findMany({ orderBy: { date: 'asc' } });
  return events.map((event) => ({
    id: event.id,
    title: event.title,
    date: iso(event.date),
    time: event.time,
    location: event.location,
    organizer: event.organizer,
    category: event.category,
    description: event.description,
  }));
}

export interface OfficialView {
  id: string;
  name: string;
  position: string;
  category: string;
  photo: string;
  nip?: string | null;
  phone?: string | null;
  order: number;
}

export async function getOfficials(): Promise<OfficialView[]> {
  const officials = await prisma.villageOfficial.findMany({ orderBy: { order: 'asc' } });
  return officials.map((official) => ({
    id: official.id,
    name: official.name,
    position: official.position,
    category: official.category,
    photo: official.photo,
    nip: official.nip,
    phone: official.phone,
    order: official.order,
  }));
}

export interface PotentialView {
  id: string;
  name: string;
  category: string;
  description: string;
  location: string;
  contact?: string | null;
  image: string;
}

export async function getPotentials(): Promise<PotentialView[]> {
  const items = await prisma.villagePotential.findMany({
    where: { isActive: true },
    orderBy: { createdAt: 'asc' },
  });
  return items.map((item) => ({
    id: item.id,
    name: item.name,
    category: item.category,
    description: item.description,
    location: item.location,
    contact: item.contact,
    image: item.image,
  }));
}

export interface UmkmView {
  id: string;
  name: string;
  owner: string;
  category: string;
  product: string;
  location: string;
  contact: string;
  image: string;
  description: string;
}

export async function getUmkms(): Promise<UmkmView[]> {
  const items = await prisma.umkm.findMany({
    where: { isActive: true },
    orderBy: { createdAt: 'asc' },
  });
  return items.map((item) => ({
    id: item.id,
    name: item.name,
    owner: item.owner,
    category: item.category,
    product: item.product,
    location: item.location,
    contact: item.contact,
    image: item.image,
    description: item.description,
  }));
}

export interface ProjectView {
  id: string;
  name: string;
  location: string;
  year: number;
  budget: number;
  source: string;
  progress: number;
  status: string;
  description: string;
}

export async function getProjects(): Promise<ProjectView[]> {
  const items = await prisma.developmentProject.findMany({ orderBy: [{ year: 'desc' }, { createdAt: 'asc' }] });
  return items.map((item) => ({
    id: item.id,
    name: item.name,
    location: item.location,
    year: item.year,
    budget: item.budget,
    source: item.source,
    progress: item.progress,
    status: PROJECT_STATUS_LABELS[item.status] ?? item.status,
    description: item.description,
  }));
}

export interface BudgetItemView {
  label: string;
  value: number;
  color: string;
}

export interface BudgetView {
  year: number;
  income: BudgetItemView[];
  expenditure: BudgetItemView[];
  totalIncome: number;
  totalExpenditure: number;
}

const BUDGET_COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
];

function parseBudgetItems(value: unknown): BudgetItemView[] {
  if (!Array.isArray(value)) return [];
  return value.map((entry, index) => {
    const item = entry as { label?: string; value?: number; color?: string };
    return {
      label: String(item.label ?? ''),
      value: Number(item.value ?? 0),
      color: item.color || BUDGET_COLORS[index % BUDGET_COLORS.length],
    };
  });
}

export async function getBudgets(): Promise<BudgetView[]> {
  const reports = await prisma.budgetReport.findMany({ orderBy: { year: 'desc' } });
  return reports.map((report) => {
    const income = parseBudgetItems(report.income);
    const expenditure = parseBudgetItems(report.expenditure);
    return {
      year: report.year,
      income,
      expenditure,
      totalIncome: income.reduce((sum, item) => sum + item.value, 0),
      totalExpenditure: expenditure.reduce((sum, item) => sum + item.value, 0),
    };
  });
}

export interface GalleryView {
  id: string;
  title: string;
  category: string;
  image: string;
  date: string;
  caption: string;
}

export async function getGallery(): Promise<GalleryView[]> {
  const items = await prisma.gallery.findMany({ orderBy: { date: 'desc' } });
  return items.map((item) => ({
    id: item.id,
    title: item.title,
    category: item.category,
    image: item.image,
    date: iso(item.date),
    caption: item.caption,
  }));
}

export interface VillageStatsView {
  population: number;
  malePopulation: number;
  femalePopulation: number;
  families: number;
  dusun: number;
  rt: number;
  rw: number;
  area: number;
  density: number;
  villages: string[];
}

export interface VillageProfileView {
  history: string;
  vision: string;
  missions: string[];
  area: string;
  borders: { north: string; south: string; east: string; west: string };
  headOfVillage: {
    name: string;
    position: string;
    period: string;
    photo: string;
    greeting: string;
  };
}

export interface VillageDataView {
  stats: VillageStatsView;
  profile: VillageProfileView;
  ageGroups: { range: string; total: number; male: number; female: number }[];
  educationLevels: { level: string; total: number }[];
  jobCategories: { category: string; total: number }[];
}

function formatArea(area: number): string {
  return `${area.toLocaleString('id-ID', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} km²`;
}

export async function getVillageData(): Promise<VillageDataView> {
  const village = await prisma.village.findUnique({ where: { id: 'village' } });
  const fallback = staticSiteConfigView();
  const data = village ?? {
    name: fallback.village,
    population: 0,
    malePopulation: 0,
    femalePopulation: 0,
    families: 0,
    dusun: 0,
    rt: 0,
    rw: 0,
    area: 0,
    density: 0,
    dusunNames: [] as string[],
    history: '',
    vision: '',
    missions: [] as string[],
    borderNorth: '',
    borderSouth: '',
    borderEast: '',
    borderWest: '',
    headOfVillageName: '',
    headOfVillagePosition: '',
    headOfVillagePeriod: '',
    headOfVillageGreeting: '',
    headPhotoUrl: null as string | null,
    ageGroups: [] as unknown,
    educationLevels: [] as unknown,
    jobCategories: [] as unknown,
  };

  return {
    stats: {
      population: data.population,
      malePopulation: data.malePopulation,
      femalePopulation: data.femalePopulation,
      families: data.families,
      dusun: data.dusun,
      rt: data.rt,
      rw: data.rw,
      area: data.area,
      density: data.density,
      villages: data.dusunNames,
    },
    profile: {
      history: data.history ?? '',
      vision: data.vision ?? '',
      missions: data.missions ?? [],
      area: formatArea(data.area ?? 0),
      borders: {
        north: data.borderNorth,
        south: data.borderSouth,
        east: data.borderEast,
        west: data.borderWest,
      },
      headOfVillage: {
        name: data.headOfVillageName,
        position: data.headOfVillagePosition,
        period: data.headOfVillagePeriod,
        photo:
          data.headPhotoUrl ??
          villageProfileFallbackPhoto,
        greeting: data.headOfVillageGreeting,
      },
    },
    ageGroups: Array.isArray(data.ageGroups)
      ? (data.ageGroups as VillageDataView['ageGroups'])
      : [],
    educationLevels: Array.isArray(data.educationLevels)
      ? (data.educationLevels as VillageDataView['educationLevels'])
      : [],
    jobCategories: Array.isArray(data.jobCategories)
      ? (data.jobCategories as VillageDataView['jobCategories'])
      : [],
  };
}

const villageProfileFallbackPhoto =
  'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg';
