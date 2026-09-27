import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { apiError, apiOk, audit, revalidatePublic, requireApiRole } from '@/lib/api';
import { settingsSchema } from '@/lib/validation';

const DEFAULTS = {
  name: 'Sukamaju',
  district: 'Bontonompo',
  regency: 'Gowa',
  province: 'Sulawesi Selatan',
  postalCode: '92172',
  address: '',
  phone: '',
  email: '',
  hours: '',
  description: '',
  logoUrl: '',
  headPhotoUrl: '',
  lat: 0,
  lng: 0,
  history: '',
  vision: '',
  missions: [] as string[],
  borderNorth: '',
  borderSouth: '',
  borderEast: '',
  borderWest: '',
  headOfVillageName: '',
  headOfVillagePosition: '',
  headOfVillagePeriod: '',
  headOfVillageGreeting: '',
  siteName: '',
  shortName: '',
  tagline: '',
  siteDescription: '',
  facebook: '',
  instagram: '',
  youtube: '',
  ogImageUrl: '',
  footerNote: '',
};

export async function GET() {
  const auth = await requireApiRole(['ADMIN']);
  if (!auth.ok) return auth.response;

  try {
    const [village, settings] = await Promise.all([
      prisma.village.findUnique({ where: { id: 'village' } }),
      prisma.siteSetting.findUnique({ where: { id: 'site' } }),
    ]);
    return apiOk({
      item: {
        ...DEFAULTS,
        ...(village
          ? {
              name: village.name,
              district: village.district,
              regency: village.regency,
              province: village.province,
              postalCode: village.postalCode,
              address: village.address,
              phone: village.phone,
              email: village.email,
              hours: village.hours,
              description: village.description,
              logoUrl: village.logoUrl ?? '',
              headPhotoUrl: village.headPhotoUrl ?? '',
              lat: village.lat,
              lng: village.lng,
              history: village.history ?? '',
              vision: village.vision ?? '',
              missions: village.missions,
              borderNorth: village.borderNorth,
              borderSouth: village.borderSouth,
              borderEast: village.borderEast,
              borderWest: village.borderWest,
              headOfVillageName: village.headOfVillageName,
              headOfVillagePosition: village.headOfVillagePosition,
              headOfVillagePeriod: village.headOfVillagePeriod,
              headOfVillageGreeting: village.headOfVillageGreeting,
            }
          : {}),
        ...(settings
          ? {
              siteName: settings.siteName,
              shortName: settings.shortName,
              tagline: settings.tagline,
              siteDescription: settings.description,
              facebook: settings.facebook,
              instagram: settings.instagram,
              youtube: settings.youtube,
              ogImageUrl: settings.ogImageUrl,
              footerNote: settings.footerNote,
            }
          : {}),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: error instanceof Error ? error.message : 'Gagal memuat pengaturan.' },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request) {
  const auth = await requireApiRole(['ADMIN']);
  if (!auth.ok) return auth.response;

  const body = await request.json().catch(() => null);
  if (!body) return apiError('Permintaan tidak valid.');

  const parsed = settingsSchema.safeParse(body);
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

  const data = parsed.data;

  try {
    const villageData = {
      name: data.name,
      district: data.district,
      regency: data.regency,
      province: data.province,
      postalCode: data.postalCode,
      address: data.address,
      phone: data.phone,
      email: data.email,
      hours: data.hours,
      description: data.description,
      logoUrl: data.logoUrl || null,
      headPhotoUrl: data.headPhotoUrl || null,
      lat: data.lat,
      lng: data.lng,
      history: data.history || null,
      vision: data.vision,
      missions: data.missions,
      borderNorth: data.borderNorth,
      borderSouth: data.borderSouth,
      borderEast: data.borderEast,
      borderWest: data.borderWest,
      headOfVillageName: data.headOfVillageName,
      headOfVillagePosition: data.headOfVillagePosition,
      headOfVillagePeriod: data.headOfVillagePeriod,
      headOfVillageGreeting: data.headOfVillageGreeting,
    };

    const siteData = {
      siteName: data.siteName,
      shortName: data.shortName,
      tagline: data.tagline,
      description: data.siteDescription,
      facebook: data.facebook,
      instagram: data.instagram,
      youtube: data.youtube,
      ogImageUrl: data.ogImageUrl,
      footerNote: data.footerNote,
    };

    await prisma.village.upsert({
      where: { id: 'village' },
      update: villageData,
      create: { id: 'village', ...villageData },
    });
    await prisma.siteSetting.upsert({
      where: { id: 'site' },
      update: siteData,
      create: { id: 'site', ...siteData },
    });

    await audit(auth.user.id, 'UPDATE', 'Pengaturan Situs', 'site');
    await revalidatePublic();
    return apiOk();
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: error instanceof Error ? error.message : 'Gagal menyimpan pengaturan.' },
      { status: 500 },
    );
  }
}
