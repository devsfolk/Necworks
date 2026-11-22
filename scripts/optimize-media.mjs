import {copyFile, mkdir, readFile, readdir, stat, writeFile} from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const types = ['machines', 'knowledge', 'projects'];
const targetWidths = [480, 960, 1600];
const supportedImages = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif', '.tif', '.tiff']);
const supportedVideos = new Set(['.mp4', '.mov']);
const videoLimit = 5 * 1024 * 1024;
const root = process.cwd();
const inboxRoot = path.resolve(process.env.MEDIA_INBOX_ROOT || path.join(root, 'media-inbox'));
const publicRoot = path.resolve(process.env.MEDIA_PUBLIC_ROOT || path.join(root, 'public', 'media'));
const args = process.argv.slice(2);
const slugArgument = args.indexOf('--slug');
const selectedSlug = slugArgument === -1 ? undefined : args[slugArgument + 1];
const dryRun = args.includes('--dry-run');

if (slugArgument !== -1 && (!selectedSlug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(selectedSlug))) {
  throw new Error('Use --slug followed by a lowercase slug containing letters, numbers, and hyphens.');
}

function outputName(source, suffix, extension) {
  return `${path.parse(source).name}-${suffix}.${extension}`;
}

async function fileIsNewer(output, inputInfo) {
  try {
    return (await stat(output)).mtimeMs >= inputInfo.mtimeMs;
  } catch {
    return false;
  }
}

async function makeVariants(inputFile, outputDirectory, sourceName, inputInfo, dryRunMode) {
  const image = sharp(inputFile, {failOn: 'error'});
  const metadata = await image.metadata();
  if (!metadata.width || !metadata.height) throw new Error(`Cannot read image dimensions: ${inputFile}`);
  const swapped = metadata.orientation !== undefined && metadata.orientation >= 5 && metadata.orientation <= 8;
  const width = swapped ? metadata.height : metadata.width;
  const height = swapped ? metadata.width : metadata.height;
  const widths = targetWidths.filter((target) => target <= width);
  if (widths.length === 0) widths.push(width);
  const variants = [];

  for (const target of widths) {
    const filename = outputName(sourceName, target, 'webp');
    const destination = path.join(outputDirectory, filename);
    if (!dryRunMode && !(await fileIsNewer(destination, inputInfo))) {
      await sharp(inputFile, {failOn: 'error'}).rotate().resize({width: target, withoutEnlargement: true}).webp({quality: 78}).toFile(destination);
    }
    variants.push({file: filename, width: Math.min(target, width), height: Math.round(height * Math.min(target, width) / width)});
  }

  let blurDataURL = '';
  if (!dryRunMode) {
    const blurred = await sharp(inputFile, {failOn: 'error'}).rotate().resize({width: 16, withoutEnlargement: true}).webp({quality: 35}).toBuffer();
    blurDataURL = `data:image/webp;base64,${blurred.toString('base64')}`;
    if (Buffer.byteLength(blurDataURL, 'utf8') >= 1024) throw new Error(`Blur placeholder is too large for ${inputFile}`);
  }

  return {source: sourceName, width, height, sizes: '(max-width: 760px) 100vw, 900px', variants, blurDataURL};
}

async function getExistingManifest(manifestFile) {
  try {
    return JSON.parse(await readFile(manifestFile, 'utf8'));
  } catch {
    return {images: [], videos: []};
  }
}

async function directorySize(directory) {
  let total = 0;
  let entries;
  try {
    entries = await readdir(directory, {withFileTypes: true});
  } catch {
    return 0;
  }
  for (const entry of entries) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) total += await directorySize(entryPath);
    else total += (await stat(entryPath)).size;
  }
  return total;
}

