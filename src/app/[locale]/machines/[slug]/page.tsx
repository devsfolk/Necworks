import type {Metadata} from 'next';
import {notFound} from 'next/navigation';
import {getTranslations} from 'next-intl/server';
import {Link} from '@/i18n/navigation';
import {JsonLd} from '@/components/JsonLd';
import {getMachine, getMachines} from '@/lib/content';
import {createPageMetadata, getLocalizedSeo, type AppLocale, localizedPath} from '@/lib/metadata';
import {breadcrumbSchema, faqSchema, productSchema} from '@/lib/schema';
import {site} from '@/lib/site';

type RouteProps = {params: Promise<{locale: AppLocale; slug: string}>};

export async function generateStaticParams() {
  const machines = await getMachines();
  return machines.map(({slug}) => ({slug}));
}

export async function generateMetadata({params}: RouteProps): Promise<Metadata> {
  const {locale, slug} = await params;
  const machine = await getMachine(slug);
  if (!machine) notFound();
  const fallback = getLocalizedSeo(locale, 'machineDetail');
  const name = locale === 'ur' ? machine.name_ur : machine.name_en;
  const summary = locale === 'ur' ? machine.summary_ur : machine.summary_en;
  const metadata = createPageMetadata({
    locale,
    pathname: `/machines/${slug}`,
    title: `${name} | ${fallback.title.split(' | ').at(-1)}`,
    description: summary || fallback.description,
    robots: machine.status === 'draft' ? {index: false, follow: false} : undefined
  });
  return metadata;
}

export default async function MachinePage({params}: RouteProps) {
  const {locale, slug} = await params;
  const machine = await getMachine(slug);
  if (!machine) notFound();
  const t = await getTranslations({locale, namespace: 'MachineContent'});
  const name = locale === 'ur' ? machine.name_ur : machine.name_en;
  const summary = locale === 'ur' ? machine.summary_ur : machine.summary_en;
  const faqs = machine.faq.map((item) => ({
    question: locale === 'ur' ? item.q_ur : item.q_en,
    answer: locale === 'ur' ? item.a_ur : item.a_en
  }));
  const breadcrumbName = locale === 'ur' ? 'مشینیں' : 'Machines';
  const breadcrumb = breadcrumbSchema([
    {name: site.name, path: localizedPath(locale, '/')},
    {name: breadcrumbName, path: localizedPath(locale, '/machines')},
    {name, path: localizedPath(locale, `/machines/${slug}`)}
  ]);
  const quote = new URL(site.whatsapp);
  quote.searchParams.set('text', `${t('getQuote')}: ${name}`);

  return (
    <main className="home-shell page-container machine-detail">
      <JsonLd data={breadcrumb} />
      {machine.status === 'published' && machine.specs.length > 0 && (
        <JsonLd data={productSchema({name, description: summary || getLocalizedSeo(locale, 'machineDetail').description})} />
      )}
      {machine.status === 'published' && faqs.length > 0 && <JsonLd data={faqSchema(faqs)} />}
      <nav className="machine-detail__breadcrumbs" aria-label={t('breadcrumbs')}>
        <Link href="/machines">{breadcrumbName}</Link><span aria-hidden="true">/</span><span>{name}</span>
      </nav>
      <p className="machine-detail__eyebrow">{t('machineDetail')}</p>
      <h1 className="section-heading__title">{name}</h1>
      {machine.category && <p className="machine-detail__category">{machine.category}</p>}
      {summary && <p className="machine-list__description">{summary}</p>}
      <a className="button button--primary machine-detail__quote" href={quote.toString()}>{t('getQuote')}</a>

      {machine.specs.length > 0 && (
        <section className="machine-detail__section" aria-labelledby="machine-specifications">
          <h2 id="machine-specifications">{t('specifications')}</h2>
          <div className="machine-specs__scroll">
            <table className="machine-specs">
              <tbody>
                {machine.specs.map((spec, index) => (
                  <tr key={`${spec.label_en}-${index}`}>
                    <th scope="row">{locale === 'ur' ? spec.label_ur : spec.label_en}</th>
                    <td>{spec.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {machine.parts.length > 0 && (
        <section className="machine-detail__section" aria-labelledby="machine-parts">
          <h2 id="machine-parts">{t('parts')}</h2>
          <ul>{machine.parts.map((part) => <li key={part}>{part}</li>)}</ul>
        </section>
      )}

      {machine.faq.length > 0 && (
        <section className="machine-detail__section" aria-labelledby="machine-faq">
          <h2 id="machine-faq">{t('faq')}</h2>
          <div className="machine-faq">
            {machine.faq.map((item, index) => (
              <details key={`${item.q_en}-${index}`}>
                <summary>{locale === 'ur' ? item.q_ur : item.q_en}</summary>
                <p>{locale === 'ur' ? item.a_ur : item.a_en}</p>
              </details>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
