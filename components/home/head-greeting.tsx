import Image from 'next/image';
import { Quote } from 'lucide-react';
import { villageProfile } from '@/data/profile';

export function HeadGreeting() {
  return (
    <section className="py-16 lg:py-24 bg-muted/40 border-y">
      <div className="container-mx">
        <div className="grid lg:grid-cols-12 gap-10 items-center">
          {/* Photo */}
          <div className="lg:col-span-4">
            <div className="relative mx-auto max-w-sm">
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-lg">
                <Image
                  src={villageProfile.headOfVillage.photo}
                  alt={villageProfile.headOfVillage.name}
                  fill
                  sizes="(max-width: 1024px) 80vw, 33vw"
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-[85%] rounded-xl bg-primary text-primary-foreground px-4 py-3 text-center shadow-lg">
                <p className="font-display font-bold text-sm">{villageProfile.headOfVillage.name}</p>
                <p className="text-xs text-primary-foreground/80">{villageProfile.headOfVillage.position}</p>
              </div>
            </div>
          </div>

          {/* Greeting */}
          <div className="lg:col-span-8 lg:pl-6">
            <div className="flex items-center gap-2 mb-4">
              <Quote className="h-5 w-5 text-accent" />
              <span className="text-xs font-semibold uppercase tracking-wider text-primary">Sambutan Kepala Desa</span>
            </div>
            <div className="space-y-4 text-muted-foreground leading-relaxed text-pretty">
              {villageProfile.headOfVillage.greeting.split('\n\n').map((para, i) => (
                <p key={i} className={i === 0 ? 'text-foreground font-medium text-lg' : ''}>
                  {para}
                </p>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t">
              <p className="font-display font-bold text-foreground">{villageProfile.headOfVillage.name}</p>
              <p className="text-sm text-muted-foreground">{villageProfile.headOfVillage.position} — Periode {villageProfile.headOfVillage.period}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
