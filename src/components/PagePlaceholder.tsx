import {useTranslations} from 'next-intl';

type PagePlaceholderProps = {titleKey: string};

export function PagePlaceholder({titleKey}: PagePlaceholderProps) {
  const page = useTranslations('Pages');
  const common = useTranslations('Common');
  return (
    <main className="mx-auto min-h-[55vh] max-w-6xl px-6 py-16">
      <h1 className="text-3xl font-semibold">{page(titleKey)}</h1>
      <p className="mt-4">{common('comingSoon')}</p>
    </main>
  );
}
