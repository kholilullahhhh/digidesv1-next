'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { signOut } from 'next-auth/react';
import {
  Bell,
  CalendarDays,
  ChevronLeft,
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
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  Sprout,
  Store,
  TableProperties,
  Users,
  Wallet,
  type LucideIcon,
} from 'lucide-react';
import { ADMIN_NAV, NAV_GROUPS } from '@/lib/admin-resources';
import { ROLE_LABELS } from '@/lib/labels';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Toaster } from '@/components/ui/toaster';
import { ThemeSwitcher } from '@/components/theme-switcher';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

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

const COLLAPSED_KEY = 'admin-sidebar-collapsed';

export function AdminShell({
  user,
  unreadCount = 0,
  children,
}: {
  user: AdminUser;
  unreadCount?: number;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (window.localStorage.getItem(COLLAPSED_KEY) === '1') setCollapsed(true);
  }, []);

  useEffect(() => {
    window.localStorage.setItem(COLLAPSED_KEY, collapsed ? '1' : '0');
  }, [collapsed]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const nav = ADMIN_NAV.filter((item) => item.roles.includes(user.role));
  const groups = NAV_GROUPS.map((group) => ({
    group,
    items: nav.filter((item) => item.group === group),
  })).filter((section) => section.items.length > 0);

  const current = nav.find((item) => isActive(pathname, item.href));
  const initials = user.name
    .split(' ')
    .map((part) => part.charAt(0))
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const navItem = (item: (typeof ADMIN_NAV)[number], hideLabel: boolean) => {
    const Icon = NAV_ICONS[item.icon] ?? LayoutDashboard;
    const active = isActive(pathname, item.href);
    const link = (
      <Link
        key={item.href}
        href={item.href}
        onClick={() => setMobileOpen(false)}
        aria-current={active ? 'page' : undefined}
        className={cn(
          'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
          hideLabel && 'justify-center px-2',
          active
            ? 'bg-primary text-primary-foreground'
            : 'text-foreground/70 hover:bg-muted hover:text-foreground',
        )}
      >
        <Icon className="h-4 w-4 shrink-0" />
        {!hideLabel && <span className="truncate">{item.label}</span>}
      </Link>
    );

    if (!hideLabel) return link;

    return (
      <Tooltip key={item.href}>
        <TooltipTrigger asChild>{link}</TooltipTrigger>
        <TooltipContent side="right">{item.label}</TooltipContent>
      </Tooltip>
    );
  };

  const navList = (hideLabels: boolean) => (
    <nav className="flex flex-col gap-4 px-3">
      {groups.map((section) => (
        <div key={section.group}>
          {!hideLabels && (
            <p className="mb-1.5 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              {section.group}
            </p>
          )}
          <div className="flex flex-col gap-1">
            {section.items.map((item) => navItem(item, hideLabels))}
          </div>
        </div>
      ))}
    </nav>
  );

  const brand = (hideLabel: boolean, onNavigate?: () => void) => (
    <Link
      href="/admin"
      onClick={onNavigate}
      aria-label="Ke dashboard admin"
      className={cn(
        'flex h-16 shrink-0 items-center gap-2.5 border-b transition-colors hover:bg-muted/60',
        hideLabel ? 'justify-center px-2' : 'px-5',
      )}
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <Landmark className="h-5 w-5" />
      </span>
      {!hideLabel && (
        <span className="leading-tight">
          <span className="block font-display text-sm font-bold">Admin Sukamaju</span>
          <span className="block text-[11px] text-muted-foreground">Panel Pengelolaan Desa</span>
        </span>
      )}
    </Link>
  );

  return (
    <TooltipProvider delayDuration={150}>
      <div className="min-h-screen flex bg-muted/40 dark:bg-background">
        <aside
          className={cn(
            'sticky top-0 hidden h-screen shrink-0 flex-col border-r bg-background transition-[width] duration-200 lg:flex',
            collapsed ? 'w-[72px]' : 'w-64',
          )}
        >
          {brand(collapsed)}

          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain py-4">
            {navList(collapsed)}
          </div>

          <div className="shrink-0 border-t p-3">
            {collapsed ? (
              <div className="flex flex-col items-center gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                      {initials || 'A'}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="right">{user.name}</TooltipContent>
                </Tooltip>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setCollapsed(false)}
                  aria-label="Buka sidebar"
                >
                  <PanelLeftOpen className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                    {initials || 'A'}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{user.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                  </div>
                  <Badge variant="secondary">{ROLE_LABELS[user.role] ?? user.role}</Badge>
                </div>
                <div className="mt-3 flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => signOut({ callbackUrl: '/admin/login' })}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Keluar
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setCollapsed(true)}
                    aria-label="Ciutkan sidebar"
                  >
                    <PanelLeftClose className="h-4 w-4" />
                  </Button>
                </div>
              </>
            )}
          </div>
        </aside>

        <div className="flex-1 flex flex-col min-w-0">
          <header className="sticky top-0 z-40 flex h-16 items-center gap-3 border-b bg-background/95 px-4 lg:px-6 backdrop-blur">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Buka menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="flex w-72 flex-col gap-0 overflow-hidden p-0">
                <SheetTitle className="sr-only">Menu Admin</SheetTitle>
                {brand(false, () => setMobileOpen(false))}

                <div className="flex-1 overflow-y-auto overscroll-contain py-4">{navList(false)}</div>

                <div className="shrink-0 border-t p-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                      {initials || 'A'}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium">{user.name}</span>
                      <span className="block truncate text-xs text-muted-foreground">
                        {user.email}
                      </span>
                    </span>
                    <Badge variant="secondary">{ROLE_LABELS[user.role] ?? user.role}</Badge>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-3 w-full"
                    onClick={() => {
                      setMobileOpen(false);
                      signOut({ callbackUrl: '/admin/login' });
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Keluar
                  </Button>
                </div>
              </SheetContent>
            </Sheet>

            <div className="flex min-w-0 items-center gap-2 text-sm">
              <Link
                href="/admin"
                className="hidden sm:inline text-muted-foreground hover:text-foreground transition-colors"
              >
                Admin
              </Link>
              <ChevronRight className="hidden sm:inline h-4 w-4 text-muted-foreground" />
              <span className="truncate font-medium">{current?.label ?? 'Dashboard'}</span>
            </div>

            <div className="ml-auto flex items-center gap-1.5">
              <Button
                variant="ghost"
                size="icon"
                asChild
                className="relative"
                aria-label={`Pesan masyarakat${unreadCount > 0 ? `, ${unreadCount} belum dibaca` : ''}`}
              >
                <Link href="/admin/pesan">
                  <Bell className="h-4 w-4" />
                  {unreadCount > 0 && (
                    <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-semibold leading-none text-destructive-foreground">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                  )}
                </Link>
              </Button>

              <ThemeSwitcher />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-9 gap-2 px-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                      {initials || 'A'}
                    </span>
                    <span className="hidden text-sm font-medium sm:inline">{user.name}</span>
                    <ChevronLeft className="hidden h-4 w-4 rotate-[-90deg] text-muted-foreground sm:inline" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-60">
                  <DropdownMenuLabel>
                    <p className="truncate text-sm font-medium">{user.name}</p>
                    <p className="truncate text-xs font-normal text-muted-foreground">
                      {user.email}
                    </p>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {user.role === 'ADMIN' && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin/pengaturan">
                        <Settings className="mr-2 h-4 w-4" />
                        Pengaturan
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onSelect={() => signOut({ callbackUrl: '/admin/login' })}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Keluar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          <main className="flex-1 p-4 lg:p-8">{children}</main>
        </div>

        <Toaster />
      </div>
    </TooltipProvider>
  );
}
