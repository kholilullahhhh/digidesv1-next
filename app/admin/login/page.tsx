import { LoginForm } from '@/components/admin/login-form';
import { PublicShell } from '@/components/layout/public-shell';

export default function AdminLoginPage() {
  return (
    <PublicShell>
      <section className="py-16 lg:py-24">
        <div className="container-mx">
          <div className="mx-auto w-full max-w-md">
            <div className="text-center mb-8">
              <p className="text-sm font-medium text-primary mb-2">Panel Admin</p>
              <h1 className="font-display text-2xl lg:text-3xl font-bold">Masuk Administrator</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Masuk untuk mengelola konten dan layanan desa.
              </p>
            </div>
            <LoginForm />
          </div>
        </div>
      </section>
    </PublicShell>
  );
}
