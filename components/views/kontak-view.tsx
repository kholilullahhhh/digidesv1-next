'use client';

import { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PageHeader } from '@/components/layout/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import type { SiteConfigView } from '@/lib/site-view';

const contactSchema = z.object({
  name: z.string().min(3, 'Nama minimal 3 karakter'),
  email: z.string().email('Email tidak valid'),
  phone: z.string().min(8, 'Nomor HP tidak valid'),
  subject: z.string().min(3, 'Subjek minimal 3 karakter'),
  message: z.string().min(10, 'Pesan minimal 10 karakter'),
});

type ContactForm = z.infer<typeof contactSchema>;

interface KontakViewProps {
  site: SiteConfigView;
}

export function KontakView({ site }: KontakViewProps) {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset, setError: setFieldError } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
  });

  const contactInfo = [
    { icon: MapPin, label: 'Alamat', value: site.address },
    { icon: Phone, label: 'Telepon', value: site.phone },
    { icon: Mail, label: 'Email', value: site.email },
    { icon: Clock, label: 'Jam Pelayanan', value: site.hours },
  ];

  const { lat, lng } = site.coordinates;
  const mapSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.01},${lat - 0.008},${lng + 0.01},${lat + 0.008}&layer=mapnik&marker=${lat},${lng}`;

  const onSubmit = async (data: ContactForm) => {
    setError('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const payload = await res.json();
      if (!res.ok) {
        const fieldErrors = payload?.errors as Record<string, string[]> | undefined;
        if (fieldErrors) {
          Object.entries(fieldErrors).forEach(([field, messages]) => {
            if (messages && messages.length && field in contactSchema.shape) {
              setFieldError(field as keyof ContactForm, { type: 'server', message: messages[0] });
            }
          });
        }
        setError(payload?.message || 'Gagal mengirim pesan, coba lagi.');
        return;
      }
      setSubmitted(true);
      reset();
      setTimeout(() => setSubmitted(false), 5000);
    } catch {
      setError('Gagal mengirim pesan, coba lagi.');
    }
  };

  return (
    <>
      <PageHeader
        eyebrow="Hubungi Kami"
        title="Kontak Pemerintah Desa"
        description="Sampaikan pertanyaan, aspirasi, atau keluhan Anda kepada Pemerintah Desa Sukamaju."
        breadcrumb={[{ label: 'Beranda', href: '/' }, { label: 'Kontak' }]}
      />

      <section className="py-12 lg:py-16">
        <div className="container-mx">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Contact info + map */}
            <div className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                {contactInfo.map((info) => (
                  <Card key={info.label}>
                    <CardContent className="p-5">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary mb-3">
                        <info.icon className="h-5 w-5" />
                      </div>
                      <p className="text-xs text-muted-foreground mb-1">{info.label}</p>
                      <p className="text-sm font-medium text-foreground leading-snug">{info.value}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="rounded-2xl border overflow-hidden min-h-[300px]">
                <iframe
                  src={mapSrc}
                  title="Peta Lokasi Kantor Desa"
                  className="w-full h-full min-h-[300px]"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>

            {/* Contact form */}
            <Card>
              <CardContent className="p-6 lg:p-8">
                <h2 className="font-display text-xl font-bold mb-1">Kirim Pesan</h2>
                <p className="text-sm text-muted-foreground mb-6">Isi formulir di bawah ini dan kami akan menghubungi Anda.</p>

                {submitted && (
                  <div className="mb-6 flex items-center gap-2.5 rounded-lg bg-success/10 border border-success/20 p-4 text-sm text-success">
                    <CheckCircle2 className="h-5 w-5" />
                    <span>Pesan Anda telah terkirim. Terima kasih telah menghubungi kami.</span>
                  </div>
                )}

                {error && (
                  <div className="mb-6 flex items-center gap-2.5 rounded-lg bg-destructive/10 border border-destructive/20 p-4 text-sm text-destructive">
                    <AlertCircle className="h-5 w-5" />
                    <span>{error}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nama Lengkap</Label>
                    <Input id="name" placeholder="Masukkan nama Anda" {...register('name')} className="mt-1.5" />
                    {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name.message}</p>}
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="email@contoh.com" {...register('email')} className="mt-1.5" />
                      {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>}
                    </div>
                    <div>
                      <Label htmlFor="phone">Nomor HP</Label>
                      <Input id="phone" placeholder="08xx-xxxx-xxxx" {...register('phone')} className="mt-1.5" />
                      {errors.phone && <p className="mt-1 text-xs text-destructive">{errors.phone.message}</p>}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="subject">Subjek</Label>
                    <Input id="subject" placeholder="Subjek pesan" {...register('subject')} className="mt-1.5" />
                    {errors.subject && <p className="mt-1 text-xs text-destructive">{errors.subject.message}</p>}
                  </div>

                  <div>
                    <Label htmlFor="message">Pesan</Label>
                    <Textarea id="message" rows={5} placeholder="Tulis pesan Anda..." {...register('message')} className="mt-1.5" />
                    {errors.message && <p className="mt-1 text-xs text-destructive">{errors.message.message}</p>}
                  </div>

                  <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? 'Mengirim...' : 'Kirim Pesan'}
                    <Send className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
}
