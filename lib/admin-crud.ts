import bcrypt from 'bcryptjs';
import type { ZodType } from 'zod';
import { prisma } from '@/lib/db';
import type { ResourceKey } from '@/lib/admin-resources';
import {
  announcementSchema,
  budgetSchema,
  eventSchema,
  gallerySchema,
  messageStatusSchema,
  newsSchema,
  officialSchema,
  potentialSchema,
  projectSchema,
  serviceSchema,
  umkmSchema,
  userSchema,
} from '@/lib/validation';

export const toDate = (value: string) => new Date(`${value}T00:00:00.000Z`);
const emptyToNull = (value?: string | null) => (value ? value : null);

export interface CrudDef {
  model: string;
  schema: ZodType;
  orderBy: Record<string, 'asc' | 'desc'> | Record<string, 'asc' | 'desc'>[];
  include?: Record<string, unknown>;
  select?: Record<string, boolean>;
  searchFields?: string[];
  toRow?: (row: Record<string, unknown>) => Record<string, unknown>;
  toCreate: (input: Record<string, unknown>) => Promise<Record<string, unknown>>;
  toUpdate: (input: Record<string, unknown>, id: string) => Promise<Record<string, unknown>>;
}

export const CRUD_DEFS: Partial<Record<ResourceKey, CrudDef>> = {
  news: {
    model: 'news',
    schema: newsSchema,
    orderBy: { publishedAt: 'desc' },
    include: { category: { select: { name: true } } },
    searchFields: ['title', 'slug', 'excerpt', 'author'],
    toRow: (row) => ({
      ...row,
      category: (row.category as { name: string })?.name ?? '',
    }),
    toCreate: async (input) => ({
      title: input.title,
      slug: input.slug,
      excerpt: input.excerpt,
      content: input.content,
      categoryId: input.categoryId,
      author: input.author,
      publishedAt: toDate(input.publishedAt as string),
      readTime: input.readTime,
      thumbnail: input.thumbnail,
      featured: input.featured,
      status: input.status,
    }),
    toUpdate: async (input) => ({
      title: input.title,
      slug: input.slug,
      excerpt: input.excerpt,
      content: input.content,
      categoryId: input.categoryId,
      author: input.author,
      publishedAt: toDate(input.publishedAt as string),
      readTime: input.readTime,
      thumbnail: input.thumbnail,
      featured: input.featured,
      status: input.status,
    }),
  },
  services: {
    model: 'service',
    schema: serviceSchema,
    orderBy: { order: 'asc' },
    include: { requirements: { orderBy: { order: 'asc' }, select: { text: true, order: true } } },
    searchFields: ['name', 'slug', 'description'],
    toRow: (row) => ({
      ...row,
      requirements: (row.requirements as { text: string }[]).map((r) => r.text),
    }),
    toCreate: async (input) => ({
      name: input.name,
      slug: input.slug,
      description: input.description,
      icon: input.icon,
      estimate: input.estimate,
      fee: input.fee,
      procedure: input.procedure,
      documents: input.documents,
      order: input.order,
      isActive: input.isActive,
      requirements: {
        create: (input.requirements as string[]).map((text, order) => ({ text, order })),
      },
    }),
    toUpdate: async (input) => ({
      name: input.name,
      slug: input.slug,
      description: input.description,
      icon: input.icon,
      estimate: input.estimate,
      fee: input.fee,
      procedure: input.procedure,
      documents: input.documents,
      order: input.order,
      isActive: input.isActive,
      requirements: {
        deleteMany: {},
        create: (input.requirements as string[]).map((text, order) => ({ text, order })),
      },
    }),
  },
  events: {
    model: 'event',
    schema: eventSchema,
    orderBy: { date: 'asc' },
    searchFields: ['title', 'location', 'organizer', 'category'],
    toCreate: async (input) => ({
      title: input.title,
      description: input.description,
      date: toDate(input.date as string),
      time: input.time,
      location: input.location,
      organizer: input.organizer,
      category: input.category,
      status: input.status,
    }),
    toUpdate: async (input) => ({
      title: input.title,
      description: input.description,
      date: toDate(input.date as string),
      time: input.time,
      location: input.location,
      organizer: input.organizer,
      category: input.category,
      status: input.status,
    }),
  },
  announcements: {
    model: 'announcement',
    schema: announcementSchema,
    orderBy: { date: 'desc' },
    searchFields: ['title', 'content', 'category'],
    toCreate: async (input) => ({
      title: input.title,
      content: input.content,
      date: toDate(input.date as string),
      category: input.category,
      important: input.important,
      isActive: input.isActive,
    }),
    toUpdate: async (input) => ({
      title: input.title,
      content: input.content,
      date: toDate(input.date as string),
      category: input.category,
      important: input.important,
      isActive: input.isActive,
    }),
  },
  officials: {
    model: 'villageOfficial',
    schema: officialSchema,
    orderBy: { order: 'asc' },
    searchFields: ['name', 'position'],
    toCreate: async (input) => ({
      name: input.name,
      position: input.position,
      category: input.category,
      photo: input.photo,
      nip: emptyToNull(input.nip as string),
      phone: emptyToNull(input.phone as string),
      order: input.order,
    }),
    toUpdate: async (input) => ({
      name: input.name,
      position: input.position,
      category: input.category,
      photo: input.photo,
      nip: emptyToNull(input.nip as string),
      phone: emptyToNull(input.phone as string),
      order: input.order,
    }),
  },
  potentials: {
    model: 'villagePotential',
    schema: potentialSchema,
    orderBy: { createdAt: 'asc' },
    searchFields: ['name', 'category', 'location'],
    toCreate: async (input) => ({
      name: input.name,
      category: input.category,
      description: input.description,
      location: input.location,
      contact: emptyToNull(input.contact as string),
      image: input.image,
      isActive: input.isActive,
    }),
    toUpdate: async (input) => ({
      name: input.name,
      category: input.category,
      description: input.description,
      location: input.location,
      contact: emptyToNull(input.contact as string),
      image: input.image,
      isActive: input.isActive,
    }),
  },
  umkm: {
    model: 'umkm',
    schema: umkmSchema,
    orderBy: { createdAt: 'asc' },
    searchFields: ['name', 'owner', 'category', 'product', 'location'],
    toCreate: async (input) => ({
      name: input.name,
      owner: input.owner,
      category: input.category,
      product: input.product,
      location: input.location,
      contact: input.contact,
      image: input.image,
      description: input.description,
      isActive: input.isActive,
    }),
    toUpdate: async (input) => ({
      name: input.name,
      owner: input.owner,
      category: input.category,
      product: input.product,
      location: input.location,
      contact: input.contact,
      image: input.image,
      description: input.description,
      isActive: input.isActive,
    }),
  },
  projects: {
    model: 'developmentProject',
    schema: projectSchema,
    orderBy: [{ year: 'desc' }, { createdAt: 'asc' }],
    searchFields: ['name', 'location', 'source'],
    toCreate: async (input) => ({
      name: input.name,
      location: input.location,
      year: input.year,
      budget: input.budget,
      source: input.source,
      progress: input.progress,
      status: input.status,
      description: input.description,
    }),
    toUpdate: async (input) => ({
      name: input.name,
      location: input.location,
      year: input.year,
      budget: input.budget,
      source: input.source,
      progress: input.progress,
      status: input.status,
      description: input.description,
    }),
  },
  budgets: {
    model: 'budgetReport',
    schema: budgetSchema,
    orderBy: { year: 'desc' },
    searchFields: [],
    toRow: (row) => {
      const income = Array.isArray(row.income) ? (row.income as { value: number }[]) : [];
      const expenditure = Array.isArray(row.expenditure)
        ? (row.expenditure as { value: number }[])
        : [];
      return {
        ...row,
        totalIncome: income.reduce((sum, item) => sum + Number(item.value ?? 0), 0),
        totalExpenditure: expenditure.reduce((sum, item) => sum + Number(item.value ?? 0), 0),
      };
    },
    toCreate: async (input) => ({
      year: input.year,
      income: input.income,
      expenditure: input.expenditure,
      description: input.description,
    }),
    toUpdate: async (input) => ({
      year: input.year,
      income: input.income,
      expenditure: input.expenditure,
      description: input.description,
    }),
  },
  gallery: {
    model: 'gallery',
    schema: gallerySchema,
    orderBy: { date: 'desc' },
    searchFields: ['title', 'category', 'caption'],
    toCreate: async (input) => ({
      title: input.title,
      image: input.image,
      category: input.category,
      caption: input.caption,
      date: toDate(input.date as string),
    }),
    toUpdate: async (input) => ({
      title: input.title,
      image: input.image,
      category: input.category,
      caption: input.caption,
      date: toDate(input.date as string),
    }),
  },
  messages: {
    model: 'contactMessage',
    schema: messageStatusSchema,
    orderBy: { createdAt: 'desc' },
    searchFields: ['name', 'email', 'subject', 'message'],
    toCreate: async () => {
      throw new Error('Pesan tidak dapat dibuat melalui admin.');
    },
    toUpdate: async (input) => ({ status: input.status }),
  },
  users: {
    model: 'user',
    schema: userSchema,
    orderBy: { createdAt: 'asc' },
    select: { id: true, name: true, email: true, role: true, isActive: true, createdAt: true },
    searchFields: ['name', 'email'],
    toCreate: async (input) => {
      const password = String(input.password ?? '');
      if (password.length < 8) throw new Error('Password minimal 8 karakter.');
      return {
        name: input.name,
        email: String(input.email).toLowerCase(),
        role: input.role,
        isActive: input.isActive,
        password: await bcrypt.hash(password, 10),
      };
    },
    toUpdate: async (input) => {
      const password = String(input.password ?? '');
      const data: Record<string, unknown> = {
        name: input.name,
        email: String(input.email).toLowerCase(),
        role: input.role,
        isActive: input.isActive,
      };
      if (password) data.password = await bcrypt.hash(password, 10);
      return data;
    },
  },
};

export function getCrudDef(resource: string): { key: ResourceKey; def: CrudDef } | null {
  const key = resource as ResourceKey;
  const def = CRUD_DEFS[key];
  return def ? { key, def } : null;
}

interface PrismaError {
  code?: string;
  meta?: { target?: unknown };
}

/** Terjemahkan error Prisma ke pesan yang aman ditampilkan admin. */
export function prismaMessage(error: unknown): { message: string; status: number } {
  const err = error as PrismaError;
  switch (err?.code) {
    case 'P2002':
      return { message: 'Data dengan nilai unik (slug/email/tahun) sudah tersimpan.', status: 409 };
    case 'P2003':
    case 'P2014':
      return {
        message: 'Data tidak dapat dihapus karena masih digunakan oleh data lain.',
        status: 409,
      };
    case 'P2025':
      return { message: 'Data tidak ditemukan.', status: 404 };
    default:
      return { message: error instanceof Error ? error.message : 'Terjadi kesalahan pada server.', status: 500 };
  }
}
