import {readFile} from 'node:fs/promises';
import path from 'node:path';

export type MediaVariant = {file: string; width: number; height: number};
export type MediaManifestImage = {
  source: string;
  width: number;
  height: number;
  sizes: string;
  variants: MediaVariant[];
  blurDataURL: string;
  social?: {file: string; width: number; height: number};
};
export type MediaManifest = {images: MediaManifestImage[]; videos: {file: string; size: number}[]};

export async function getMediaManifest(type: 'machines' | 'knowledge' | 'projects', slug: string): Promise<MediaManifest | null> {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) return null;
  const filename = path.join(process.cwd(), 'public', 'media', type, slug, 'manifest.json');
  try {
    return JSON.parse(await readFile(filename, 'utf8')) as MediaManifest;
  } catch {
    return null;
  }
}

export function mediaPath(type: 'machines' | 'knowledge' | 'projects', slug: string, filename: string) {
  return `/media/${type}/${slug}/${filename.split(/[\\/]/).map(encodeURIComponent).join('/')}`;
}
