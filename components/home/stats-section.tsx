import { Users, Home, MapPin, Ruler, TrendingUp, UserCheck } from 'lucide-react';
import { SectionHeading } from '@/components/layout/section-heading';
import type { VillageStatsView } from '@/lib/queries';

interface StatsSectionProps {
  stats: VillageStatsView;
}

export function StatsSection({ stats }: StatsSectionProps) {
  const items = [
    { icon: Users, label: 'Jumlah Penduduk', value: stats.population.toLocaleString('id-ID') },
    { icon: UserCheck, label: 'Kepala Keluarga', value: stats.families.toLocaleString('id-ID') },
    { icon: Home, label: 'Jumlah Dusun', value: stats.dusun },
    { icon: MapPin, label: 'RT / RW', value: `${stats.rt} / ${stats.rw}` },
    { icon: Ruler, label: 'Luas Wilayah', value: `${stats.area} km²` },
    { icon: TrendingUp, label: 'Kepadatan', value: `${stats.density}/km²` },
  ];

  return (
    <section className="py-16 lg:py-20 bg-muted/40 border-y">
      <div className="container-mx">
        <SectionHeading
          eyebrow="Data Desa"
          title="Statistik Desa Sukamaju"
          description="Gambaran umum kependudukan dan wilayah Desa Sukamaju berdasarkan data terkini."
        />

        <div className="mt-10 grid grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((stat, i) => (
            <div
              key={stat.label}
              className="flex items-center gap-3 rounded-xl border bg-card p-4 animate-fade-up sm:gap-4 sm:p-5"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary sm:h-12 sm:w-12">
                <stat.icon className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <div className="min-w-0">
                <p className="text-xl font-bold font-display text-foreground sm:text-2xl lg:text-3xl">
                  {stat.value}
                </p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
