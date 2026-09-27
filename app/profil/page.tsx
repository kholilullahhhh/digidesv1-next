import { PublicLayout } from '@/components/layout/public-layout';
import { PageHeader } from '@/components/layout/page-header';
import { JsonLd } from '@/components/layout/json-ld';
import { villageProfile } from '@/data/profile';
import { villageStats } from '@/data/village';
import { Card, CardContent } from '@/components/ui/card';
import { Target, Eye, MapPinned, Users, Home, Ruler, MapPin, Compass } from 'lucide-react';
import { siteConfig } from '@/config/site';

const statCards = [
  { icon: Users, label: 'Jumlah Penduduk', value: villageStats.population.toLocaleString('id-ID') },
  { icon: Home, label: 'Jumlah Dusun', value: villageStats.dusun },
  { icon: MapPin, label: 'Jumlah RT', value: villageStats.rt },
  { icon: MapPin, label: 'Jumlah RW', value: villageStats.rw },
  { icon: Ruler, label: 'Luas Wilayah', value: villageProfile.area },
  { icon: Users, label: 'Kepala Keluarga', value: villageStats.families.toLocaleString('id-ID') },
];

const borderItems = [
  { label: 'Utara', value: villageProfile.borders.north },
  { label: 'Selatan', value: villageProfile.borders.south },
  { label: 'Timur', value: villageProfile.borders.east },
  { label: 'Barat', value: villageProfile.borders.west },
];

export default function ProfilPage() {
  return (
    <PublicLayout>
      <PageHeader
        eyebrow="Tentang Desa"
        title="Profil Desa Sukamaju"
        description="Mengenal sejarah, visi, misi, dan kondisi geografis Desa Sukamaju."
        breadcrumb={[{ label: 'Beranda', href: '/' }, { label: 'Profil Desa' }]}
      />

      {/* Stats */}
      <section className="py-12 lg:py-16">
        <div className="container-mx">
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {statCards.map((stat) => (
              <Card key={stat.label}>
                <CardContent className="flex items-center gap-4 p-5">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <stat.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold font-display">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* History */}
      <section className="py-8 lg:py-12 bg-muted/40 border-y">
        <div className="container-mx">
          <div className="max-w-3xl">
            <h2 className="font-display text-2xl font-bold mb-4">Sejarah Desa</h2>
            <p className="text-muted-foreground leading-relaxed text-pretty">{villageProfile.history}</p>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-12 lg:py-16">
        <div className="container-mx">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Eye className="h-5 w-5" />
                  </div>
                  <h2 className="font-display text-xl font-bold">Visi</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed text-pretty">{villageProfile.vision}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/15 text-accent">
                    <Target className="h-5 w-5" />
                  </div>
                  <h2 className="font-display text-xl font-bold">Misi</h2>
                </div>
                <ol className="space-y-3">
                  {villageProfile.missions.map((mission, i) => (
                    <li key={i} className="flex gap-3 text-sm text-muted-foreground">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                        {i + 1}
                      </span>
                      <span className="leading-relaxed pt-0.5">{mission}</span>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Borders */}
      <section className="py-8 lg:py-12 bg-muted/40 border-y">
        <div className="container-mx">
          <div className="flex items-center gap-2.5 mb-6">
            <Compass className="h-5 w-5 text-primary" />
            <h2 className="font-display text-2xl font-bold">Batas Wilayah</h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {borderItems.map((border) => (
              <Card key={border.label}>
                <CardContent className="p-5">
                  <p className="text-xs text-muted-foreground mb-1">Batas {border.label}</p>
                  <p className="font-semibold text-foreground">{border.value}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Dusun list */}
      <section className="py-12 lg:py-16">
        <div className="container-mx">
          <div className="flex items-center gap-2.5 mb-6">
            <MapPinned className="h-5 w-5 text-primary" />
            <h2 className="font-display text-2xl font-bold">Wilayah Dusun</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {villageStats.villages.map((dusun, i) => (
              <Card key={dusun}>
                <CardContent className="p-4 text-center">
                  <p className="text-3xl font-bold font-display text-primary/30">{i + 1}</p>
                  <p className="mt-1 text-sm font-medium">{dusun}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Place',
          name: siteConfig.name,
          address: siteConfig.address,
        }}
      />
    </PublicLayout>
  );
}
