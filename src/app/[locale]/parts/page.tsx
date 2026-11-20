import type {Metadata} from 'next';
import {getRouteMetadata, type AppLocale} from '@/lib/metadata';
import {PagePlaceholder} from '@/components/PagePlaceholder';

export async function generateMetadata({params}: {params: Promise<{locale: AppLocale}>}): Promise<Metadata> {
  const {locale} = await params;
  return getRouteMetadata(locale, '/parts', 'parts');
}
export default function PartsPage() { return <PagePlaceholder titleKey="parts" />; }
