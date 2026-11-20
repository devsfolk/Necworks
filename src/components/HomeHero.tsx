import {useTranslations} from 'next-intl';
import {Button} from './Button';
import {MachineSlider} from './MachineSlider';
import {TitleBlock} from './TitleBlock';

export function HomeHero() {
  const t = useTranslations('HomeHero');
  const c = useTranslations('Common');
  return (
    <main className="home-shell page-container">
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
