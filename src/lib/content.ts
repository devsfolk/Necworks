import {readdir, readFile} from 'node:fs/promises';
import path from 'node:path';
import {z} from 'zod';

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

export type MachineContent = z.infer<typeof machineSchema>;

const contentDirectory = path.join(process.cwd(), 'content', 'machines');

function isAvailable(machine: MachineContent, now = new Date()) {
  return !machine.published_at || new Date(machine.published_at) <= now;
}

export async function getMachines() {
  const filenames = (await readdir(contentDirectory)).filter((filename) => filename.endsWith('.json')).sort();
  const machines = await Promise.all(filenames.map(async (filename) => {
    const content = await readFile(path.join(contentDirectory, filename), 'utf8');
    const parsed = machineSchema.parse(JSON.parse(content));
    if (parsed.slug !== path.basename(filename, '.json')) {
      throw new Error(`${filename}: slug must match the filename`);
    }
    return parsed;
  }));
  return machines.filter((machine) => isAvailable(machine));
}

export async function getMachine(slug: string) {
  const machines = await getMachines();
  return machines.find((machine) => machine.slug === slug) ?? null;
}

export async function getPublishedMachines() {
  return (await getMachines()).filter((machine) => machine.status === 'published');
}
