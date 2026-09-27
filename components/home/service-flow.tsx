import { MousePointerClick, FileText, ClipboardCheck, CheckCircle2 } from 'lucide-react';
import { SectionHeading } from '@/components/layout/section-heading';

const steps = [
  { num: '01', icon: MousePointerClick, title: 'Pilih Layanan', desc: 'Pilih jenis layanan administrasi yang Anda butuhkan dari daftar layanan desa.' },
  { num: '02', icon: FileText, title: 'Isi Formulir', desc: 'Lengkapi formulir pengajuan online dan unggah dokumen yang diperlukan.' },
  { num: '03', icon: ClipboardCheck, title: 'Verifikasi', desc: 'Petugas desa akan memverifikasi dokumen dan data pengajuan Anda.' },
  { num: '04', icon: CheckCircle2, title: 'Dokumen Selesai', desc: 'Dokumen siap diambil di kantor desa atau dapat diunduh secara digital.' },
];

export function ServiceFlow() {
  return (
    <section className="py-16 lg:py-24">
      <div className="container-mx">
        <SectionHeading
          eyebrow="Alur Pelayanan"
          title="Pelayanan Desa Kini Lebih Mudah"
          description="Masyarakat dapat mengajukan layanan secara online dan memantau status pengajuan setiap saat."
        />

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <div key={step.num} className="relative group">
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-[60%] w-[80%] h-px border-t-2 border-dashed border-border" />
              )}
              <div className="relative bg-card border rounded-xl p-6 text-center group-hover:shadow-md transition-all duration-300 group-hover:-translate-y-1">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-4 relative">
                  <step.icon className="h-7 w-7" />
                  <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-accent text-accent-foreground text-xs font-bold">
                    {step.num}
                  </span>
                </div>
                <h3 className="font-display font-semibold text-foreground">{step.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
