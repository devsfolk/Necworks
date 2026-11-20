import Image from 'next/image';

type LogoProps = {
  variant?: 'full' | 'mark';
  className?: string;
};

export function Logo({variant = 'full', className}: LogoProps) {
  const isFull = variant === 'full';
  return (
    <Image
      src={isFull ? '/media/brand/nec-logo.svg' : '/media/brand/nec-mark.svg'}
      alt={isFull ? 'NEC — National Engineering Co.' : 'NEC'}
      width={isFull ? 72 : 48}
      height={isFull ? 72 : 48}
      priority={isFull}
      className={className}
    />
  );
}
