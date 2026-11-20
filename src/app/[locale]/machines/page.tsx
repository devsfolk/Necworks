import type {Metadata} from 'next';
import {getTranslations} from 'next-intl/server';
import {Link} from '@/i18n/navigation';
import {JsonLd} from '@/components/JsonLd';
import {getMachines} from '@/lib/content';
import {getRouteMetadata, type AppLocale, localizedPath} from '@/lib/metadata';
import {breadcrumbSchema} from '@/lib/schema';
import {site} from '@/lib/site';

export async function generateMetadata({params}: {params: Promise<{locale: AppLocale}>}): Promise<Metadata> {
  const {locale} = await params;
  return getRouteMetadata(locale, '/machines', 'machines');
}

export default async function MachinesPage({params}: {params: Promise<{locale: AppLocale}>}) {
  const {locale} = await params;
  const [machines, t] = await Promise.all([
    getMachines(),
    getTranslations({locale, namespace: 'MachineContent'})
  ]);
  const heading = locale === 'ur' ? 'مشینیں' : 'Machines';
  const crumbs = breadcrumbSchema([
    {name: site.name, path: localizedPath(locale, '/')},
    {name: heading, path: localizedPath(locale, '/machines')}
  ]);

  return (
    <main className="home-shell page-container">
      <JsonLd data={crumbs} />
      <h1 className="section-heading__title">{heading}</h1>
      <p className="machine-list__description">{t('machineListDescription')}</p>
      {machines.length ? (
        <ul className="machine-list">
          {machines.map((machine) => (
            <li className="machine-list__item" key={machine.slug}>
              <Link href={`/machines/${machine.slug}`} className="machine-list__link">
                <span>{locale === 'ur' ? machine.name_ur : machine.name_en}</span>
                {machine.status === 'draft' && <small>{t('draft')}</small>}
                <span aria-hidden="true">↗</span>
              </Link>
              {(locale === 'ur' ? machine.summary_ur : machine.summary_en) && (
                <p>{locale === 'ur' ? machine.summary_ur : machine.summary_en}</p>
              )}
            </li>
          ))}
        </ul>
      ) : <p>{t('noMachines')}</p>}
    </main>
  );
}
