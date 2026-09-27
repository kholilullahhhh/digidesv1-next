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
import { siteConfig } from '@/config/site';

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'GovernmentOrganization',
  name: siteConfig.name,
  description: siteConfig.description,
  url: 'https://desasukamaju.id',
  address: {
    '@type': 'PostalAddress',
    streetAddress: siteConfig.address,
    addressLocality: siteConfig.regency,
    addressRegion: siteConfig.province,
    postalCode: siteConfig.postalCode,
    addressCountry: 'ID',
  },
  telephone: siteConfig.phone,
  email: siteConfig.email,
};

export default function Home() {
  return (
    <PublicLayout>
      <JsonLd data={jsonLd} />
      <HeroSection />
      <QuickServices />
      <ServiceFlow />
      <StatsSection />
      <ProfilePreview />
      <HeadGreeting />
      <LatestNews />
      <UpcomingEvents />
      <PotentialPreview />
      <TransparencyPreview />
      <CtaService />
      <ContactMap />
    </PublicLayout>
  );
}
