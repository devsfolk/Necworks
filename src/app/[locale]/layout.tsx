import type {Metadata} from 'next';
import {notFound} from 'next/navigation';
import {hasLocale, NextIntlClientProvider} from 'next-intl';
import {getMessages, setRequestLocale} from 'next-intl/server';
import {Barlow_Condensed, Inter, JetBrains_Mono, Noto_Nastaliq_Urdu} from 'next/font/google';
import {routing} from '@/i18n/routing';
import {Header} from '@/components/Header';
import {Footer} from '@/components/Footer';
import {FloatingContactButtons} from '@/components/FloatingContactButtons';
import {AnalyticsEvents} from '@/components/AnalyticsEvents';
import {GoogleAnalytics} from '@next/third-parties/google';
import {site} from '@/lib/site';
import '../globals.css';

const urduFont = Noto_Nastaliq_Urdu({subsets: ['arabic'], weight: ['400'], variable: '--font-urdu'});
const headingFont = Barlow_Condensed({subsets: ['latin'], weight: ['500', '600', '700'], variable: '--font-heading'});
const bodyFont = Inter({subsets: ['latin'], variable: '--font-body'});
const drawingFont = JetBrains_Mono({subsets: ['latin'], variable: '--font-drawing'});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  icons: {
    icon: [{url: site.iconPath, type: 'image/svg+xml'}],
    shortcut: [{url: site.iconPath, type: 'image/svg+xml'}],
    apple: [{url: site.iconPath, type: 'image/svg+xml'}]
  }
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
    <html lang={locale} dir={isUrdu ? 'rtl' : 'ltr'} className={`${headingFont.variable} ${bodyFont.variable} ${drawingFont.variable} ${urduFont.variable}`}>
      <body className={isUrdu ? 'font-urdu' : 'font-body'}>
        <NextIntlClientProvider messages={messages}>
          <div className="app-shell">
            <Header />
            {children}
            <Footer />
          </div>
          <FloatingContactButtons />
          <AnalyticsEvents />
          {process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_GA_ID ? (
            <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
          ) : null}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
