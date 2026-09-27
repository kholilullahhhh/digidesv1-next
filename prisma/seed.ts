import { PrismaClient, OfficialCategory, ProjectStatus, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';
import {
  FileText,
  Store,
  ClipboardList,
  HeartHandshake,
  Baby,
  HeartPulse,
  Heart,
  Users,
} from 'lucide-react';

import { newsArticles, newsCategories } from '../data/news';
import { services } from '../data/services';
import { villageEvents } from '../data/events';
import { announcements } from '../data/announcements';
import { potentials } from '../data/potentials';
import { umkms } from '../data/umkm';
import { galleryItems } from '../data/gallery';
import { villageOfficials } from '../data/officials';
import { budgetYears, developmentProjects } from '../data/transparency';
import { villageStats, ageGroups, educationLevels, jobCategories } from '../data/village';
import { villageProfile } from '../data/profile';
import { siteConfig } from '../config/site';

const prisma = new PrismaClient();

const ICON_BY_COMPONENT = new Map<unknown, string>([
  [FileText, 'FileText'],
  [Store, 'Store'],
  [ClipboardList, 'ClipboardList'],
  [HeartHandshake, 'HeartHandshake'],
  [Baby, 'Baby'],
  [HeartPulse, 'HeartPulse'],
  [Heart, 'Heart'],
  [Users, 'Users'],
]);

const OFFICIAL_CATEGORY: Record<string, OfficialCategory> = {
  kepala_desa: 'HEAD',
  sekretariat: 'SECRETARY',
  kaur: 'KAUR',
  kasi: 'KASI',
  kadus: 'KADUS',
};

const PROJECT_STATUS: Record<string, ProjectStatus> = {
  PERENCANAAN: 'PLANNING',
  BERJALAN: 'IN_PROGRESS',
  SELESAI: 'COMPLETED',
};

function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

function d(value: string): Date {
  return new Date(`${value}T00:00:00.000Z`);
}

/** Isi hanya jika tabel masih kosong, agar aman dijalankan berulang tanpa menghapus konten admin. */
async function seedIfEmpty(
  label: string,
  count: () => Promise<number>,
  run: () => Promise<void>,
) {
  const existing = await count();
  if (existing > 0) {
    console.log(`- ${label}: dilewati (${existing} data sudah ada)`);
    return;
  }
  await run();
  console.log(`- ${label}: diisi`);
}

async function main() {
  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? 'admin@desasukamaju.id';
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? 'admin-sukamaju-2026';
  const passwordHash = await bcrypt.hash(adminPassword, 10);

  console.log('Seed database ...');

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { role: Role.ADMIN, isActive: true },
    create: {
      email: adminEmail,
      name: 'Administrator Desa',
      password: passwordHash,
      role: Role.ADMIN,
    },
  });
  console.log(`- admin: ${adminEmail}`);

  await prisma.user.upsert({
    where: { email: 'staff@desasukamaju.id' },
    update: { role: Role.STAFF, isActive: true },
    create: {
      email: 'staff@desasukamaju.id',
      name: 'Petugas Pelayanan',
      password: passwordHash,
      role: Role.STAFF,
    },
  });
  console.log('- staff: staff@desasukamaju.id');

  await prisma.village.upsert({
    where: { id: 'village' },
    update: {},
    create: {
      id: 'village',
      name: siteConfig.village,
      district: siteConfig.district,
      regency: siteConfig.regency,
      province: siteConfig.province,
      postalCode: siteConfig.postalCode,
      address: siteConfig.address,
      phone: siteConfig.phone,
      email: siteConfig.email,
      hours: siteConfig.hours,
      description: siteConfig.description,
      lat: siteConfig.coordinates.lat,
      lng: siteConfig.coordinates.lng,
      headPhotoUrl: villageProfile.headOfVillage.photo,
      history: villageProfile.history,
      vision: villageProfile.vision,
      missions: villageProfile.missions,
      borderNorth: villageProfile.borders.north,
      borderSouth: villageProfile.borders.south,
      borderEast: villageProfile.borders.east,
      borderWest: villageProfile.borders.west,
      headOfVillageName: villageProfile.headOfVillage.name,
      headOfVillagePosition: villageProfile.headOfVillage.position,
      headOfVillagePeriod: villageProfile.headOfVillage.period,
      headOfVillageGreeting: villageProfile.headOfVillage.greeting,
      population: villageStats.population,
      malePopulation: villageStats.malePopulation,
      femalePopulation: villageStats.femalePopulation,
      families: villageStats.families,
      dusun: villageStats.dusun,
      rt: villageStats.rt,
      rw: villageStats.rw,
      area: villageStats.area,
      density: villageStats.density,
      dusunNames: villageStats.villages,
      ageGroups: ageGroups as object,
      educationLevels: educationLevels as object,
      jobCategories: jobCategories as object,
    },
  });
  console.log('- profil desa');

  await prisma.siteSetting.upsert({
    where: { id: 'site' },
    update: {},
    create: {
      id: 'site',
      siteName: siteConfig.name,
      shortName: siteConfig.shortName,
      tagline: siteConfig.tagline,
      description: siteConfig.description,
      facebook: siteConfig.social.facebook,
      instagram: siteConfig.social.instagram,
      youtube: siteConfig.social.youtube,
      ogImageUrl: 'https://images.pexels.com/photos/20967/pexels-photo.jpg',
      footerNote: `© 2026 Pemerintah Desa ${siteConfig.village}. Hak cipta dilindungi.`,
    },
  });
  console.log('- pengaturan situs');

  await seedIfEmpty(
    'kategori berita',
    () => prisma.newsCategory.count(),
    async () => {
      for (let i = 0; i < newsCategories.length; i += 1) {
        const name = newsCategories[i];
        await prisma.newsCategory.create({ data: { name, slug: slugify(name), order: i } });
      }
    },
  );

  await seedIfEmpty('berita', () => prisma.news.count(), async () => {
    const categories = await prisma.newsCategory.findMany();
    const byName = new Map(categories.map((c) => [c.name, c.id]));
    for (const article of newsArticles) {
      const categoryId = byName.get(article.category) ?? categories[0]?.id;
      if (!categoryId) throw new Error('Kategori berita belum tersedia');
      await prisma.news.create({
        data: {
          title: article.title,
          slug: article.slug,
          excerpt: article.excerpt,
          content: article.content,
          categoryId,
          author: article.author,
          publishedAt: d(article.date),
          readTime: article.readTime,
          thumbnail: article.thumbnail,
          featured: article.featured ?? false,
          status: 'PUBLISHED',
        },
      });
    }
  });

  await seedIfEmpty('layanan', () => prisma.service.count(), async () => {
    for (let i = 0; i < services.length; i += 1) {
      const service = services[i];
      await prisma.service.create({
        data: {
          name: service.name,
          slug: service.slug,
          description: service.description,
          icon: ICON_BY_COMPONENT.get(service.icon) ?? 'FileText',
          estimate: service.estimate,
          fee: service.fee,
          procedure: service.procedure,
          documents: service.documents,
          order: i,
          requirements: {
            create: service.requirements.map((text: string, order: number) => ({ text, order })),
          },
        },
      });
    }
  });

  await seedIfEmpty('perangkat desa', () => prisma.villageOfficial.count(), async () => {
    for (const official of villageOfficials) {
      await prisma.villageOfficial.create({
        data: {
          name: official.name,
          position: official.position,
          category: OFFICIAL_CATEGORY[official.category] ?? 'KASI',
          photo: official.photo,
          nip: official.nip && official.nip !== '—' ? official.nip : null,
          phone: official.phone ?? null,
          order: official.order,
        },
      });
    }
  });

  await seedIfEmpty('agenda', () => prisma.event.count(), async () => {
    for (const event of villageEvents) {
      await prisma.event.create({
        data: {
          title: event.title,
          description: event.description,
          date: d(event.date),
          time: event.time,
          location: event.location,
          organizer: event.organizer,
          category: event.category,
        },
      });
    }
  });

  await seedIfEmpty('pengumuman', () => prisma.announcement.count(), async () => {
    for (const item of announcements) {
      await prisma.announcement.create({
        data: {
          title: item.title,
          content: item.content,
          date: d(item.date),
          category: item.category,
          important: item.important ?? false,
          isActive: true,
        },
      });
    }
  });

  await seedIfEmpty('potensi desa', () => prisma.villagePotential.count(), async () => {
    for (const item of potentials) {
      await prisma.villagePotential.create({
        data: {
          name: item.name,
          category: item.category,
          description: item.description,
          location: item.location,
          contact: item.contact ?? null,
          image: item.image,
        },
      });
    }
  });

  await seedIfEmpty('umkm', () => prisma.umkm.count(), async () => {
    for (const item of umkms) {
      await prisma.umkm.create({
        data: {
          name: item.name,
          owner: item.owner,
          category: item.category,
          product: item.product,
          location: item.location,
          contact: item.contact,
          image: item.image,
          description: item.description,
        },
      });
    }
  });

  await seedIfEmpty('pembangunan', () => prisma.developmentProject.count(), async () => {
    for (const project of developmentProjects) {
      await prisma.developmentProject.create({
        data: {
          name: project.name,
          location: project.location,
          year: project.year,
          budget: project.budget,
          source: project.source,
          progress: project.progress,
          status: PROJECT_STATUS[project.status] ?? 'PLANNING',
        },
      });
    }
  });

  await seedIfEmpty('transparansi', () => prisma.budgetReport.count(), async () => {
    for (const budget of budgetYears) {
      await prisma.budgetReport.create({
        data: {
          year: budget.year,
          income: budget.income as unknown as object,
          expenditure: budget.expenditure as unknown as object,
        },
      });
    }
  });

  await seedIfEmpty('galeri', () => prisma.gallery.count(), async () => {
    for (const item of galleryItems) {
      await prisma.gallery.create({
        data: {
          title: item.title,
          image: item.image,
          category: item.category,
          caption: item.caption,
          date: d(item.date),
        },
      });
    }
  });

  await seedIfEmpty('contoh pengajuan', () => prisma.application.count(), async () => {
    const domisili = await prisma.service.findUnique({
      where: { slug: 'surat-keterangan-domisili' },
    });
    const nikah = await prisma.service.findUnique({ where: { slug: 'surat-pengantar-nikah' } });
    if (!domisili || !nikah) return;

    await prisma.application.create({
      data: {
        trackingNumber: 'DSA-2026-000123',
        serviceId: domisili.id,
        applicantName: 'Warga Contoh Satu',
        phone: '0812-0000-0001',
        email: 'warga1@example.test',
        address: 'Dusun Tengah, Desa Sukamaju',
        status: 'PROCESSING',
        histories: {
          create: [
            {
              status: 'SUBMITTED',
              note: 'Pengajuan diterima secara online.',
              createdAt: d('2026-09-25'),
            },
            {
              status: 'VERIFIED',
              note: 'Dokumen terverifikasi oleh petugas.',
              createdAt: d('2026-09-26'),
            },
            {
              status: 'PROCESSING',
              note: 'Surat sedang dalam proses pencetakan.',
              createdAt: d('2026-09-27'),
            },
          ],
        },
      },
    });

    await prisma.application.create({
      data: {
        trackingNumber: 'DSA-2026-000098',
        serviceId: nikah.id,
        applicantName: 'Warga Contoh Dua',
        phone: '0812-0000-0002',
        email: 'warga2@example.test',
        address: 'Dusun Utara, Desa Sukamaju',
        status: 'COMPLETED',
        histories: {
          create: [
            { status: 'SUBMITTED', note: 'Pengajuan diterima.', createdAt: d('2026-09-20') },
            { status: 'VERIFIED', note: 'Dokumen terverifikasi.', createdAt: d('2026-09-21') },
            {
              status: 'PROCESSING',
              note: 'Surat diproses dan ditandatangani.',
              createdAt: d('2026-09-22'),
            },
            {
              status: 'COMPLETED',
              note: 'Surat siap diambil di kantor desa.',
              createdAt: d('2026-09-23'),
            },
          ],
        },
      },
    });

    console.log('- pengajuan contoh: DSA-2026-000123, DSA-2026-000098');
  });

  console.log('Seed selesai.');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
