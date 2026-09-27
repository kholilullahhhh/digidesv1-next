import { Users, Home, MapPin, Ruler, TrendingUp, UserCheck } from 'lucide-react';
import { villageStats } from '@/data/village';
import { SectionHeading } from '@/components/layout/section-heading';

const stats = [
  { icon: Users, label: 'Jumlah Penduduk', value: villageStats.population.toLocaleString('id-ID') },
  { icon: UserCheck, label: 'Kepala Keluarga', value: villageStats.families.toLocaleString('id-ID') },
  { icon: Home, label: 'Jumlah Dusun', value: villageStats.dusun },
  { icon: MapPin, label: 'RT / RW', value: `${villageStats.rt} / ${villageStats.rw}` },
  { icon: Ruler, label: 'Luas Wilayah', value: `${villageStats.area} km²` },
  { icon: TrendingUp, label: 'Kepadatan', value: `${villageStats.density}/km²` },
];

export function StatsSection() {
  return (
    <section className="py-16 lg:py-20 bg-muted/40 border-y">
      <div className="container-mx">
        <SectionHeading
          eyebrow="Data Desa"
          title="Statistik Desa Sukamaju"
          description="Gambaran umum kependudukan dan wilayah Desa Sukamaju berdasarkan data terkini."
        />

        <div className="mt-10 grid grid-cols-2 lg:grid-cols-3 gap-4">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className="flex items-center gap-4 rounded-xl border bg-card p-5 animate-fade-up"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <stat.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-2xl lg:text-3xl font-bold font-display text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
