import assert from 'node:assert/strict';
import {mkdtemp, mkdir, readFile, rm, writeFile} from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import sharp from 'sharp';

function addExif(jpeg) {
  const tiff = Buffer.alloc(46);
  tiff.write('II', 0, 'ascii');
  tiff.writeUInt16LE(42, 2);
  tiff.writeUInt32LE(8, 4);
  tiff.writeUInt16LE(2, 8);
  tiff.writeUInt16LE(0x013b, 10);
  tiff.writeUInt16LE(2, 12);
  tiff.writeUInt32LE(8, 14);
  tiff.writeUInt32LE(38, 18);
  tiff.writeUInt16LE(0x0112, 22);
  tiff.writeUInt16LE(3, 24);
  tiff.writeUInt32LE(1, 26);
  tiff.writeUInt16LE(6, 30);
  tiff.writeUInt32LE(0, 34);
  tiff.write('Private\0', 38, 'ascii');
  const payload = Buffer.concat([Buffer.from('Exif\0\0', 'binary'), tiff]);
  const segment = Buffer.alloc(4);
  segment[0] = 0xff;
  segment[1] = 0xe1;
  segment.writeUInt16BE(payload.length + 2, 2);
  return Buffer.concat([jpeg.subarray(0, 2), segment, payload, jpeg.subarray(2)]);
}

const tempRoot = await mkdtemp(path.join(os.tmpdir(), 'nec-media-test-'));
try {
  const slug = 'synthetic-media-test';
  const inboxRoot = path.join(tempRoot, 'inbox');
  const publicRoot = path.join(tempRoot, 'public');
  const inputDirectory = path.join(inboxRoot, 'machines', slug);
  await mkdir(inputDirectory, {recursive: true});
  const original = await sharp({create: {width: 1200, height: 1800, channels: 3, background: {r: 30, g: 70, b: 110}}}).jpeg().toBuffer();
  const sourceFile = path.join(inputDirectory, '01.jpg');
  await writeFile(sourceFile, addExif(original));
  assert.ok((await sharp(sourceFile).metadata()).exif, 'synthetic source should contain EXIF metadata');

  const run = spawnSync(process.execPath, ['scripts/optimize-media.mjs', '--slug', slug], {
    cwd: process.cwd(),
    encoding: 'utf8',
    env: {...process.env, MEDIA_INBOX_ROOT: inboxRoot, MEDIA_PUBLIC_ROOT: publicRoot}
  });
  if (run.status !== 0) throw new Error(`Media optimizer failed:\n${run.stdout}\n${run.stderr}`);

  const outputDirectory = path.join(publicRoot, 'machines', slug);
  const manifest = JSON.parse(await readFile(path.join(outputDirectory, 'manifest.json'), 'utf8'));
  assert.equal(manifest.images.length, 1);
  const image = manifest.images[0];
  assert.deepEqual(image.variants.map((variant) => variant.width), [480, 960, 1600]);
  assert.deepEqual(image.variants.map((variant) => variant.height), [320, 640, 1067]);
  assert.deepEqual([image.width, image.height], [1800, 1200], 'EXIF orientation should be applied');
  assert.equal(image.sizes, '(max-width: 760px) 100vw, 900px');
  assert.ok(image.blurDataURL.startsWith('data:image/webp;base64,'));
  assert.ok(Buffer.byteLength(image.blurDataURL, 'utf8') < 1024);

  for (const variant of image.variants) {
    const outputPath = path.join(outputDirectory, variant.file);
    const metadata = await sharp(outputPath).metadata();
    assert.equal(metadata.format, 'webp');
    assert.equal(metadata.width, variant.width);
    assert.equal(metadata.height, variant.height);
    assert.equal(metadata.exif, undefined, 'generated WebP must not contain EXIF metadata');
  }
  const social = await sharp(path.join(outputDirectory, image.social.file)).metadata();
  assert.equal(social.format, 'jpeg');
  assert.deepEqual([social.width, social.height], [1200, 630]);
  assert.equal(social.exif, undefined, 'social image must not contain EXIF metadata');
  console.log('Media pipeline test passed (responsive WebP, auto-rotation, manifest, blur placeholder, EXIF stripping).');
} finally {
  sharp.cache(false);
  let cleanupError;
  for (let attempt = 0; attempt < 8; attempt += 1) {
    try {
      await rm(tempRoot, {recursive: true, force: true});
      cleanupError = undefined;
      break;
    } catch (error) {
      cleanupError = error;
      await new Promise((resolve) => setTimeout(resolve, 300));
    }
  }
  if (cleanupError) throw cleanupError;
}
