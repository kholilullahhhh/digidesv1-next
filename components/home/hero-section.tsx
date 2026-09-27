import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, MapPin, Users, Home, Ruler, BadgeCheck } from 'lucide-react';
import { siteConfig } from '@/config/site';
import { villageStats } from '@/data/village';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const heroStats = [
  { icon: Users, label: 'Populasi', value: villageStats.population.toLocaleString('id-ID') },
  { icon: Home, label: 'Dusun', value: villageStats.dusun },
  { icon: MapPin, label: 'RT/RW', value: `${villageStats.rt}/${villageStats.rw}` },
  { icon: Ruler, label: 'Luas Wilayah', value: `${villageStats.area} km²` },
];

export function HeroSection() {
  return (
    <section className="relative -mt-16 pt-16 min-h-[88vh] flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="https://images.pexels.com/photos/1684010/pexels-photo-1684010.jpeg"
          alt="Pemandangan desa Sukamaju"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/85 via-foreground/70 to-foreground/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent" />
      </div>

      <div className="container-mx w-full py-20 lg:py-28">
        <div className="max-w-2xl">
          <Badge className="mb-5 bg-primary/90 text-primary-foreground border-transparent backdrop-blur-sm animate-fade-in">
            <BadgeCheck className="h-3.5 w-3.5 mr-1.5" />
            Website Resmi Pemerintah Desa
          </Badge>

          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight text-balance animate-fade-up">
            Selamat Datang di Desa {siteConfig.village}
          </h1>

          <p className="mt-5 text-base sm:text-lg text-white/85 leading-relaxed max-w-xl text-pretty animate-fade-up" style={{ animationDelay: '0.1s' }}>
            Portal digital resmi untuk mendapatkan informasi, pelayanan publik, dan berbagai potensi Desa {siteConfig.village}, {siteConfig.regency}, {siteConfig.province}.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3 animate-fade-up" style={{ animationDelay: '0.2s' }}>
            <Button asChild size="lg">
              <Link href="/layanan">
                Lihat Layanan
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:text-white">
              <Link href="/profil">
                Jelajahi Desa
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-xl animate-fade-up" style={{ animationDelay: '0.3s' }}>
            {heroStats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl bg-white/10 backdrop-blur-md border border-white/15 px-4 py-3"
              >
                <stat.icon className="h-4 w-4 text-accent mb-1.5" />
                <p className="text-xl font-bold text-white font-display">{stat.value}</p>
                <p className="text-xs text-white/70">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom curve */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-background" style={{ clipPath: 'polygon(0 100%, 100% 100%, 100% 0)' }} />
    </section>
  );
}
