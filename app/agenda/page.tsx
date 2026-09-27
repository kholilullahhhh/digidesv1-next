import { Calendar, Clock, MapPin, User } from 'lucide-react';
import { PublicLayout } from '@/components/layout/public-layout';
import { PageHeader } from '@/components/layout/page-header';
import { villageEvents } from '@/data/events';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDate, getDayOfMonth, getMonthShort } from '@/lib/format';

export default function AgendaPage() {
  const sorted = [...villageEvents].sort((a, b) => a.date.localeCompare(b.date));

  return (
    <PublicLayout>
      <PageHeader
        eyebrow="Kalender Kegiatan"
        title="Agenda Desa"
        description="Jadwal kegiatan dan agenda resmi Desa Sukamaju."
        breadcrumb={[{ label: 'Beranda', href: '/' }, { label: 'Agenda' }]}
      />

      <section className="py-12 lg:py-16">
        <div className="container-mx">
          <div className="relative max-w-3xl mx-auto">
            {/* Timeline line */}
            <div className="absolute left-6 sm:left-8 top-0 bottom-0 w-px bg-border" />

            <div className="space-y-6">
              {sorted.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-muted-foreground">Belum ada agenda yang dijadwalkan.</p>
                </div>
              ) : sorted.map((event) => (
                <div key={event.id} className="relative pl-16 sm:pl-20">
                  {/* Date node */}
                  <div className="absolute left-0 top-0 flex h-12 w-12 sm:h-16 sm:w-16 flex-col items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
                    <span className="text-lg sm:text-xl font-bold font-display leading-none">
                      {getDayOfMonth(event.date)}
                    </span>
                    <span className="text-[10px] uppercase">
                      {getMonthShort(event.date)}
                    </span>
                  </div>

                  <Card className="hover:shadow-md transition-all duration-300">
                    <CardContent className="p-5">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary">{event.category}</Badge>
                      </div>
                      <h3 className="font-display font-semibold text-lg text-foreground">{event.title}</h3>
                      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{event.description}</p>
                      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
                        <span className="inline-flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-primary" />
                          {formatDate(event.date)}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5 text-primary" />
                          {event.time}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5 text-primary" />
                          {event.location}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <User className="h-3.5 w-3.5 text-primary" />
                          {event.organizer}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
