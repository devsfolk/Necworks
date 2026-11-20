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

test('English home page includes a language switch link', async ({page}) => {
  await page.goto('/');
  const languageSwitches = page.locator('a[href="/ur"]');
  await expect(languageSwitches).toHaveCount(2);
  await expect(languageSwitches.first()).toBeVisible();
  await expect(languageSwitches.last()).toBeHidden();
});

test('design shell exposes header, footer, WhatsApp, and machine tabs in both locales', async ({page}) => {
  for (const path of ['/', '/ur']) {
    await page.goto(path);
    await expect(page.locator('header.site-header')).toBeVisible();
    await expect(page.locator('footer.site-footer')).toBeVisible();
    await expect(page.locator('a[href="https://wa.me/923444850161"]')).toBeVisible();
    await expect(page.getByRole('tab')).toHaveCount(6);
  }
});

test('machine selection updates the heading and quote destination', async ({page}) => {
  await page.goto('/');
  await page.getByRole('tab', {name: 'Circular Loom'}).click();
  await expect(page.getByRole('heading', {name: 'Circular Loom'})).toBeVisible();
  await expect(page.getByRole('link', {name: 'Get a Quote'}).last()).toHaveAttribute('href', '/contact?machine=circular-loom');
});
