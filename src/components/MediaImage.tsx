import type {MediaManifestImage} from '@/lib/media';

/* eslint-disable @next/next/no-img-element */
type MediaImageProps = {
  image: MediaManifestImage;
  srcPrefix: string;
  alt: string;
  sizes?: string;
  loading?: 'lazy' | 'eager';
  priority?: boolean;
  illustrationLabel: string;
  isIllustration?: boolean;
};

export function MediaImage({image, srcPrefix, alt, sizes = image.sizes, loading = 'lazy', priority = false, illustrationLabel, isIllustration = false}: MediaImageProps) {
  const variants = [...image.variants].sort((left, right) => left.width - right.width);
  const largest = variants[variants.length - 1];
  if (!alt.trim()) throw new Error('MediaImage requires meaningful alt text.');
  if (!largest) return null;

  return (
    <figure className={`media-image${isIllustration ? ' media-image--illustration' : ''}`}>
      <img
        src={`${srcPrefix}/${largest.file}`}
        srcSet={variants.map((variant) => `${srcPrefix}/${variant.file} ${variant.width}w`).join(', ')}
        sizes={sizes}
        width={largest.width}
        height={largest.height}
        alt={alt}
        loading={priority ? 'eager' : loading}
        fetchPriority={priority ? 'high' : 'auto'}
        decoding="async"
        style={image.blurDataURL ? {backgroundImage: `url("${image.blurDataURL}")`} : undefined}
      />
      {isIllustration && <figcaption className="media-image__label">{illustrationLabel}</figcaption>}
    </figure>
  );
}
