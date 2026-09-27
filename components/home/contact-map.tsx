import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { siteConfig } from '@/config/site';
import { SectionHeading } from '@/components/layout/section-heading';

export function ContactMap() {
  const { lat, lng } = siteConfig.coordinates;
  const mapSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.01},${lat - 0.008},${lng + 0.01},${lat + 0.008}&layer=mapnik&marker=${lat},${lng}`;

  return (
    <section className="py-16 lg:py-24">
      <div className="container-mx">
        <SectionHeading
          eyebrow="Kontak"
          title="Hubungi Pemerintah Desa"
          description="Kunjungi kantor desa atau hubungi kami untuk pertanyaan dan pelayanan."
        />

        <div className="mt-10 grid lg:grid-cols-2 gap-6">
          {/* Info */}
          <div className="space-y-4">
            <div className="rounded-2xl border bg-card p-6">
              <h3 className="font-display font-semibold mb-4">Informasi Kontak</h3>
              <ul className="space-y-4 text-sm">
                <li className="flex gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium">Alamat</p>
                    <p className="text-muted-foreground">{siteConfig.address}</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Phone className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium">Telepon</p>
                    <p className="text-muted-foreground">{siteConfig.phone}</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Mail className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-muted-foreground">{siteConfig.email}</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Clock className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium">Jam Pelayanan</p>
                    <p className="text-muted-foreground">{siteConfig.hours}</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Map */}
          <div className="rounded-2xl border overflow-hidden min-h-[320px]">
            <iframe
              src={mapSrc}
              title="Peta Lokasi Kantor Desa"
              className="w-full h-full min-h-[320px]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
