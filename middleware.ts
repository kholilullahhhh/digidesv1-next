import { withAuth } from 'next-auth/middleware';

export default withAuth({
  pages: { signIn: '/admin/login' },
  callbacks: {
    authorized({ token }) {
      return !!token && (token.role === 'ADMIN' || token.role === 'STAFF');
    },
  },
});

export const config = {
  matcher: ['/admin', '/admin/((?!login).*)'],
};
