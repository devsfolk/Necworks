import {readdir, readFile} from 'node:fs/promises';
import path from 'node:path';
import {z} from 'zod';

const directory = path.join(process.cwd(), 'content', 'machines');
const machineSchema = z.object({
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  status: z.enum(['draft', 'published']),
  name_en: z.string().min(1),
  name_ur: z.string().min(1),
  category: z.string(),
  summary_en: z.string(),
  summary_ur: z.string(),
  specs: z.array(z.object({label_en: z.string(), label_ur: z.string(), value: z.string()})),
  parts: z.array(z.string()),
  faq: z.array(z.object({q_en: z.string(), a_en: z.string(), q_ur: z.string(), a_ur: z.string()})),
  media: z.array(z.string()),
  published_at: z.string().datetime().optional()
});

const files = (await readdir(directory)).filter((filename) => filename.endsWith('.json')).sort();
const errors = [];
for (const filename of files) {
  try {
    const data = JSON.parse(await readFile(path.join(directory, filename), 'utf8'));
    const parsed = machineSchema.safeParse(data);
    if (!parsed.success) {
      errors.push(`${filename}: ${parsed.error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`).join('; ')}`);
    } else if (parsed.data.slug !== path.basename(filename, '.json')) {
      errors.push(`${filename}: slug must match the filename`);
    }
  } catch (error) {
    errors.push(`${filename}: ${error instanceof Error ? error.message : String(error)}`);
  }
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exitCode = 1;
} else {
  console.log(`Content check passed (${files.length} machine file${files.length === 1 ? '' : 's'}).`);
}
