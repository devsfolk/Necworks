import {useLocale, useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';
import {Logo} from './Logo';
import {Button} from './Button';

const navigation = [
  {href: '/', key: 'home'},
  {href: '/machines', key: 'machines'},
  {href: '/parts', key: 'parts'},
  {href: '/industries', key: 'industries'},
  {href: '/knowledge', key: 'knowledge'},
  {href: '/about', key: 'about'},
  {href: '/contact', key: 'contact'}
] as const;

function NavigationLinks() {
  const t = useTranslations('Navigation');
  return navigation.map(({href, key}) => (
    <Link key={key} href={href} className="site-nav__link">{t(key)}</Link>
  ));
}

function LanguageSwitch() {
  const t = useTranslations('Navigation');
  const locale = useLocale();
  return <Link href="/" locale={locale === 'en' ? 'ur' : 'en'} className="language-switch">{t('switchLanguage')}</Link>;
}

export function Header() {
  const t = useTranslations('Navigation');
  return (
    <header className="site-header">
      <div className="site-header__inner page-container">
        <Link href="/" className="site-brand" aria-label="NEC home"><Logo variant="full" className="site-brand__logo" /></Link>
        <nav className="site-nav" aria-label={t('primaryNavigation')}><NavigationLinks /></nav>
        <div className="site-header__actions">
          <LanguageSwitch />
          <Button href="/contact" variant="primary" className="header-quote">{t('getQuote')}</Button>
        </div>
        <details className="mobile-menu">
          <summary className="mobile-menu__toggle">
            <span className="mobile-menu__icon" aria-hidden="true"><i /><i /><i /></span>
            <span>{t('menu')}</span>
          </summary>
          <div className="mobile-menu__panel">
            <nav className="mobile-menu__links" aria-label={t('primaryNavigation')}><NavigationLinks /></nav>
            <div className="mobile-menu__actions">
              <LanguageSwitch />
              <Button href="/contact" variant="primary">{t('getQuote')}</Button>
            </div>
          </div>
        </details>
      </div>
    </header>
  );
}
