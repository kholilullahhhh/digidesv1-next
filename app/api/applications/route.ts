import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { apiError, apiOk } from '@/lib/api';
import { applicationSchema } from '@/lib/validation';

function generateTrackingNumber(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(100000 + Math.random() * 900000);
  return `DSA-${year}-${random}`;
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body) return apiError('Permintaan tidak valid.');

  const parsed = applicationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        message: 'Data belum valid, periksa isian form.',
        errors: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  try {
    const service = await prisma.service.findUnique({
      where: { slug: parsed.data.serviceSlug },
    });
    if (!service) return apiError('Layanan tidak ditemukan.', 404);
    if (!service.isActive) return apiError('Layanan tersebut sedang tidak aktif.', 409);

    let application = null;
    for (let attempt = 0; attempt < 5 && !application; attempt += 1) {
      try {
        application = await prisma.application.create({
          data: {
            trackingNumber: generateTrackingNumber(),
            serviceId: service.id,
            applicantName: parsed.data.applicantName,
            phone: parsed.data.phone,
            email: parsed.data.email,
            address: parsed.data.address || null,
            notes: parsed.data.notes || null,
          },
        });
      } catch (error) {
        const code = (error as { code?: string }).code;
        if (code !== 'P2002') throw error;
      }
    }

    if (!application) {
      return apiError('Gagal membuat nomor pengajuan, coba lagi.', 500);
    }

    await prisma.applicationStatusHistory.create({
      data: {
        applicationId: application.id,
        status: 'SUBMITTED',
        note: 'Pengajuan diterima oleh sistem.',
      },
    });

    return apiOk({ item: { id: application.id, trackingNumber: application.trackingNumber } }, 201);
  } catch (error) {
    console.error('Gagal membuat pengajuan layanan:', error);
    return apiError('Gagal mengajukan layanan. Silakan coba lagi nanti.', 500);
  }
}
