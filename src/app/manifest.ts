import type {MetadataRoute} from 'next';
import {site} from '@/lib/site';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.name,
    short_name: 'NEC',
    start_url: '/',
    display: 'standalone',
    background_color: '#0b1f3a',
    theme_color: '#0b1f3a',
    icons: [{src: site.iconPath, sizes: 'any', type: 'image/svg+xml', purpose: 'any'}]
  };
}
