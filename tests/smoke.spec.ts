import {expect, test} from '@playwright/test';

const pages = ['/', '/machines', '/parts', '/industries', '/knowledge', '/about', '/contact'];

test('placeholder pages return 200 in English and Urdu', async ({request}) => {
  for (const path of pages) {
    const englishResponse = await request.get(path);
    expect(englishResponse.status(), `English route ${path}`).toBe(200);

    const urduPath = path === '/' ? '/ur' : `/ur${path}`;
    const urduResponse = await request.get(urduPath);
    expect(urduResponse.status(), `Urdu route ${urduPath}`).toBe(200);
  }
});

test('home pages expose the expected language and direction', async ({page}) => {
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.locator('html')).toHaveAttribute('dir', 'ltr');

  await page.goto('/ur');
  await expect(page.locator('html')).toHaveAttribute('lang', 'ur');
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
});

test('robots and sitemap routes return 200', async ({request}) => {
  expect((await request.get('/robots.txt')).status()).toBe(200);
  expect((await request.get('/sitemap.xml')).status()).toBe(200);
});

test('home page omits Google Analytics when no measurement ID is configured', async ({page}) => {
  await page.goto('/');
  expect(await page.content()).not.toContain('googletagmanager.com');
});

test('English home page includes a language switch link', async ({page}) => {
  await page.goto('/');
  const languageSwitches = page.locator('a[href="/ur"]');
  await expect(languageSwitches).toHaveCount(2);
  await expect(languageSwitches.first()).toHaveAttribute('data-track', 'language_switch');
  await expect(languageSwitches.first()).toBeVisible();
  await expect(languageSwitches.last()).toBeHidden();
});

test('design shell exposes header, footer, WhatsApp, and machine tabs in both locales', async ({page}) => {
  for (const path of ['/', '/ur']) {
    await page.goto(path);
    await expect(page.locator('header.site-header')).toBeVisible();
    await expect(page.locator('footer.site-footer')).toBeVisible();
    await expect(page.locator('a[href="https://wa.me/923444850161"][data-track="whatsapp_click"]')).toBeVisible();
    await expect(page.getByRole('tab')).toHaveCount(6);
  }
});

test('machine selection updates the heading and quote destination', async ({page}) => {
  await page.goto('/');
  await page.getByRole('tab', {name: 'Circular Loom'}).click();
  await expect(page.getByRole('heading', {name: 'Circular Loom'})).toBeVisible();
  await expect(page.getByRole('link', {name: 'Get a Quote'}).last()).toHaveAttribute('href', '/contact?machine=circular-loom');
});

test('localized canonical and hreflang links are present', async ({page}) => {
  await page.goto('/');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'http://localhost:3000');
  await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveAttribute('href', 'http://localhost:3000');
  await expect(page.locator('link[rel="alternate"][hreflang="ur"]')).toHaveAttribute('href', 'http://localhost:3000/ur');
  await expect(page.locator('link[rel="alternate"][hreflang="x-default"]')).toHaveAttribute('href', 'http://localhost:3000');

  await page.goto('/ur');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'http://localhost:3000/ur');
  await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveAttribute('href', 'http://localhost:3000');
  await expect(page.locator('link[rel="alternate"][hreflang="ur"]')).toHaveAttribute('href', 'http://localhost:3000/ur');
});

test('homepage includes Organization JSON-LD', async ({page}) => {
  await page.goto('/');
  const scripts = page.locator('script[type="application/ld+json"]');
  const jsonLd = await scripts.allTextContents();
  const organization = jsonLd.flatMap((content) => JSON.parse(content)).find((item) => item['@type'] === 'Organization');
  expect(organization).toMatchObject({
    name: 'National Engineering Co.',
    telephone: '+923444850161',
    email: 'nationalengineeringco0@gmail.com',
    address: {addressLocality: 'Karachi', addressCountry: 'PK'}
  });
  expect(organization).not.toHaveProperty('sameAs');
});

test('llms.txt returns plain text', async ({request}) => {
  const response = await request.get('/llms.txt');
  expect(response.status()).toBe(200);
  expect(response.headers()['content-type']).toContain('text/plain');
  expect(await response.text()).toContain('National Engineering Co.');
});

test('draft machine detail is localized and noindex', async ({page, request}) => {
  for (const path of ['/machines/mother-baby-granulator', '/ur/machines/mother-baby-granulator']) {
    const response = await request.get(path);
    expect(response.status()).toBe(200);
    await page.goto(path);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
    await expect(page.locator('.machine-media')).toHaveCount(0);
  }
});

test('unknown machine slug returns 404', async ({request}) => {
  expect((await request.get('/machines/not-a-machine')).status()).toBe(404);
  expect((await request.get('/ur/machines/not-a-machine')).status()).toBe(404);
});

test('sitemap excludes draft machine pages', async ({request}) => {
  const response = await request.get('/sitemap.xml');
  expect(response.status()).toBe(200);
  expect(await response.text()).not.toContain('mother-baby-granulator');
});
