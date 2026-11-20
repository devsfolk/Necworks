import type {MetadataRoute} from 'next';
import {getPublishedMachines} from '@/lib/content';
import {localizedPath} from '@/lib/metadata';
import {publicSections, site} from '@/lib/site';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const machines = await getPublishedMachines();
  const paths = [
    ...publicSections.map(({path}) => path),
    ...machines.map(({slug}) => `/machines/${slug}`)
  ];
  return paths.map((path) => {
    const englishUrl = new URL(localizedPath('en', path), site.url).toString();
    const urduUrl = new URL(localizedPath('ur', path), site.url).toString();
    return {
      url: englishUrl,
      alternates: {languages: {en: englishUrl, ur: urduUrl, 'x-default': englishUrl}}
    };
  });
}
