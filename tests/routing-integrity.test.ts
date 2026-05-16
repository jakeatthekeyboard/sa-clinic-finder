import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync, readdirSync } from 'fs';
import { join } from 'path';
import * as cheerio from 'cheerio';

const DIST = join(__dirname, '..', 'dist');

function getAllBuiltPages(): string[] {
  if (!existsSync(DIST)) return [];
  const pages: string[] = [];
  function walk(dir: string) {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if (entry.isDirectory()) {
        walk(join(dir, entry.name));
      } else if (entry.name === 'index.html') {
        pages.push(dir.replace(DIST, '') || '/');
      }
    }
  }
  walk(DIST);
  return pages;
}

function getBuiltPaths(): Set<string> {
  return new Set(getAllBuiltPages().map(p => p.replace(/\/$/, '') || '/'));
}

describe('Internal link integrity — no broken internal links', () => {
  const builtPaths = getBuiltPaths();
  if (builtPaths.size === 0) return;

  it('has 1000+ built pages', () => {
    expect(builtPaths.size).toBeGreaterThan(1000);
  });

  const samplePages = getAllBuiltPages()
    .filter(p => !p.includes('/_'))
    .sort(() => Math.random() - 0.5)
    .slice(0, 50);

  it('50 random pages have no broken internal links', () => {
    const broken: string[] = [];

    for (const pagePath of samplePages) {
      const file = join(DIST, pagePath, 'index.html');
      if (!existsSync(file)) continue;
      const $ = cheerio.load(readFileSync(file, 'utf-8'));

      $('a[href^="/"]').each((_, el) => {
        const href = $(el).attr('href');
        if (!href) return;
        const clean = href.split('?')[0].split('#')[0].replace(/\/$/, '') || '/';
        if (clean.startsWith('/_')) return;
        if (!builtPaths.has(clean)) {
          broken.push(`${pagePath} → ${href}`);
        }
      });
    }

    expect(broken.length, `Broken internal links:\n${broken.slice(0, 20).join('\n')}`).toBe(0);
  });
});

