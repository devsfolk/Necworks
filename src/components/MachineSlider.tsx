'use client';

import {useState} from 'react';
import Image from 'next/image';
import {useLocale, useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';
import heroMachines from '../../content/hero-machines.json';
import {SectionHeading} from './SectionHeading';

export function MachineSlider() {
  const locale = useLocale();
  const t = useTranslations('HomeHero');
  const [activeSlug, setActiveSlug] = useState(heroMachines[0].slug);
  const machine = heroMachines.find(({slug}) => slug === activeSlug) ?? heroMachines[0];
  const name = locale === 'ur' ? machine.name_ur : machine.name_en;

  return (
    <section className="machine-slider" aria-label={t('machineSelector')}>
      <div className="machine-slider__topline">
        <p className="draft-label">{t('machineSelector')}</p>
        <span className="machine-slider__index">{String(heroMachines.findIndex(({slug}) => slug === machine.slug) + 1).padStart(2, '0')} / {String(heroMachines.length).padStart(2, '0')}</span>
      </div>
      <div className="machine-slider__tabs" role="tablist" aria-label={t('machineSelector')}>
        {heroMachines.map((item) => (
          <button
            type="button"
            role="tab"
            id={`machine-tab-${item.slug}`}
            aria-selected={item.slug === machine.slug}
            aria-controls="machine-panel"
            className="machine-slider__tab"
            key={item.slug}
            onClick={() => setActiveSlug(item.slug)}
          >
            {locale === 'ur' ? item.name_ur : item.name_en}
          </button>
        ))}
      </div>
      <div className="machine-slider__panel" id="machine-panel" role="tabpanel" aria-labelledby={`machine-tab-${machine.slug}`}>
        <div className="machine-slider__heading">
          <SectionHeading eyebrow={t('selectedMachine')} title={name} />
          <Link href={{pathname: '/contact', query: {machine: machine.slug}}} className="machine-slider__quote">
            {t('getQuoteForMachine')} <span aria-hidden="true">↗</span>
          </Link>
        </div>
        <div className="drawing-frame">
          {machine.drawing ? (
            <Image src={machine.drawing} alt={name} width={1200} height={800} className="drawing-frame__image" />
          ) : (
            <div className="drawing-placeholder">
              <div className="drawing-placeholder__inner" aria-hidden="true">
                <span className="drawing-placeholder__axis drawing-placeholder__axis--horizontal" />
                <span className="drawing-placeholder__axis drawing-placeholder__axis--vertical" />
                <span className="drawing-placeholder__frame" />
                <span className="drawing-placeholder__corner drawing-placeholder__corner--tl" />
                <span className="drawing-placeholder__corner drawing-placeholder__corner--tr" />
                <span className="drawing-placeholder__corner drawing-placeholder__corner--bl" />
                <span className="drawing-placeholder__corner drawing-placeholder__corner--br" />
              </div>
              <p>{t('drawingComingSoon')}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
