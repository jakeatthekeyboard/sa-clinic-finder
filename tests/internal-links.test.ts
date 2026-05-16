import { describe, it, expect, beforeAll } from 'vitest';
import { execSync } from 'child_process';
import { readFileSync, existsSync, readdirSync } from 'fs';
import { join } from 'path';
import * as cheerio from 'cheerio';

const DIST = join(__dirname, '..', 'dist');

beforeAll(() => {
  if (!existsSync(join(DIST, 'index.html'))) {
    execSync('node_modules/.bin/astro build', { cwd: join(__dirname, '..'), stdio: 'pipe' });
  }
}, 120000);

function getAllHtmlFiles(dir: string): string[] {
  const results: string[] = [];
  if (!existsSync(dir)) return results;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) results.push(...getAllHtmlFiles(full));
    else if (entry.name === 'index.html') results.push(full);
  }
  return results;
}

function resolveInternalLink(href: string): string | null {
  if (!href.startsWith('/')) return null;
  if (href.includes('#')) href = href.split('#')[0];
  if (href.includes('?')) href = href.split('?')[0];
  if (!href || href === '/') return '/';
  href = href.replace(/\/$/, '');
  return href;
}

describe('Internal link integrity (dist scan)', () => {
  it('all internal <a href="/..."> links resolve to built pages', () => {
    const allFiles = getAllHtmlFiles(DIST);
    const builtPaths = new Set<string>();

    for (const file of allFiles) {
      const rel = file.replace(DIST, '').replace('/index.html', '') || '/';
      builtPaths.add(rel);
    }

    const broken: { source: string; link: string }[] = [];
    const checked = new Set<string>();
    const assetExtensions = ['.css', '.js', '.png', '.jpg', '.svg', '.xml', '.txt', '.ico', '.webp', '.json', '.woff', '.woff2'];

    for (const file of allFiles) {
      const sourcePath = file.replace(DIST, '').replace('/index.html', '') || '/';
      const html = readFileSync(file, 'utf-8');
      const $ = cheerio.load(html);

      $('a[href^="/"]').each((_, el) => {
        const rawHref = $(el).attr('href') || '';
        const resolved = resolveInternalLink(rawHref);
        if (!resolved) return;

        const key = `${sourcePath} -> ${resolved}`;
        if (checked.has(key)) return;
        checked.add(key);

        if (resolved === '/') return;
        if (assetExtensions.some(ext => resolved.endsWith(ext))) return;

        const targetHtml = join(DIST, resolved, 'index.html');
        const targetDirect = join(DIST, resolved);

        if (!existsSync(targetHtml) && !existsSync(targetDirect)) {
          broken.push({ source: sourcePath, link: resolved });
        }
      });
    }

    if (broken.length > 0) {
      const unique = [...new Map(broken.map(b => [b.link, b])).values()];
      const report = unique
        .slice(0, 30)
        .map(b => `  ${b.link} (from ${b.source})`)
        .join('\n');
      expect(
        broken,
        `${broken.length} broken internal links found (${unique.length} unique targets):\n${report}`
      ).toHaveLength(0);
    }
  });
});
