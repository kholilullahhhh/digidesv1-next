'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ArrowRight, Landmark } from 'lucide-react';
import { siteConfig } from '@/config/site';
import type { SiteConfigView } from '@/lib/site-view';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export function Header({ site }: { site: SiteConfigView }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-300',
        scrolled
          ? 'bg-background/85 backdrop-blur-md shadow-sm border-b'
          : 'bg-transparent'
      )}
    >
      <div className="container-mx">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
              <Landmark className="h-5 w-5" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-display text-sm font-bold text-foreground">
                Desa {site.village}
              </span>
              <span className="text-[11px] text-muted-foreground">
                {site.regency}, {site.province}
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {siteConfig.nav.map((item) => {
              const active =
                item.href === '/'
                  ? pathname === '/'
                  : pathname === item.href || pathname.startsWith(item.href + '/');
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'rounded-md px-3 py-2 text-sm font-medium transition-colors',
                    active
                      ? 'text-primary bg-primary/10'
                      : 'text-foreground/70 hover:text-foreground hover:bg-muted'
                  )}
                >
                  {item.title}
                </Link>
              );
            })}
          </nav>

          {/* CTA + Mobile toggle */}
          <div className="flex items-center gap-2">
            <Button asChild size="sm" className="hidden sm:inline-flex">
              <Link href="/layanan">
                Ajukan Layanan
                <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Link>
            </Button>
            <button
              className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-md text-foreground hover:bg-muted"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Buka menu"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t bg-background/95 backdrop-blur-md">
          <nav className="container-mx py-4 flex flex-col gap-1">
            {siteConfig.nav.map((item) => {
              const active =
                item.href === '/'
                  ? pathname === '/'
                  : pathname === item.href || pathname.startsWith(item.href + '/');
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'rounded-md px-3 py-2.5 text-sm font-medium transition-colors',
                    active
                      ? 'text-primary bg-primary/10'
                      : 'text-foreground/80 hover:bg-muted'
                  )}
                >
                  {item.title}
                </Link>
              );
            })}
            <Button asChild size="sm" className="mt-2 lg:hidden">
              <Link href="/layanan">
                Ajukan Layanan
                <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
