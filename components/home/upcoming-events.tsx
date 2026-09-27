import Link from 'next/link';
import { Calendar, Clock, MapPin, ArrowRight } from 'lucide-react';
import { villageEvents } from '@/data/events';
import { SectionHeading } from '@/components/layout/section-heading';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatDate, getDayOfMonth, getMonthShort } from '@/lib/format';

export function UpcomingEvents() {
  const upcoming = villageEvents.slice(0, 3);

  return (
    <section className="py-16 lg:py-24 bg-muted/40 border-y">
      <div className="container-mx">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10">
          <SectionHeading
            eyebrow="Agenda"
            title="Agenda Desa Terdekat"
            description="Jangan lewatkan kegiatan dan agenda penting di Desa Sukamaju."
            align="left"
            className="max-w-xl"
          />
          <Button asChild variant="outline" size="sm" className="shrink-0">
            <Link href="/agenda">
              Semua Agenda
              <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>

        <div className="grid gap-4">
          {upcoming.map((event) => (
            <Card key={event.id} className="hover:shadow-md transition-all duration-300">
              <CardContent className="p-5 flex flex-col sm:flex-row gap-4 sm:items-center">
                {/* Date block */}
                <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-xl bg-primary text-primary-foreground">
                  <span className="text-xl font-bold font-display leading-none">
                    {getDayOfMonth(event.date)}
                  </span>
                  <span className="text-[10px] uppercase">
                    {getMonthShort(event.date)}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="secondary" className="text-xs">{event.category}</Badge>
                  </div>
                  <h3 className="font-display font-semibold text-foreground">{event.title}</h3>
                  <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(event.date)}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {event.time}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {event.location}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
