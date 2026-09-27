import Link from 'next/link';
import { Landmark, MapPin, Phone, Mail, Clock, Facebook, Instagram, Youtube } from 'lucide-react';
import { siteConfig } from '@/config/site';
import type { SiteConfigView } from '@/lib/site-view';

export function Footer({ site }: { site: SiteConfigView }) {
  return (
    <footer className="border-t bg-foreground text-background">
      <div className="container-mx py-12 lg:py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <Landmark className="h-5 w-5" />
              </div>
              <div className="leading-tight">
                <p className="font-display font-bold">Desa {site.village}</p>
                <p className="text-xs text-background/60">{site.regency}, {site.province}</p>
              </div>
            </div>
            <p className="text-sm text-background/70 leading-relaxed">
              Portal resmi Pemerintah Desa {site.village} untuk informasi, pelayanan publik, dan transparansi anggaran.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-display font-semibold mb-4">Navigasi</h3>
            <ul className="space-y-2.5 text-sm text-background/70">
              {siteConfig.nav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-background transition-colors">
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Layanan */}
          <div>
            <h3 className="font-display font-semibold mb-4">Layanan</h3>
            <ul className="space-y-2.5 text-sm text-background/70">
              <li><Link href="/layanan" className="hover:text-background transition-colors">Layanan Online</Link></li>
              <li><Link href="/tracking" className="hover:text-background transition-colors">Lacak Pengajuan</Link></li>
              <li><Link href="/transparansi" className="hover:text-background transition-colors">Transparansi Anggaran</Link></li>
              <li><Link href="/pembangunan" className="hover:text-background transition-colors">Pembangunan Desa</Link></li>
              <li><Link href="/data-desa" className="hover:text-background transition-colors">Data Desa</Link></li>
              <li><Link href="/agenda" className="hover:text-background transition-colors">Agenda Desa</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-display font-semibold mb-4">Kontak</h3>
            <ul className="space-y-3 text-sm text-background/70">
              <li className="flex gap-2.5">
                <MapPin className="h-4 w-4 shrink-0 mt-0.5 text-background/50" />
                <span>{site.address}</span>
              </li>
              <li className="flex gap-2.5">
                <Phone className="h-4 w-4 shrink-0 mt-0.5 text-background/50" />
                <span>{site.phone}</span>
              </li>
              <li className="flex gap-2.5">
                <Mail className="h-4 w-4 shrink-0 mt-0.5 text-background/50" />
                <span>{site.email}</span>
              </li>
              <li className="flex gap-2.5">
                <Clock className="h-4 w-4 shrink-0 mt-0.5 text-background/50" />
                <span>{site.hours}</span>
              </li>
            </ul>
            <div className="flex gap-2 mt-4">
              <a href={site.social.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-background/10 hover:bg-background/20 transition-colors">
                <Facebook className="h-4 w-4" />
              </a>
              <a href={site.social.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-background/10 hover:bg-background/20 transition-colors">
                <Instagram className="h-4 w-4" />
              </a>
              <a href={site.social.youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-background/10 hover:bg-background/20 transition-colors">
                <Youtube className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-background/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-background/50">
          <p>© 2026 Pemerintah Desa {site.village}. Hak cipta dilindungi.</p>
          <p>Website Desa — Dibangun untuk pelayanan masyarakat.</p>
        </div>
      </div>
    </footer>
  );
}
