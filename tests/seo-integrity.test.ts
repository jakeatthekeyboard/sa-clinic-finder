import { describe, it, expect, beforeAll } from 'vitest';
import { readFileSync, existsSync, readdirSync } from 'fs';
import { execSync } from 'child_process';
import { join } from 'path';
import * as cheerio from 'cheerio';

const DIST = join(__dirname, '..', 'dist');

beforeAll(() => {
  if (!existsSync(join(DIST, 'index.html'))) {
    execSync('node_modules/.bin/astro build', { cwd: join(__dirname, '..'), stdio: 'pipe' });
  }
}, 120000);

/** Recursively walk dist and return relative paths to every index.html */
function getBuiltPaths(): string[] {
  const paths: string[] = [];
  function walk(dir: string, rel: string) {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if (entry.isDirectory()) {
        walk(join(dir, entry.name), `${rel}/${entry.name}`);
      } else if (entry.name === 'index.html') {
        paths.push(rel || '/');
      }
    }
  }
  walk(DIST, '');
  return paths;
}

describe('Canonical URLs — every page has a self-referencing canonical', () => {
  let paths: string[];
  beforeAll(() => { paths = getBuiltPaths(); });

  it('found pages to test', () => {
    expect(paths.length).toBeGreaterThan(100);
  });

  it('every page has a self-referencing canonical', () => {
    const failures: string[] = [];

    for (const rel of paths) {
      const file = rel === '/'
        ? join(DIST, 'index.html')
        : join(DIST, rel.slice(1), 'index.html');
      const html = readFileSync(file, 'utf-8');
      const $ = cheerio.load(html);
      const canonical = $('link[rel="canonical"]').attr('href');

      if (!canonical) {
        failures.push(`${rel}: missing canonical tag`);
        continue;
      }

      try {
        const url = new URL(canonical);
        // Normalize: strip trailing slash for comparison (except root "/")
        const canonicalPath = url.pathname === '/' ? '/' : url.pathname.replace(/\/$/, '');
        const expectedPath = rel === '/' ? '/' : rel;

        if (canonicalPath !== expectedPath) {
          failures.push(`${rel}: canonical path "${canonicalPath}" does not match expected "${expectedPath}"`);
        }
      } catch {
        failures.push(`${rel}: invalid canonical URL "${canonical}"`);
      }
    }

    expect(failures.slice(0, 20), `Canonical mismatches:\n${failures.slice(0, 20).join('\n')}`).toHaveLength(0);
  });
});

describe('H1 tags — every page has exactly one H1', () => {
  let paths: string[];
  beforeAll(() => { paths = getBuiltPaths(); });

  it('every page has exactly one H1', () => {
    const failures: string[] = [];

    for (const rel of paths) {
      const file = rel === '/'
        ? join(DIST, 'index.html')
        : join(DIST, rel.slice(1), 'index.html');
      const html = readFileSync(file, 'utf-8');
      const $ = cheerio.load(html);
      const h1Count = $('h1').length;

      if (h1Count !== 1) {
        failures.push(`${rel}: found ${h1Count} H1 tags (expected 1)`);
      }
    }

    expect(failures.slice(0, 20), `H1 issues:\n${failures.slice(0, 20).join('\n')}`).toHaveLength(0);
  });
});

describe('Title uniqueness — no duplicate titles across the site', () => {
  let paths: string[];
  beforeAll(() => { paths = getBuiltPaths(); });

  it('no duplicate page titles', () => {
    const titleMap = new Map<string, string[]>();

    for (const rel of paths) {
      const file = rel === '/'
        ? join(DIST, 'index.html')
        : join(DIST, rel.slice(1), 'index.html');
      const html = readFileSync(file, 'utf-8');
      const $ = cheerio.load(html);
      const title = $('title').text().trim();

      if (!title) continue; // missing title is a different issue

      const existing = titleMap.get(title) || [];
      existing.push(rel);
      titleMap.set(title, existing);
    }

    const duplicates: string[] = [];
    for (const [title, pages] of titleMap) {
      if (pages.length > 1) {
        duplicates.push(`"${title}" used by: ${pages.join(', ')}`);
      }
    }

    expect(duplicates.slice(0, 20), `Duplicate titles:\n${duplicates.slice(0, 20).join('\n')}`).toHaveLength(0);
  });
});
