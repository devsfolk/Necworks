import type {MetadataRoute} from 'next';
export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
  const paths = ['', '/machines', '/parts', '/knowledge', '/about', '/contact'];
  return paths.flatMap((path) => [
    {url: `${siteUrl}${path || '/'}`},
    {url: `${siteUrl}/ur${path}`}
  ]);
}
