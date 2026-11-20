import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';
import {Logo} from './Logo';
import {contactLinks, site} from '@/lib/site';

export function Footer() {
  const t = useTranslations('Navigation');
  const c = useTranslations('Common');
  const m = useTranslations('MachineContent');
  return (
    <footer className="site-footer">
      <div className="site-footer__inner page-container">
        <Link href="/" className="site-footer__brand" aria-label="NEC home">
          <Logo variant="mark" className="site-footer__mark" />
          <span>{c('companyName')}</span>
        </Link>
        <nav className="site-footer__nav" aria-label={c('footerNavigation')}>
          <Link href="/machines">{t('machines')}</Link>
          <Link href="/industries">{t('industries')}</Link>
          <Link href="/about">{t('about')}</Link>
          <Link href="/contact">{t('contact')}</Link>
        </nav>
        <address className="site-footer__contact">
          <span>{m('location')}</span>
          {contactLinks.filter(({key}) => key !== 'whatsapp').map(({key, href}) => (
            <a href={href} key={key}>{key === 'phone' ? site.telephone : site.email}</a>
          ))}
        </address>
      </div>
    </footer>
  );
}
