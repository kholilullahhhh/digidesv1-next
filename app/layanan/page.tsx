import Link from 'next/link';
import { ArrowRight, Clock, Wallet, FileText } from 'lucide-react';
import { PublicLayout } from '@/components/layout/public-layout';
import { PageHeader } from '@/components/layout/page-header';
import { getServices } from '@/lib/queries';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ApplyServiceDialog, type ApplyServiceOption } from '@/components/views/apply-service-dialog';

export const dynamic = 'force-dynamic';

export default async function LayananPage() {
  const services = await getServices();
  const serviceOptions: ApplyServiceOption[] = services.map((service) => ({
    slug: service.slug,
    name: service.name,
    estimate: service.estimate,
    fee: service.fee,
  }));

  return (
    <PublicLayout>
      <PageHeader
        eyebrow="Pelayanan Publik"
        title="Layanan Desa"
        description="Berbagai layanan administrasi yang dapat diajukan secara online maupun langsung di kantor desa."
        breadcrumb={[{ label: 'Beranda', href: '/' }, { label: 'Layanan' }]}
      />

      <section className="py-12 lg:py-16">
        <div className="container-mx">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <Card key={service.slug} className="group flex flex-col hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
                <CardContent className="p-5 flex-1">
                  <div className="flex items-start gap-3.5">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <service.icon className="h-6 w-6" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-foreground leading-snug">{service.name}</h3>
                      <p className="mt-1 text-sm text-muted-foreground line-clamp-2 leading-relaxed">{service.description}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-3 text-xs">
                    <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                      <Clock className="h-3.5 w-3.5 text-primary" />
                      {service.estimate}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                      <Wallet className="h-3.5 w-3.5 text-primary" />
                      {service.fee}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                      <FileText className="h-3.5 w-3.5 text-primary" />
                      {service.documents.length} dokumen
                    </span>
                  </div>
                </CardContent>
                <CardFooter className="p-5 pt-0 flex items-center gap-2">
                  <ApplyServiceDialog
                    services={serviceOptions}
                    defaultSlug={service.slug}
                    trigger={
                      <Button size="sm" className="flex-1">
                        Ajukan Layanan
                        <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                      </Button>
                    }
                  />
                  <Button asChild size="sm" variant="outline">
                    <Link href={`/layanan/${service.slug}`}>
                      Detail
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
