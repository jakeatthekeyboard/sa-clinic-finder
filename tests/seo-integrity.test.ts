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

function getSchemas(html: string): any[] {
  const schemas: any[] = [];
  const regex = /<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g;
  let match;
  while ((match = regex.exec(html)) !== null) {
    try { schemas.push(JSON.parse(match[1])); } catch {}
  }
  return schemas;
}

describe('BreadcrumbList — key sections have breadcrumb schema', () => {
  it('all guide pages have BreadcrumbList', () => {
    const guidesDir = join(DIST, 'guides');
    const guideDirs = readdirSync(guidesDir, { withFileTypes: true })
      .filter(d => d.isDirectory())
      .map(d => d.name);
    expect(guideDirs.length).toBeGreaterThanOrEqual(13);

    const missing: string[] = [];
    for (const slug of guideDirs) {
      const html = readFileSync(join(guidesDir, slug, 'index.html'), 'utf-8');
      const schemas = getSchemas(html);
      if (!schemas.some(s => s['@type'] === 'BreadcrumbList')) {
        missing.push(slug);
      }
    }
    expect(missing, `Guides missing BreadcrumbList: ${missing.join(', ')}`).toHaveLength(0);
  });

  it('all province pages have BreadcrumbList', () => {
    const clinicsDir = join(DIST, 'clinics');
    const provDirs = readdirSync(clinicsDir, { withFileTypes: true })
      .filter(d => d.isDirectory() && !d.name.startsWith('.'))
      .map(d => d.name);
    expect(provDirs.length).toBeGreaterThanOrEqual(9);

    const missing: string[] = [];
    for (const slug of provDirs) {
      const indexFile = join(clinicsDir, slug, 'index.html');
      if (!existsSync(indexFile)) continue;
      const html = readFileSync(indexFile, 'utf-8');
      const schemas = getSchemas(html);
      if (!schemas.some(s => s['@type'] === 'BreadcrumbList')) {
        missing.push(slug);
      }
    }
    expect(missing, `Provinces missing BreadcrumbList: ${missing.join(', ')}`).toHaveLength(0);
  });

  it('all service pages have BreadcrumbList', () => {
    const servicesDir = join(DIST, 'services');
    const svcDirs = readdirSync(servicesDir, { withFileTypes: true })
      .filter(d => d.isDirectory())
      .map(d => d.name);
    expect(svcDirs.length).toBeGreaterThanOrEqual(11);

    const missing: string[] = [];
    for (const slug of svcDirs) {
      const html = readFileSync(join(servicesDir, slug, 'index.html'), 'utf-8');
      const schemas = getSchemas(html);
      if (!schemas.some(s => s['@type'] === 'BreadcrumbList')) {
        missing.push(slug);
      }
    }
    expect(missing, `Services missing BreadcrumbList: ${missing.join(', ')}`).toHaveLength(0);
  });

  it('index pages have BreadcrumbList', () => {
    const indexPages = ['clinics', 'services', 'guides'];
    const missing: string[] = [];
    for (const page of indexPages) {
      const html = readFileSync(join(DIST, page, 'index.html'), 'utf-8');
      const schemas = getSchemas(html);
      if (!schemas.some(s => s['@type'] === 'BreadcrumbList')) {
        missing.push(page);
      }
    }
    expect(missing, `Index pages missing BreadcrumbList: ${missing.join(', ')}`).toHaveLength(0);
  });
});

describe('HowTo schemas — province and service pages', () => {
  it('all province pages have HowTo with 4+ steps', () => {
    const clinicsDir = join(DIST, 'clinics');
    const provDirs = readdirSync(clinicsDir, { withFileTypes: true })
      .filter(d => d.isDirectory() && !d.name.startsWith('.'))
      .map(d => d.name);

    const failures: string[] = [];
    for (const slug of provDirs) {
      const indexFile = join(clinicsDir, slug, 'index.html');
      if (!existsSync(indexFile)) continue;
      const html = readFileSync(indexFile, 'utf-8');
      const schemas = getSchemas(html);
      const howTo = schemas.find(s => s['@type'] === 'HowTo');
      if (!howTo) {
        failures.push(`${slug}: missing HowTo`);
      } else if (!howTo.step || howTo.step.length < 4) {
        failures.push(`${slug}: HowTo has ${howTo.step?.length ?? 0} steps (need 4+)`);
      }
    }
    expect(failures, failures.join('\n')).toHaveLength(0);
  });

  it('all service pages have HowTo with 4+ steps', () => {
    const servicesDir = join(DIST, 'services');
    const svcDirs = readdirSync(servicesDir, { withFileTypes: true })
      .filter(d => d.isDirectory())
      .map(d => d.name);

    const failures: string[] = [];
    for (const slug of svcDirs) {
      const html = readFileSync(join(servicesDir, slug, 'index.html'), 'utf-8');
      const schemas = getSchemas(html);
      const howTo = schemas.find(s => s['@type'] === 'HowTo');
      if (!howTo) {
        failures.push(`${slug}: missing HowTo`);
      } else if (!howTo.step || howTo.step.length < 4) {
        failures.push(`${slug}: HowTo has ${howTo.step?.length ?? 0} steps (need 4+)`);
      }
    }
    expect(failures, failures.join('\n')).toHaveLength(0);
  });
});

describe('FAQPage schemas — province and service pages', () => {
  it('all province pages have FAQPage', () => {
    const clinicsDir = join(DIST, 'clinics');
    const provDirs = readdirSync(clinicsDir, { withFileTypes: true })
      .filter(d => d.isDirectory() && !d.name.startsWith('.'))
      .map(d => d.name);

    const missing: string[] = [];
    for (const slug of provDirs) {
      const indexFile = join(clinicsDir, slug, 'index.html');
      if (!existsSync(indexFile)) continue;
      const html = readFileSync(indexFile, 'utf-8');
      const schemas = getSchemas(html);
      if (!schemas.some(s => s['@type'] === 'FAQPage')) {
        missing.push(slug);
      }
    }
    expect(missing, `Provinces missing FAQPage: ${missing.join(', ')}`).toHaveLength(0);
  });

  it('all service pages have FAQPage', () => {
    const servicesDir = join(DIST, 'services');
    const svcDirs = readdirSync(servicesDir, { withFileTypes: true })
      .filter(d => d.isDirectory())
      .map(d => d.name);

    const missing: string[] = [];
    for (const slug of svcDirs) {
      const html = readFileSync(join(servicesDir, slug, 'index.html'), 'utf-8');
      const schemas = getSchemas(html);
      if (!schemas.some(s => s['@type'] === 'FAQPage')) {
        missing.push(slug);
      }
    }
    expect(missing, `Services missing FAQPage: ${missing.join(', ')}`).toHaveLength(0);
  });
});
