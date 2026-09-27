'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { signOut } from 'next-auth/react';
import {
  CalendarDays,
  ChevronRight,
  FileStack,
  Files,
  HardHat,
  Images,
  Inbox,
  Landmark,
  LayoutDashboard,
  LogOut,
  Megaphone,
  Menu,
  Newspaper,
  Settings,
  Sprout,
  Store,
  TableProperties,
  Users,
  Wallet,
  type LucideIcon,
} from 'lucide-react';
import { ADMIN_NAV } from '@/lib/admin-resources';
import { ROLE_LABELS } from '@/lib/labels';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Toaster } from '@/components/ui/toaster';

export interface AdminUser {
  name: string;
  email: string;
  role: 'ADMIN' | 'STAFF';
}

const NAV_ICONS: Record<string, LucideIcon> = {
  LayoutDashboard,
  FileStack,
  Files,
  Newspaper,
  CalendarDays,
  Megaphone,
  Landmark,
  Sprout,
  Store,
  HardHat,
  Wallet,
  Images,
  TableProperties,
  Inbox,
  Users,
  Settings,
};

function isActive(pathname: string, href: string) {
  if (href === '/admin') return pathname === '/admin';
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminShell({ user, children }: { user: AdminUser; children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const nav = ADMIN_NAV.filter((item) => item.roles.includes(user.role));
  const current = nav.find((item) => isActive(pathname, item.href));
  const initials = user.name
    .split(' ')
    .map((part) => part.charAt(0))
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const navList = (onNavigate?: () => void) => (
    <nav className="flex flex-col gap-1 px-3">
      {nav.map((item) => {
        const Icon = NAV_ICONS[item.icon] ?? LayoutDashboard;
        const active = isActive(pathname, item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
              active
                ? 'bg-primary text-primary-foreground'
                : 'text-foreground/70 hover:bg-muted hover:text-foreground',
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            <span className="truncate">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen flex bg-muted/40">
      <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r bg-background">
        <div className="flex h-16 items-center gap-2.5 border-b px-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Landmark className="h-5 w-5" />
          </div>
          <div className="leading-tight">
            <p className="font-display text-sm font-bold">Admin Sukamaju</p>
            <p className="text-[11px] text-muted-foreground">Panel Pengelolaan Desa</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-4">
          {navList()}
        </div>

        <div className="border-t p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-semibold">
              {initials || 'A'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{user.name}</p>
              <p className="truncate text-xs text-muted-foreground">{user.email}</p>
            </div>
            <Badge variant="secondary">{ROLE_LABELS[user.role] ?? user.role}</Badge>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="mt-3 w-full"
            onClick={() => signOut({ callbackUrl: '/admin/login' })}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Keluar
          </Button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-40 flex h-16 items-center gap-3 border-b bg-background/95 px-4 lg:px-6 backdrop-blur">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Buka menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0">
              <SheetTitle className="sr-only">Menu Admin</SheetTitle>
              <div className="flex h-16 items-center gap-2.5 border-b px-5">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Landmark className="h-5 w-5" />
                </div>
                <div className="leading-tight">
                  <p className="font-display text-sm font-bold">Admin Sukamaju</p>
                  <p className="text-[11px] text-muted-foreground">Panel Pengelolaan Desa</p>
                </div>
              </div>
              <div className="py-4">{navList(() => setOpen(false))}</div>
            </SheetContent>
          </Sheet>

          <div className="flex min-w-0 items-center gap-2 text-sm">
            <span className="hidden sm:inline text-muted-foreground">Admin</span>
            <ChevronRight className="hidden sm:inline h-4 w-4 text-muted-foreground" />
            <span className="truncate font-medium">{current?.label ?? 'Dashboard'}</span>
          </div>

          <div className="ml-auto flex items-center gap-3">
            <div className="hidden sm:block text-right leading-tight">
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-muted-foreground">{ROLE_LABELS[user.role] ?? user.role}</p>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-semibold">
              {initials || 'A'}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => signOut({ callbackUrl: '/admin/login' })}
              aria-label="Keluar"
            >
              <LogOut className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Keluar</span>
            </Button>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-8">{children}</main>
      </div>

      <Toaster />
    </div>
  );
}
