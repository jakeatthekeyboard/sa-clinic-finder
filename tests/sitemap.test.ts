import { describe, it, expect, beforeAll } from 'vitest';
import { execSync } from 'child_process';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const DIST = join(__dirname, '../dist');

beforeAll(() => {
  if (!existsSync(join(DIST, 'index.html'))) {
    execSync('node_modules/.bin/astro build', { cwd: join(__dirname, '..'), stdio: 'pipe' });
  }
}, 120000);

describe('Sitemap coverage', () => {
  it('sitemap-index.xml exists', () => {
    expect(existsSync(join(DIST, 'sitemap-index.xml'))).toBe(true);
  });

  it('sitemap-0.xml exists and has URLs', () => {
    const path = join(DIST, 'sitemap-0.xml');
    expect(existsSync(path)).toBe(true);
    const xml = readFileSync(path, 'utf-8');
    const urlCount = (xml.match(/<loc>/g) || []).length;
    expect(urlCount, `Expected sitemap to have URLs, found ${urlCount}`).toBeGreaterThan(50);
  });

  it('every sitemap URL resolves to a built page', () => {
    const sitemapPath = join(DIST, 'sitemap-0.xml');
    if (!existsSync(sitemapPath)) return;
    const xml = readFileSync(sitemapPath, 'utf-8');
    const sitemapPaths = Array.from(
      xml.matchAll(/<loc>https:\/\/clinicfinder\.co\.za(\/[^<]*)?<\/loc>/g)
    ).map(m => (m[1] ? decodeURIComponent(m[1]).replace(/\/$/, '') : '') || '/');
    const missing = sitemapPaths.filter(p => {
      const htmlPath = join(DIST, p === '/' ? 'index.html' : `${p}/index.html`);
      return !existsSync(htmlPath);
    });
    expect(
      missing.length,
      `${missing.length} sitemap URLs have no built page:\n${missing.slice(0, 20).join('\n')}`
    ).toBe(0);
  });

  it('key pages are in the sitemap', () => {
    const sitemapPath = join(DIST, 'sitemap-0.xml');
    if (!existsSync(sitemapPath)) return;
    const xml = readFileSync(sitemapPath, 'utf-8');
    const sitemapPaths = new Set(
      Array.from(
        xml.matchAll(/<loc>https:\/\/clinicfinder\.co\.za(\/[^<]*)?<\/loc>/g)
      ).map(m => (m[1] ? decodeURIComponent(m[1]).replace(/\/$/, '') : '') || '/')
    );

    const requiredPages = [
      '/',
      '/clinics',
    ];
    const missing = requiredPages.filter(p => !sitemapPaths.has(p));
    expect(
      missing.length,
      `Required pages missing from sitemap:\n${missing.join('\n')}`
    ).toBe(0);
  });
});
