import type {Metadata} from 'next';
import {getRouteMetadata, type AppLocale} from '@/lib/metadata';
import {PagePlaceholder} from '@/components/PagePlaceholder';

export async function generateMetadata({params}: {params: Promise<{locale: AppLocale; slug: string}>}): Promise<Metadata> {
  const {locale, slug} = await params;
  return getRouteMetadata(locale, `/knowledge/${slug}`, 'knowledgeDetail');
}
export default function KnowledgeArticlePage() { return <PagePlaceholder titleKey="knowledgeDetail" />; }
