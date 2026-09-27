'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell, Legend } from 'recharts';
import { Users, Home, MapPin, Ruler, UserCheck } from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { VillageDataView } from '@/lib/queries';
import { formatNumber } from '@/lib/format';

interface DataDesaViewProps {
  data: VillageDataView;
}

export function DataDesaView({ data }: DataDesaViewProps) {
  const { stats: villageStats, ageGroups, educationLevels, jobCategories } = data;

  const genderData = [
    { name: 'Laki-laki', value: villageStats.malePopulation, color: 'hsl(var(--chart-1))' },
    { name: 'Perempuan', value: villageStats.femalePopulation, color: 'hsl(var(--chart-3))' },
  ];

  const overviewStats = [
    { icon: Users, label: 'Jumlah Penduduk', value: formatNumber(villageStats.population) },
    { icon: UserCheck, label: 'Kepala Keluarga', value: formatNumber(villageStats.families) },
    { icon: Home, label: 'Jumlah Dusun', value: villageStats.dusun },
    { icon: MapPin, label: 'RT / RW', value: `${villageStats.rt} / ${villageStats.rw}` },
    { icon: Ruler, label: 'Luas Wilayah', value: `${villageStats.area} km²` },
    { icon: Users, label: 'Kepadatan', value: `${villageStats.density}/km²` },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Statistik"
        title="Data Desa"
        description="Data kependudukan dan demografi Desa Sukamaju berdasarkan catatan terkini."
        breadcrumb={[{ label: 'Beranda', href: '/' }, { label: 'Data Desa' }]}
      />

      <section className="py-12 lg:py-16">
        <div className="container-mx space-y-8">
          {/* Overview */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {overviewStats.map((stat) => (
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

          {/* Gender pie */}
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Jenis Kelamin</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[260px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={genderData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={2}>
                        {genderData.map((entry, i) => (
                          <Cell key={i} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(v: number) => formatNumber(v)} contentStyle={{ borderRadius: '8px', fontSize: '12px', border: '1px solid hsl(var(--border))' }} />
                      <Legend wrapperStyle={{ fontSize: '12px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Age groups */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Kelompok Umur</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[260px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={ageGroups} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                      <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                      <YAxis type="category" dataKey="range" stroke="hsl(var(--muted-foreground))" fontSize={11} width={50} />
                      <Tooltip formatter={(v: number) => formatNumber(v)} contentStyle={{ borderRadius: '8px', fontSize: '12px', border: '1px solid hsl(var(--border))' }} />
                      <Bar dataKey="total" fill="hsl(var(--chart-1))" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Education */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Tingkat Pendidikan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={educationLevels}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="level" stroke="hsl(var(--muted-foreground))" fontSize={10} angle={-15} textAnchor="end" height={60} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
                    <Tooltip formatter={(v: number) => formatNumber(v)} contentStyle={{ borderRadius: '8px', fontSize: '12px', border: '1px solid hsl(var(--border))' }} />
                    <Bar dataKey="total" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Jobs */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Mata Pencaharian</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={jobCategories} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                    <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                    <YAxis type="category" dataKey="category" stroke="hsl(var(--muted-foreground))" fontSize={11} width={100} />
                    <Tooltip formatter={(v: number) => formatNumber(v)} contentStyle={{ borderRadius: '8px', fontSize: '12px', border: '1px solid hsl(var(--border))' }} />
                    <Bar dataKey="total" fill="hsl(var(--chart-4))" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
}
