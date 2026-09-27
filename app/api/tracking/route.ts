import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { apiError, apiOk } from '@/lib/api';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const trackingNumber = url.searchParams.get('trackingNumber')?.trim() ?? '';
  if (trackingNumber.length < 4) {
    return NextResponse.json({ ok: false, message: 'Masukkan nomor pengajuan.' }, { status: 400 });
  }

  try {
    const application = await prisma.application.findFirst({
      where: { trackingNumber: { equals: trackingNumber, mode: 'insensitive' } },
      include: {
        service: { select: { name: true, slug: true, estimate: true, fee: true } },
        histories: { orderBy: { createdAt: 'asc' } },
      },
    });

    if (!application) {
      return NextResponse.json(
        {
          ok: false,
          message: 'Nomor pengajuan tidak ditemukan. Periksa kembali nomor Anda.',
        },
        { status: 404 },
      );
    }

    return apiOk({
      item: {
        trackingNumber: application.trackingNumber,
        applicantName: application.applicantName,
        status: application.status,
        serviceName: application.service.name,
        serviceEstimate: application.service.estimate,
        createdAt: application.createdAt,
        histories: application.histories,
      },
    });
  } catch (error) {
    console.error('Gagal memuat status pengajuan:', error);
    return apiError('Gagal memuat status. Silakan coba lagi nanti.', 500);
  }
}
