'use client';

import { useState } from 'react';
import { MapPin, Wallet, Building2, Calendar } from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';
import type { ProjectView } from '@/lib/queries';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { formatCurrency } from '@/lib/format';

const statusStyles: Record<string, string> = {
  PERENCANAAN: 'bg-blue-100 text-blue-700 border-blue-200',
  BERJALAN: 'bg-amber-100 text-amber-700 border-amber-200',
  SELESAI: 'bg-green-100 text-green-700 border-green-200',
};

interface PembangunanViewProps {
  projects: ProjectView[];
}

export function PembangunanView({ projects }: PembangunanViewProps) {
  const [filter, setFilter] = useState<string>('all');

  const filtered = filter === 'all' ? projects : projects.filter((p) => p.status === filter);

  return (
    <>
      <PageHeader
        eyebrow="Pembangunan"
        title="Pembangunan Desa"
        description="Daftar proyek pembangunan yang sedang dan telah dilaksanakan di Desa Sukamaju."
        breadcrumb={[{ label: 'Beranda', href: '/' }, { label: 'Pembangunan' }]}
      />

      <section className="py-12 lg:py-16">
        <div className="container-mx">
          <div className="flex flex-wrap gap-2 mb-8">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                filter === 'all' ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground hover:bg-muted/70'
              }`}
            >
              Semua
            </button>
            {(['PERENCANAAN', 'BERJALAN', 'SELESAI'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  filter === s ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground hover:bg-muted/70'
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground">Tidak ada proyek pada status ini.</p>
            </div>
          ) : (
            <div className="grid gap-4 lg:grid-cols-2">
              {filtered.map((project) => (
                <Card key={project.id} className="hover:shadow-md transition-all duration-300">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <h3 className="font-display font-semibold text-foreground leading-snug">{project.name}</h3>
                      <Badge className={`shrink-0 border ${statusStyles[project.status]}`}>
                        {project.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm text-muted-foreground mb-4">
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-primary" />
                        {project.location}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-primary" />
                        {project.year}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <Wallet className="h-3.5 w-3.5 text-primary" />
                        {formatCurrency(project.budget)}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <Building2 className="h-3.5 w-3.5 text-primary" />
                        {project.source}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center justify-between text-sm mb-1.5">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">{project.progress}%</span>
                      </div>
                      <Progress value={project.progress} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
