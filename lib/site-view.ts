import { siteConfig } from '@/config/site';

/** Bentuk data konfigurasi situs yang dipakai header/footer (aman untuk client component). */
export interface SiteConfigView {
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  village: string;
  district: string;
  regency: string;
  province: string;
  postalCode: string;
  address: string;
  phone: string;
  email: string;
  hours: string;
  coordinates: { lat: number; lng: number };
  social: { facebook: string; instagram: string; youtube: string };
  ogImageUrl: string;
  footerNote: string;
}

export const DEFAULT_OG_IMAGE = 'https://images.pexels.com/photos/20967/pexels-photo.jpg';

/** Konfigurasi statis dari config/site — dipakai saat database tidak tersedia. */
export function staticSiteConfigView(): SiteConfigView {
  return {
    name: siteConfig.name,
    shortName: siteConfig.shortName,
    tagline: siteConfig.tagline,
    description: siteConfig.description,
    village: siteConfig.village,
    district: siteConfig.district,
    regency: siteConfig.regency,
    province: siteConfig.province,
    postalCode: siteConfig.postalCode,
    address: siteConfig.address,
    phone: siteConfig.phone,
    email: siteConfig.email,
    hours: siteConfig.hours,
    coordinates: { ...siteConfig.coordinates },
    social: { ...siteConfig.social },
    ogImageUrl: DEFAULT_OG_IMAGE,
    footerNote: `© 2026 Pemerintah Desa ${siteConfig.village}. Hak cipta dilindungi.`,
  };
}
