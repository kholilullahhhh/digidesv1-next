import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, MapPinned } from 'lucide-react';
import { villageProfile } from '@/data/profile';
import { villageStats } from '@/data/village';
import { Button } from '@/components/ui/button';
import { SectionHeading } from '@/components/layout/section-heading';

export function ProfilePreview() {
  return (
    <section className="py-16 lg:py-24">
      <div className="container-mx">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Image */}
          <div className="relative order-2 lg:order-1">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-lg">
              <Image
                src="https://images.pexels.com/photos/158028/bellingrath-gardens-alabama-architecture-scenic-158028.jpeg"
                alt="Pemandangan Desa Sukamaju"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-5 -right-5 hidden sm:block rounded-xl bg-primary text-primary-foreground p-5 shadow-lg">
              <p className="text-3xl font-bold font-display">{villageStats.dusun}</p>
              <p className="text-xs text-primary-foreground/80">Dusun di Desa Sukamaju</p>
            </div>
          </div>

          {/* Content */}
          <div className="order-1 lg:order-2">
            <SectionHeading
              eyebrow="Profil Desa"
              title="Kenali Desa Kami"
              align="left"
            />
            <p className="mt-4 text-muted-foreground leading-relaxed text-pretty">
              {villageProfile.history.slice(0, 320)}...
            </p>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="rounded-lg border bg-card p-4">
                <p className="text-xs text-muted-foreground">Visi</p>
                <p className="mt-1 text-sm font-medium text-foreground line-clamp-2">{villageProfile.vision}</p>
              </div>
              <div className="rounded-lg border bg-card p-4">
                <p className="text-xs text-muted-foreground">Luas Wilayah</p>
                <p className="mt-1 text-sm font-medium text-foreground">{villageProfile.area}</p>
              </div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Button asChild>
                <Link href="/profil">
                  Selengkapnya Tentang Desa
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/data-desa">
                  <MapPinned className="mr-2 h-4 w-4" />
                  Data Desa
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
