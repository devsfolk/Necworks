import type {Metadata} from 'next';
import en from '../../messages/en.json';
import ur from '../../messages/ur.json';
import {site} from './site';

export type AppLocale = 'en' | 'ur';
export type SeoPageKey = keyof typeof en.Seo.pages;

const catalogs = {en, ur} as const;

export function localizedPath(locale: AppLocale, pathname: string) {
  return locale === 'ur' ? `/ur${pathname === '/' ? '' : pathname}` || '/ur' : pathname;
}

export function createPageMetadata({
  locale,
  pathname,
  title,
  description,
  robots
}: {
  locale: AppLocale;
  pathname: string;
  title: string;
  description: string;
  robots?: Metadata['robots'];
}): Metadata {
  const englishUrl = new URL(localizedPath('en', pathname), site.url).toString();
  const urduUrl = new URL(localizedPath('ur', pathname), site.url).toString();
  const canonical = new URL(localizedPath(locale, pathname), site.url).toString();
  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {en: englishUrl, ur: urduUrl, 'x-default': englishUrl}
    },
    openGraph: {
      type: 'website',
      siteName: site.name,
      title,
      description,
      url: canonical,
      locale: locale === 'ur' ? 'ur_PK' : 'en_US'
    },
    twitter: {card: 'summary', title, description},
    ...(robots ? {robots} : {})
  };
}

export function getLocalizedSeo(locale: AppLocale, key: SeoPageKey) {
  const messages = catalogs[locale];
  return messages.Seo.pages[key];
}

export function getRouteMetadata(locale: AppLocale, pathname: string, key: SeoPageKey): Metadata {
  const seo = getLocalizedSeo(locale, key);
  return createPageMetadata({locale, pathname, title: seo.title, description: seo.description});
}
