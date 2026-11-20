import {useTranslations} from 'next-intl';
import {Button} from './Button';
import {JsonLd} from './JsonLd';
import {MachineSlider} from './MachineSlider';
import {TitleBlock} from './TitleBlock';
import {breadcrumbSchema, organizationSchema, websiteSchema} from '@/lib/schema';
import {localizedPath, type AppLocale} from '@/lib/metadata';
import {useLocale} from 'next-intl';

export function HomeHero() {
  const locale = useLocale() as AppLocale;
  const t = useTranslations('HomeHero');
  const c = useTranslations('Common');
  const breadcrumbs = breadcrumbSchema([{name: c('companyName'), path: localizedPath(locale, '/')}]);
  return (
    <main className="home-shell page-container">
      <JsonLd data={[organizationSchema(), websiteSchema(locale), breadcrumbs]} />
      <TitleBlock
        company={c('companyName')}
        sheet={t('sheetValue')}
        title={t('titleValue')}
        labels={{company: t('companyLabel'), sheet: t('sheetLabel'), title: t('titleLabel')}}
      />
      <section className="home-hero" aria-labelledby="home-title">
        <div className="home-hero__copy">
          <p className="home-hero__eyebrow"><span className="status-dot" />{t('eyebrow')}</p>
          <h1 id="home-title">{t('headline')}</h1>
          <p className="home-hero__description">{t('description')}</p>
          <div className="home-hero__actions">
            <Button href="/contact" variant="primary">{t('getQuote')}</Button>
            <Button href="/machines" variant="outline">{t('viewMachines')}</Button>
          </div>
        </div>
        <MachineSlider />
      </section>
    </main>
  );
}
