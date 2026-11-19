import type {Metadata} from 'next';
import {notFound} from 'next/navigation';
import {hasLocale, NextIntlClientProvider} from 'next-intl';
import {getMessages, setRequestLocale} from 'next-intl/server';
import {Noto_Nastaliq_Urdu, Inter} from 'next/font/google';
import {routing} from '@/i18n/routing';
import {Header} from '@/components/Header';
import {Footer} from '@/components/Footer';
import '../globals.css';

const urduFont = Noto_Nastaliq_Urdu({subsets: ['arabic'], weight: ['400'], variable: '--font-urdu'});
const englishFont = Inter({subsets: ['latin'], variable: '--font-english'});

export const metadata: Metadata = {
  title: 'National Engineering Co.',
  description: 'National Engineering Co. website'
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

export default async function LocaleLayout({children, params}: Readonly<{children: React.ReactNode; params: Promise<{locale: string}>}>) {
  const {locale} = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const messages = await getMessages();
  const isUrdu = locale === 'ur';
  return (
    <html lang={locale} dir={isUrdu ? 'rtl' : 'ltr'} className={`${englishFont.variable} ${isUrdu ? urduFont.variable : ''}`}>
      <body className={isUrdu ? 'font-[family-name:var(--font-urdu)]' : 'font-[family-name:var(--font-english)]'}>
        <NextIntlClientProvider messages={messages}>
          <Header />{children}<Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