async function optimizeFolder(type, slug) {
  const inputDirectory = path.join(inboxRoot, type, slug);
  let inputNames;
  try {
    inputNames = (await readdir(inputDirectory)).sort((left, right) => left.localeCompare(right, undefined, {numeric: true}));
  } catch {
    return null;
  }

  const outputDirectory = path.join(publicRoot, type, slug);
  const manifestFile = path.join(outputDirectory, 'manifest.json');
  const previous = dryRun ? {images: [], videos: []} : await getExistingManifest(manifestFile);
  const images = [];
  const videos = [];
  let processed = 0;
  let skipped = 0;
  let copiedVideos = 0;
  let skippedVideos = 0;
  let hasSocialImage = false;

  for (const filename of inputNames) {
    const inputFile = path.join(inputDirectory, filename);
    const extension = path.extname(filename).toLowerCase();
    const inputInfo = await stat(inputFile);
    if (supportedImages.has(extension)) {
      if (!dryRun) await mkdir(outputDirectory, {recursive: true});
      const previousImage = previous.images.find((image) => image.source === filename);
      const outputsFresh = previousImage?.variants?.length && (await Promise.all(previousImage.variants.map(({file}) => fileIsNewer(path.join(outputDirectory, file), inputInfo)))).every(Boolean);
      if (outputsFresh && !dryRun) {
        images.push(previousImage);
        skipped += 1;
      } else {
        images.push(await makeVariants(inputFile, outputDirectory, filename, inputInfo, dryRun));
        processed += 1;
      }

      if (!hasSocialImage && !filename.toLowerCase().includes('-poster.')) {
        const socialName = `${path.parse(filename).name}-social.jpg`;
        const socialFile = path.join(outputDirectory, socialName);
        if (!dryRun && !(await fileIsNewer(socialFile, inputInfo))) {
          await sharp(inputFile, {failOn: 'error'}).rotate().resize(1200, 630, {fit: 'cover', position: 'centre'}).jpeg({quality: 82}).toFile(socialFile);
        }
        images[images.length - 1].social = {file: socialName, width: 1200, height: 630};
        hasSocialImage = true;
      }
    } else if (supportedVideos.has(extension)) {
      if (inputInfo.size > videoLimit) {
        console.warn(`${type}/${slug}/${filename} is over 5 MB: too large for Git, host on YouTube (unlisted) and add the id to the machine JSON`);
        skippedVideos += 1;
        continue;
      }
      const destination = path.join(outputDirectory, filename);
      if (!dryRun) {
        await mkdir(outputDirectory, {recursive: true});
        if (!(await fileIsNewer(destination, inputInfo))) await copyFile(inputFile, destination);
      }
      videos.push({file: filename, size: inputInfo.size});
      copiedVideos += 1;
    }
  }

  if (!dryRun) {
    await mkdir(outputDirectory, {recursive: true});
    const manifest = {images, videos};
    await writeFile(manifestFile, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
  }

  const size = await directorySize(outputDirectory);
  return {type, slug, processed, skipped, copiedVideos, skippedVideos, size};
}

const folders = [];
for (const type of types) {
  const typeDirectory = path.join(inboxRoot, type);
  let slugs = [];
  try {
    slugs = selectedSlug ? [selectedSlug] : await readdir(typeDirectory);
  } catch {
    continue;
  }
  for (const slug of slugs) {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) continue;
    const result = await optimizeFolder(type, slug);
    if (result) folders.push(result);
  }
}

const totals = folders.reduce((sum, folder) => ({
  processed: sum.processed + folder.processed,
  skipped: sum.skipped + folder.skipped,
  copiedVideos: sum.copiedVideos + folder.copiedVideos,
  skippedVideos: sum.skippedVideos + folder.skippedVideos,
  size: sum.size + folder.size
}), {processed: 0, skipped: 0, copiedVideos: 0, skippedVideos: 0, size: 0});
console.log(`${dryRun ? 'Dry run: ' : ''}${folders.length} folder(s), ${totals.processed} image(s) processed, ${totals.skipped} skipped, ${totals.copiedVideos} small video(s) copied, ${totals.skippedVideos} large video(s) skipped, ${(totals.size / (1024 * 1024)).toFixed(2)} MB output total.`);
