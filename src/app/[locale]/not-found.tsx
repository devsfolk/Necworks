import type {Metadata} from 'next';
import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';
import {createPageMetadata, getLocalizedSeo, type AppLocale} from '@/lib/metadata';

export async function generateMetadata({params}: {params: Promise<{locale: AppLocale}>}): Promise<Metadata> {
  const {locale} = await params;
  const seo = getLocalizedSeo(locale, 'notFound');
  return createPageMetadata({locale, pathname: '/', ...seo, robots: {index: false, follow: false}});
}

export default function LocalizedNotFound() {
  const t = useTranslations('NotFound');
  return (
    <main className="home-shell page-container not-found-page">
      <p className="machine-detail__eyebrow">404</p>
      <h1 className="section-heading__title">{t('title')}</h1>
      <p className="machine-list__description">{t('description')}</p>
      <Link href="/" className="button button--primary">{t('home')}</Link>
    </main>
  );
}
