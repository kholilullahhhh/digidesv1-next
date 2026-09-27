import { AnnouncementBar } from '@/components/layout/announcement-bar';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { getAnnouncements, getSiteConfig } from '@/lib/queries';

export async function PublicLayout({ children }: { children: React.ReactNode }) {
  const [site, announcements] = await Promise.all([getSiteConfig(), getAnnouncements()]);

  return (
    <>
      <AnnouncementBar items={announcements} />
      <Header site={site} />
      <main className="flex-1">{children}</main>
      <Footer site={site} />
    </>
  );
}
