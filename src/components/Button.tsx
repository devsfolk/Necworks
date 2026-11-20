import type {ReactNode} from 'react';
import {Link} from '@/i18n/navigation';

type ButtonProps = {href: string; children: ReactNode; variant?: 'primary' | 'outline'; className?: string};

export function Button({href, children, variant = 'outline', className = ''}: ButtonProps) {
  return <Link href={href} className={`button button--${variant} ${className}`.trim()}>{children}</Link>;
}
