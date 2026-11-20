import type {Metadata} from 'next';
import {getRouteMetadata, type AppLocale} from '@/lib/metadata';
import {PagePlaceholder} from '@/components/PagePlaceholder';

export async function generateMetadata({params}: {params: Promise<{locale: AppLocale}>}): Promise<Metadata> {
  const {locale} = await params;
  return getRouteMetadata(locale, '/knowledge', 'knowledge');
}
export default function KnowledgePage() { return <PagePlaceholder titleKey="knowledge" />; }
