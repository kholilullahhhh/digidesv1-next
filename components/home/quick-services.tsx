import Link from 'next/link';
import { ArrowRight, Clock } from 'lucide-react';
import { SectionHeading } from '@/components/layout/section-heading';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { ServiceView } from '@/lib/queries';

interface QuickServicesProps {
  services: ServiceView[];
}

export function QuickServices({ services }: QuickServicesProps) {
  const featured = services.slice(0, 6);

  return (
    <section className="py-16 lg:py-24">
      <div className="container-mx">
        <SectionHeading
          eyebrow="Pelayanan Cepat"
          title="Layanan Desa"
          description="Urus kebutuhan administrasi desa dengan lebih mudah dan transparan."
        />

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((service) => (
            <Card key={service.slug} className="group hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
              <CardContent className="p-5">
                <div className="flex items-start gap-3.5">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <service.icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-foreground leading-snug">{service.name}</h3>
                    <p className="mt-1 text-sm text-muted-foreground line-clamp-2 leading-relaxed">{service.description}</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-5 pt-0 flex items-center justify-between border-t border-border/50 mt-3 pt-3">
                <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" />
                  {service.estimate}
                </span>
                <Button asChild size="sm" variant="ghost" className="text-primary hover:text-primary">
                  <Link href={`/layanan/${service.slug}`}>
                    Ajukan
                    <ArrowRight className="ml-1 h-3.5 w-3.5" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Button asChild variant="outline" size="lg">
            <Link href="/layanan">
              Lihat Semua Layanan
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
