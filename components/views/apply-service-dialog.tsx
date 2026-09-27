'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, Send } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { applicationSchema } from '@/lib/validation';

export interface ApplyServiceOption {
  slug: string;
  name: string;
  estimate: string;
  fee: string;
}

interface ApplyServiceDialogProps {
  services: ApplyServiceOption[];
  defaultSlug?: string;
  readOnly?: boolean;
  trigger: React.ReactNode;
}

type ApplicationForm = z.infer<typeof applicationSchema>;

interface ApplicationResponse {
  ok: boolean;
  message?: string;
  item?: { trackingNumber: string };
}

const selectClassName =
  'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50';

export function ApplyServiceDialog({
  services,
  defaultSlug,
  readOnly = false,
  trigger,
}: ApplyServiceDialogProps) {
  const [open, setOpen] = useState(false);
  const [apiMessage, setApiMessage] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');

  const initialValues: ApplicationForm = {
    serviceSlug: defaultSlug ?? services[0]?.slug ?? '',
    applicantName: '',
    phone: '',
    email: '',
    address: '',
    notes: '',
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ApplicationForm>({
    resolver: zodResolver(applicationSchema),
    defaultValues: initialValues,
  });

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      setApiMessage('');
      setTrackingNumber('');
      reset(initialValues);
    }
  };

  const onSubmit = async (values: ApplicationForm) => {
    setApiMessage('');
    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      const payload = (await res.json().catch(() => null)) as ApplicationResponse | null;
      if (!res.ok || !payload?.ok) {
        setApiMessage(payload?.message ?? 'Gagal mengirim pengajuan, coba lagi.');
        return;
      }
      setTrackingNumber(payload.item?.trackingNumber ?? '');
    } catch {
      setApiMessage('Gagal mengirim pengajuan, coba lagi.');
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Ajukan Layanan</DialogTitle>
          <DialogDescription>Isi formulir berikut untuk mengajukan layanan desa.</DialogDescription>
        </DialogHeader>

        {trackingNumber ? (
          <div className="space-y-4">
            <div className="flex items-start gap-2.5 rounded-lg border border-success/20 bg-success/10 p-4 text-sm text-success">
              <CheckCircle2 className="h-5 w-5 shrink-0" />
              <span>Pengajuan berhasil dikirim</span>
            </div>
            <div className="rounded-lg bg-muted p-4">
              <p className="text-xs text-muted-foreground">Nomor Pengajuan</p>
              <p className="mt-1 font-display font-semibold text-foreground">{trackingNumber}</p>
            </div>
            <Button asChild className="w-full">
              <Link href="/tracking">
                Lacak Pengajuan
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="serviceSlug">Layanan</Label>
              <select id="serviceSlug" {...register('serviceSlug')} disabled={readOnly} className={selectClassName}>
                {services.map((service) => (
                  <option key={service.slug} value={service.slug}>
                    {service.name}
                  </option>
                ))}
              </select>
              {errors.serviceSlug && (
                <p className="mt-1 text-xs text-destructive">{errors.serviceSlug.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="applicantName">Nama Pemohon</Label>
              <Input
                id="applicantName"
                placeholder="Masukkan nama Anda"
                {...register('applicantName')}
                className="mt-1.5"
              />
              {errors.applicantName && (
                <p className="mt-1 text-xs text-destructive">{errors.applicantName.message}</p>
              )}
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone">No. HP</Label>
                <Input
                  id="phone"
                  placeholder="08xx-xxxx-xxxx"
                  {...register('phone')}
                  className="mt-1.5"
                />
                {errors.phone && <p className="mt-1 text-xs text-destructive">{errors.phone.message}</p>}
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@contoh.com"
                  {...register('email')}
                  className="mt-1.5"
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="address">Alamat</Label>
              <Textarea
                id="address"
                rows={2}
                placeholder="Alamat lengkap (opsional)"
                {...register('address')}
                className="mt-1.5"
              />
              {errors.address && (
                <p className="mt-1 text-xs text-destructive">{errors.address.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="notes">Catatan</Label>
              <Textarea
                id="notes"
                rows={3}
                placeholder="Catatan tambahan (opsional)"
                {...register('notes')}
                className="mt-1.5"
              />
              {errors.notes && <p className="mt-1 text-xs text-destructive">{errors.notes.message}</p>}
            </div>

            {apiMessage && <p className="text-sm text-destructive">{apiMessage}</p>}

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Mengirim...' : 'Kirim Pengajuan'}
              <Send className="ml-2 h-4 w-4" />
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
