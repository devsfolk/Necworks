import {site} from './site';

const context = 'https://schema.org';

export function organizationSchema() {
  return {
    '@context': context,
    '@type': 'Organization',
    '@id': `${site.url}/#organization`,
    name: site.name,
    url: site.url,
    logo: new URL(site.logoPath, site.url).toString(),
    telephone: site.telephone,
    email: site.email,
    address: {
      '@type': 'PostalAddress',
      addressLocality: site.addressLocality,
      addressCountry: site.addressCountry
    },
    ...(site.sameAs.length ? {sameAs: site.sameAs} : {})
  };
}

export function websiteSchema(locale: 'en' | 'ur') {
  return {
    '@context': context,
    '@type': 'WebSite',
    name: site.name,
    url: new URL(locale === 'ur' ? '/ur' : '/', site.url).toString(),
    inLanguage: locale === 'ur' ? 'ur' : 'en',
    publisher: {'@id': `${site.url}/#organization`}
  };
}

export function breadcrumbSchema(items: Array<{name: string; path: string}>) {
  return {
    '@context': context,
    '@type': 'BreadcrumbList',
    itemListElement: items.map(({name, path}, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name,
      item: new URL(path, site.url).toString()
    }))
  };
}

export function productSchema({name, description}: {name: string; description: string}) {
  return {
    '@context': context,
    '@type': 'Product',
    name,
    description,
    manufacturer: {'@type': 'Organization', name: site.name}
  };
}

export function faqSchema(items: Array<{question: string; answer: string}>) {
  return {
    '@context': context,
    '@type': 'FAQPage',
    mainEntity: items.map(({question, answer}) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: {'@type': 'Answer', text: answer}
    }))
  };
}
