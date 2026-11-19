import {readdir, readFile} from 'node:fs/promises';
import path from 'node:path';
import {TextDecoder} from 'node:util';

const root = process.cwd();
const ignored = new Set(['.git', 'node_modules', '.next', 'out', 'build', '.vercel']);
const textExtensions = new Set(['.json', '.md', '.txt', '.ts', '.tsx', '.js', '.mjs', '.cjs', '.css', '.html', '.yml', '.yaml', '.xml', '.svg', '.toml', '.editorconfig', '.gitattributes', '.gitignore']);
const decoder = new TextDecoder('utf-8', {fatal: true});
const suspicious = /\uFFFD|\u00C3.|\u00C2.|\u00E2\u20AC|\u00F0\u0178|\u00EF\u00BB\u00BF/u;
const failures = [];

async function visit(directory) {
  for (const entry of await readdir(directory, {withFileTypes: true})) {
    if (entry.isDirectory() && ignored.has(entry.name)) continue;
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      await visit(file);
    } else if (textExtensions.has(path.extname(entry.name).toLowerCase()) || ['.gitignore', '.gitattributes', '.editorconfig'].includes(entry.name)) {
      const bytes = await readFile(file);
      let text;
      try {
        text = decoder.decode(bytes);
      } catch {
        failures.push(`${path.relative(root, file)}: invalid UTF-8`);
        continue;
      }
      if (suspicious.test(text)) failures.push(`${path.relative(root, file)}: suspicious broken character sequence`);
      if (text.includes('\r')) failures.push(`${path.relative(root, file)}: CR line ending found; use LF`);
    }
  }
}

await visit(root);
if (failures.length) {
  console.error(failures.join('\n'));
  process.exitCode = 1;
} else {
  console.log('Encoding check passed.');
}
