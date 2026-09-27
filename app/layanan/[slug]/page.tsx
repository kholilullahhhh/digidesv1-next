import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { ArrowLeft, Clock, Wallet, FileText, CheckCircle2, ListChecks, ArrowRight } from 'lucide-react';
import { PublicLayout } from '@/components/layout/public-layout';
import { getServices } from '@/lib/queries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ApplyServiceDialog, type ApplyServiceOption } from '@/components/views/apply-service-dialog';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const service = (await getServices()).find((s) => s.slug === params.slug);
  if (!service) return {};
  return { title: service.name, description: service.description };
}

export default async function LayananDetailPage({ params }: { params: { slug: string } }) {
  const services = await getServices();
  const service = services.find((s) => s.slug === params.slug);
  if (!service) notFound();

  const serviceOptions: ApplyServiceOption[] = services.map((item) => ({
    slug: item.slug,
    name: item.name,
    estimate: item.estimate,
    fee: item.fee,
  }));

  return (
    <PublicLayout>
      <section className="border-b bg-muted/30">
        <div className="container-mx py-10 lg:py-14">
          <Link href="/layanan" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors mb-4">
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Daftar Layanan
          </Link>
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
              <service.icon className="h-7 w-7" />
            </div>
            <div>
              <h1 className="font-display text-2xl lg:text-3xl font-bold">{service.name}</h1>
              <p className="mt-2 text-muted-foreground max-w-2xl">{service.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Badge variant="secondary" className="gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  Estimasi: {service.estimate}
                </Badge>
                <Badge variant="secondary" className="gap-1.5">
                  <Wallet className="h-3.5 w-3.5" />
                  Biaya: {service.fee}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 lg:py-16">
        <div className="container-mx">
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <ListChecks className="h-5 w-5 text-primary" />
                    Persyaratan
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2.5">
                    {service.requirements.map((req, i) => (
                      <li key={i} className="flex gap-2.5 text-sm">
                        <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5 text-success" />
                        <span className="text-muted-foreground">{req}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <FileText className="h-5 w-5 text-primary" />
                    Prosedur Pengajuan
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className="space-y-4">
                    {service.procedure.map((step, i) => (
                      <li key={i} className="flex gap-3">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                          {i + 1}
                        </span>
                        <span className="text-sm text-muted-foreground leading-relaxed pt-1">{step}</span>
                      </li>
                    ))}
                  </ol>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="sticky top-20">
                <CardContent className="p-6">
                  <h3 className="font-display font-semibold mb-4">Dokumen Diperlukan</h3>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {service.documents.map((doc, index) => (
                      <Badge key={`${index}-${doc}`} variant="outline" className="gap-1.5">
                        <FileText className="h-3.5 w-3.5" />
                        {doc}
                      </Badge>
                    ))}
                  </div>
                  <div className="rounded-lg bg-muted p-4 mb-6 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Estimasi Waktu</span>
                      <span className="font-medium">{service.estimate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Biaya</span>
                      <span className="font-medium">{service.fee}</span>
                    </div>
                  </div>
                  <ApplyServiceDialog
                    services={serviceOptions}
                    defaultSlug={service.slug}
                    readOnly
                    trigger={
                      <Button className="w-full">
                        Ajukan Layanan Ini
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    }
                  />
                  <Button asChild variant="outline" className="w-full mt-2">
                    <Link href="/tracking">Lacak Pengajuan</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
