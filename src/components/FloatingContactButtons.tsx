import {useTranslations} from 'next-intl';
import {contactLinks} from '@/lib/site';

export function FloatingContactButtons() {
  const t = useTranslations('Contacts');
  return (
    <nav className="floating-contact" aria-label={t('contactOptions')}>
      {contactLinks.map(({key, href, labelKey}) => (
        <a className={`floating-contact__link floating-contact__link--${key}`} href={href} aria-label={t(labelKey)} title={t(labelKey)} key={key} data-track={`${key}_click`}>
          <span aria-hidden="true">{key === 'whatsapp' ? 'WA' : key === 'phone' ? 'TEL' : '@'}</span>
        </a>
      ))}
    </nav>
  );
}
