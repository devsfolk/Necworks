import {site, publicSections} from '@/lib/site';

export function GET() {
  const lines = [
    `# ${site.name}`,
    '',
    site.llmsDescription,
    '',
    '## Main sections',
    ...publicSections.map(({path, key}) => `- ${key}: ${new URL(path, site.url).toString()}`)
  ];
  return new Response(`${lines.join('\n')}\n`, {
    headers: {'Content-Type': 'text/plain; charset=utf-8'}
  });
}
