import {useLocale, useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';

export function Header() {
  const t = useTranslations('Navigation');
  const locale = useLocale();
  return (
    <header className="border-b border-neutral-200 px-6 py-4">
      <nav className="mx-auto flex max-w-6xl flex-wrap items-center gap-6" aria-label="Main navigation">
        <Link href="/" className="font-semibold">NEC</Link>
        <Link href="/machines">{t('machines')}</Link>
        <Link href="/parts">{t('parts')}</Link>
        <Link href="/knowledge">{t('knowledge')}</Link>
        <Link href="/about">{t('about')}</Link>
        <Link href="/contact">{t('contact')}</Link>
        <Link href="/" locale={locale === 'en' ? 'ur' : 'en'} className="ms-auto">{t('switchLanguage')}</Link>
      </nav>
    </header>
  );
}
