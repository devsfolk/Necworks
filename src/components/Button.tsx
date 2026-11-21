import type {ReactNode} from 'react';
import {Link} from '@/i18n/navigation';

type ButtonProps = {href: string; children: ReactNode; variant?: 'primary' | 'outline'; className?: string; 'data-track'?: string};

export function Button({href, children, variant = 'outline', className = '', ...attributes}: ButtonProps) {
  return <Link href={href} className={`button button--${variant} ${className}`.trim()} {...attributes}>{children}</Link>;
}
