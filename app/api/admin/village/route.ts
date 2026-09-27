import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { apiError, apiOk, audit, revalidatePublic, requireApiRole } from '@/lib/api';
import { villageSchema } from '@/lib/validation';

export async function GET() {
  const auth = await requireApiRole(['ADMIN']);
  if (!auth.ok) return auth.response;

  try {
    const village = await prisma.village.findUnique({ where: { id: 'village' } });
    if (!village) return apiError('Data desa belum tersedia. Jalankan npm run db:seed.', 404);
    return apiOk({
      item: {
        ...village,
        ageGroups: village.ageGroups ?? [],
        educationLevels: village.educationLevels ?? [],
        jobCategories: village.jobCategories ?? [],
      },
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: error instanceof Error ? error.message : 'Gagal memuat data.' },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request) {
  const auth = await requireApiRole(['ADMIN']);
  if (!auth.ok) return auth.response;

  const body = await request.json().catch(() => null);
  if (!body) return apiError('Permintaan tidak valid.');

  const parsed = villageSchema.safeParse(body);
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
    const demographics = {
      population: parsed.data.population,
      malePopulation: parsed.data.malePopulation,
      femalePopulation: parsed.data.femalePopulation,
      families: parsed.data.families,
      dusun: parsed.data.dusun,
      rt: parsed.data.rt,
      rw: parsed.data.rw,
      area: parsed.data.area,
      density: parsed.data.density,
      dusunNames: parsed.data.dusunNames,
      ageGroups: parsed.data.ageGroups as unknown as object,
      educationLevels: parsed.data.educationLevels as unknown as object,
      jobCategories: parsed.data.jobCategories as unknown as object,
    };
    const village = await prisma.village.upsert({
      where: { id: 'village' },
      update: demographics,
      create: {
        id: 'village',
        address: 'Belum diisi',
        phone: '-',
        email: 'admin@desasukamaju.id',
        hours: '-',
        description: 'Deskripsi desa belum diisi.',
        ...demographics,
      },
    });
    await audit(auth.user.id, 'UPDATE', 'Data Desa', village.id);
    await revalidatePublic();
    return apiOk({ item: village });
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: error instanceof Error ? error.message : 'Gagal menyimpan data.' },
      { status: 500 },
    );
  }
}
