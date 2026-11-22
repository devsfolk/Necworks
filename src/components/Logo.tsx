/* eslint-disable @next/next/no-img-element */

type LogoProps = {
  variant?: 'full' | 'mark';
  className?: string;
};

export function Logo({variant = 'full', className}: LogoProps) {
  const isFull = variant === 'full';
  return (
    <img
      src={isFull ? '/media/brand/nec-logo.svg' : '/media/brand/nec-mark.svg'}
      alt={isFull ? 'NEC — National Engineering Co.' : 'NEC'}
      width={isFull ? 72 : 48}
      height={isFull ? 72 : 48}
      loading={isFull ? 'eager' : 'lazy'}
      className={className}
    />
  );
}
