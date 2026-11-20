import type {Metadata} from 'next';
import {createPageMetadata, getLocalizedSeo, type AppLocale} from '@/lib/metadata';
import {HomeHero} from '@/components/HomeHero';

export async function generateMetadata({params}: {params: Promise<{locale: AppLocale}>}): Promise<Metadata> {
  const {locale} = await params;
  const seo = getLocalizedSeo(locale, 'home');
  return createPageMetadata({locale, pathname: '/', ...seo});
}

export default function HomePage() {
  return <HomeHero />;
}
