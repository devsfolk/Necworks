import {expect, test} from '@playwright/test';

const pages = ['/', '/machines', '/parts', '/knowledge', '/about', '/contact'];

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
  await expect(page.locator('a[href="/ur"]')).toBeVisible();
});
