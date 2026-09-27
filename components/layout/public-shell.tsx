import { AnnouncementBar } from '@/components/layout/announcement-bar';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { staticSiteConfigView } from '@/lib/site-view';

const staticSite = staticSiteConfigView();

/**
 * Shell sinkron (tanpa query database) untuk error/loading/not-found,
 * termasuk halaman error yang dirender sebagai client component.
 */
export function PublicShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AnnouncementBar items={[]} />
      <Header site={staticSite} />
      <main className="flex-1">{children}</main>
      <Footer site={staticSite} />
    </>
  );
}
