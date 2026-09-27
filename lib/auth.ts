import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/db';

export function resolveAuthSecret(): string {
  const secret = process.env.NEXTAUTH_SECRET;
  if (secret) return secret;
  if (process.env.NODE_ENV === 'production') {
    throw new Error(
      'NEXTAUTH_SECRET belum diisi. Setel environment variable NEXTAUTH_SECRET di Vercel.',
    );
  }
  return 'digides-dev-only-secret-ganti-sebelum-production';
}

export const authOptions: NextAuthOptions = {
  session: { strategy: 'jwt' },
  pages: { signIn: '/admin/login' },
  secret: resolveAuthSecret(),
  providers: [
    CredentialsProvider({
      name: 'Kredensial',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const email = credentials.email.trim().toLowerCase();
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !user.isActive) return null;

        const valid = await bcrypt.compare(credentials.password, user.password);
        if (!valid) return null;

        return { id: user.id, email: user.email, name: user.name, role: user.role };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id ?? '';
        session.user.role = token.role ?? 'STAFF';
      }
      return session;
    },
  },
  events: {
    async signIn({ user }) {
      try {
        await prisma.auditLog.create({
          data: {
            userId: user.id ?? null,
            action: 'LOGIN',
            entity: 'User',
            entityId: user.id ?? null,
            detail: { email: user.email ?? '' },
          },
        });
      } catch {
        // Audit log tidak boleh menggagalkan login.
      }
    },
  },
};
