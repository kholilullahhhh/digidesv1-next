import { PublicLayout } from '@/components/layout/public-layout';
import { HeroSection } from '@/components/home/hero-section';
import { QuickServices } from '@/components/home/quick-services';
import { ServiceFlow } from '@/components/home/service-flow';
import { StatsSection } from '@/components/home/stats-section';
import { ProfilePreview } from '@/components/home/profile-preview';
import { HeadGreeting } from '@/components/home/head-greeting';
import { LatestNews } from '@/components/home/latest-news';
import { UpcomingEvents } from '@/components/home/upcoming-events';
import { PotentialPreview } from '@/components/home/potential-preview';
import { TransparencyPreview } from '@/components/home/transparency-preview';
import { CtaService } from '@/components/home/cta-service';
import { ContactMap } from '@/components/home/contact-map';
import { JsonLd } from '@/components/layout/json-ld';
import {
  getBudgets,
  getEvents,
  getNews,
  getPotentials,
  getServices,
  getSiteConfig,
  getVillageData,
} from '@/lib/queries';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const [site, news, events, services, potentials, village, budgets] = await Promise.all([
    getSiteConfig(),
    getNews(),
    getEvents(),
    getServices(),
    getPotentials(),
    getVillageData(),
    getBudgets(),
  ]);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'GovernmentOrganization',
    name: site.name,
    description: site.description,
    url: 'https://desasukamaju.id',
    address: {
      '@type': 'PostalAddress',
      streetAddress: site.address,
      addressLocality: site.regency,
      addressRegion: site.province,
      postalCode: site.postalCode,
      addressCountry: 'ID',
    },
    telephone: site.phone,
    email: site.email,
  };

  return (
    <PublicLayout>
      <JsonLd data={jsonLd} />
      <HeroSection site={site} stats={village.stats} />
      <QuickServices services={services} />
      <ServiceFlow />
      <StatsSection stats={village.stats} />
      <ProfilePreview profile={village.profile} stats={village.stats} />
      <HeadGreeting profile={village.profile} />
      <LatestNews news={news} />
      <UpcomingEvents events={events} />
      <PotentialPreview potentials={potentials} />
      <TransparencyPreview budgetYears={budgets} />
      <CtaService />
      <ContactMap site={site} />
    </PublicLayout>
  );
}
