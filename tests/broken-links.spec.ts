import { test, expect } from '@playwright/test';

const SEED_PAGES = [
  '/',
  '/clinics/',
  '/services/',
  '/guides/',
  '/search/',
  '/clinics/gauteng/',
  '/clinics/western-cape/',
  '/services/hiv-testing/',
];

test.describe('Broken link crawler', () => {
  test('all internal links return 200', async ({ page, baseURL }) => {
    const visited = new Set<string>();
    const broken: { source: string; link: string; status: number }[] = [];

    for (const seed of SEED_PAGES) {
      const url = `${baseURL}${seed}`;
      const res = await page.goto(url);

      if (!res || res.status() !== 200) {
        broken.push({ source: 'SEED', link: seed, status: res?.status() ?? 0 });
        continue;
      }

      const links = await page.$$eval('a[href]', (anchors) =>
        anchors
          .map((a) => a.getAttribute('href') || '')
          .filter((href) => href.startsWith('/') && !href.includes('#'))
      );

      for (const link of links) {
        const normalised = link.endsWith('/') || link.includes('.') ? link : `${link}/`;
        if (visited.has(normalised)) continue;
        visited.add(normalised);

        const linkRes = await page.goto(`${baseURL}${normalised}`);
        const status = linkRes?.status() ?? 0;

        if (status !== 200) {
          broken.push({ source: seed, link: normalised, status });
        }
      }
    }

    if (broken.length > 0) {
      const report = broken
        .map((b) => `  ${b.link} → ${b.status} (found on ${b.source})`)
        .join('\n');
      expect(broken, `Broken links found:\n${report}`).toHaveLength(0);
    }
  });
});