describe('No duplicate titles across page types', () => {
  it('province pages have unique titles', () => {
    const provDir = join(DIST, 'clinics');
    if (!existsSync(provDir)) return;

    const titles: Record<string, string> = {};
    const duplicates: string[] = [];

    for (const entry of readdirSync(provDir, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      const file = join(provDir, entry.name, 'index.html');
      if (!existsSync(file)) continue;
      const $ = cheerio.load(readFileSync(file, 'utf-8'));
      const title = $('title').text();
      if (titles[title]) {
        duplicates.push(`"${title}" on /clinics/${entry.name} and ${titles[title]}`);
      }
      titles[title] = `/clinics/${entry.name}`;
    }

    expect(duplicates.length, duplicates.join('\n')).toBe(0);
  });

  it('service pages have unique titles', () => {
    const svcDir = join(DIST, 'services');
    if (!existsSync(svcDir)) return;

    const titles: Record<string, string> = {};
    const duplicates: string[] = [];

    for (const entry of readdirSync(svcDir, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      const file = join(svcDir, entry.name, 'index.html');
      if (!existsSync(file)) continue;
      const $ = cheerio.load(readFileSync(file, 'utf-8'));
      const title = $('title').text();
      if (titles[title]) {
        duplicates.push(`"${title}" on /services/${entry.name} and ${titles[title]}`);
      }
      titles[title] = `/services/${entry.name}`;
    }

    expect(duplicates.length, duplicates.join('\n')).toBe(0);
  });

  it('guide pages have unique titles', () => {
    const guideDir = join(DIST, 'guides');
    if (!existsSync(guideDir)) return;

    const titles: Record<string, string> = {};
    const duplicates: string[] = [];

    for (const entry of readdirSync(guideDir, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      const file = join(guideDir, entry.name, 'index.html');
      if (!existsSync(file)) continue;
      const $ = cheerio.load(readFileSync(file, 'utf-8'));
      const title = $('title').text();
      if (titles[title]) {
        duplicates.push(`"${title}" on /guides/${entry.name} and ${titles[title]}`);
      }
      titles[title] = `/guides/${entry.name}`;
    }

    expect(duplicates.length, duplicates.join('\n')).toBe(0);
  });
});

describe('Meta robots — noindex on legal pages', () => {
  it('core pages are not noindexed', () => {
    const corePages = ['', 'clinics', 'services', 'search'];
    const wronglyNoindexed: string[] = [];

    for (const slug of corePages) {
      const file = join(DIST, slug, 'index.html');
      if (!existsSync(file)) continue;
      const $ = cheerio.load(readFileSync(file, 'utf-8'));
      const robots = $('meta[name="robots"]').attr('content') || '';
      if (robots.includes('noindex')) {
        wronglyNoindexed.push(`/${slug}`);
      }
    }

    expect(wronglyNoindexed.length, `Core pages with noindex: ${wronglyNoindexed.join(', ')}`).toBe(0);
  });

  it('legal pages ARE noindexed', () => {
    const legalPages = ['privacy', 'terms', 'contact'];
    const missingNoindex: string[] = [];

    for (const slug of legalPages) {
      const file = join(DIST, slug, 'index.html');
      if (!existsSync(file)) continue;
      const $ = cheerio.load(readFileSync(file, 'utf-8'));
      const robots = $('meta[name="robots"]').attr('content') || '';
      if (!robots.includes('noindex')) {
        missingNoindex.push(`/${slug}`);
      }
    }

    expect(missingNoindex.length, `Legal pages missing noindex: ${missingNoindex.join(', ')}`).toBe(0);
  });
});

describe('Navigation integrity', () => {
  const builtPaths = getBuiltPaths();

  it('all nav links resolve to built pages', () => {
    const file = join(DIST, 'index.html');
    if (!existsSync(file)) return;
    const $ = cheerio.load(readFileSync(file, 'utf-8'));
    const navLinks: string[] = [];
    $('nav a[href^="/"]').each((_, el) => {
      const href = $(el).attr('href');
      if (href) navLinks.push(href);
    });

    const unique = [...new Set(navLinks)];
    expect(unique.length).toBeGreaterThan(2);

    const broken: string[] = [];
    for (const link of unique) {
      const clean = link.split('?')[0].split('#')[0].replace(/\/$/, '') || '/';
      if (!builtPaths.has(clean)) broken.push(link);
    }

    expect(broken.length, `Broken nav links:\n${broken.join('\n')}`).toBe(0);
  });

  it('all footer links resolve to built pages', () => {
    const file = join(DIST, 'index.html');
    if (!existsSync(file)) return;
    const $ = cheerio.load(readFileSync(file, 'utf-8'));
    const footerLinks: string[] = [];
    $('footer a[href^="/"]').each((_, el) => {
      const href = $(el).attr('href');
      if (href) footerLinks.push(href);
    });

    const broken: string[] = [];
    for (const link of footerLinks) {
      const clean = link.split('?')[0].split('#')[0].replace(/\/$/, '') || '/';
      if (!builtPaths.has(clean)) broken.push(link);
    }

    expect(broken.length, `Broken footer links:\n${broken.join('\n')}`).toBe(0);
  });
});

describe('Content integrity', () => {
  it('no "undefined" or "NaN" in visible page text', () => {
    const contentPages = ['', 'clinics', 'services', 'clinics/gauteng', 'services/hiv-testing'];
    const problems: string[] = [];
    for (const slug of contentPages) {
      const file = join(DIST, slug, 'index.html');
      if (!existsSync(file)) continue;
      const $ = cheerio.load(readFileSync(file, 'utf-8'));
      $('script, style, noscript').remove();
      const mainText = $('main').text() || $('body').text();
      if (/\bundefined\b/.test(mainText)) {
        problems.push(`/${slug} contains "undefined"`);
      }
      if (/\bNaN\b/.test(mainText)) {
        problems.push(`/${slug} contains "NaN"`);
      }
    }
    expect(problems.length, problems.join('\n')).toBe(0);
  });
});
