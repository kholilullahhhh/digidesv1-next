import { AnnouncementBar } from '@/components/layout/announcement-bar';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { getAnnouncements, getSiteConfig } from '@/lib/queries';

export async function PublicLayout({ children }: { children: React.ReactNode }) {
  const [site, announcements] = await Promise.all([getSiteConfig(), getAnnouncements()]);

  return (
    <>
      <a
        href="#konten-utama"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-primary-foreground focus:shadow-lg"
      >
        Lewati ke konten utama
      </a>
      <AnnouncementBar items={announcements} />
      <Header site={site} />
      <main id="konten-utama" tabIndex={-1} className="flex-1 outline-none">
        {children}
      </main>
      <Footer site={site} />
    </>
  );
}
