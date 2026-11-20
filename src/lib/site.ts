export const site = {
  name: 'National Engineering Co.',
  llmsDescription: 'National Engineering Co. is based in Karachi, Pakistan.',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
  logoPath: '/media/brand/nec-logo.svg',
  iconPath: '/media/brand/nec-mark.svg',
  telephone: '+923444850161',
  email: 'nationalengineeringco0@gmail.com',
  whatsapp: 'https://wa.me/923444850161',
  addressLocality: 'Karachi',
  addressCountry: 'PK',
  sameAs: [] as string[]
};

export const publicSections = [
  {path: '/', key: 'home'},
  {path: '/machines', key: 'machines'},
  {path: '/parts', key: 'parts'},
  {path: '/industries', key: 'industries'},
  {path: '/knowledge', key: 'knowledge'},
  {path: '/about', key: 'about'},
  {path: '/contact', key: 'contact'}
] as const;

export const contactLinks = [
  {key: 'whatsapp', href: site.whatsapp, labelKey: 'whatsapp'},
  {key: 'phone', href: `tel:${site.telephone}`, labelKey: 'phone'},
  {key: 'email', href: `mailto:${site.email}`, labelKey: 'email'}
] as const;
