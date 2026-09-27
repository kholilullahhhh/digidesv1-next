import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { apiError, apiOk } from '@/lib/api';
import { contactSchema } from '@/lib/validation';

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body) return apiError('Permintaan tidak valid.');

  const parsed = contactSchema.safeParse(body);
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
    const message = await prisma.contactMessage.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        phone: parsed.data.phone,
        subject: parsed.data.subject,
        message: parsed.data.message,
      },
    });
    return apiOk({ item: { id: message.id } }, 201);
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: error instanceof Error ? error.message : 'Gagal mengirim pesan.' },
      { status: 500 },
    );
  }
}
