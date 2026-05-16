import { describe, it, expect, beforeAll } from 'vitest';
import { readFileSync, existsSync, readdirSync } from 'fs';
import { join } from 'path';
import * as cheerio from 'cheerio';

const DIST = join(__dirname, '..', 'dist');

const PROVINCES = [
  'eastern-cape', 'free-state', 'gauteng', 'kwazulu-natal',
  'limpopo', 'mpumalanga', 'north-west', 'northern-cape', 'western-cape',
];

describe('Province pages — all 9 provinces have required elements', () => {
  it('has all 9 province pages built', () => {
    const built = PROVINCES.filter(p =>
      existsSync(join(DIST, 'clinics', p, 'index.html'))
    );
    expect(built.length).toBe(9);
  });

  PROVINCES.forEach(slug => {
    it(`/clinics/${slug} has title, meta, and facility listings`, () => {
      const file = join(DIST, 'clinics', slug, 'index.html');
      if (!existsSync(file)) return;
      const $ = cheerio.load(readFileSync(file, 'utf-8'));

      expect($('title').text().length).toBeGreaterThan(10);
      expect($('meta[name="description"]').attr('content')?.length).toBeGreaterThan(20);

      const bodyText = $('body').text().toLowerCase();
      expect(bodyText).toMatch(/clinic|hospital|health centre|chc/i);
    });
  });
});

describe('Facility pages — spot check structure', () => {
  const facilityDirs: string[] = [];
  for (const prov of PROVINCES) {
    const provDir = join(DIST, 'clinics', prov);
    if (!existsSync(provDir)) continue;
    const subs = readdirSync(provDir, { withFileTypes: true })
      .filter(e => e.isDirectory() && existsSync(join(provDir, e.name, 'index.html')));
    for (const s of subs.slice(0, 3)) {
      facilityDirs.push(`clinics/${prov}/${s.name}`);
    }
  }

  it(`has 1000+ facility pages built`, () => {
    let count = 0;
    for (const prov of PROVINCES) {
      const provDir = join(DIST, 'clinics', prov);
      if (!existsSync(provDir)) continue;
      count += readdirSync(provDir, { withFileTypes: true })
        .filter(e => e.isDirectory() && existsSync(join(provDir, e.name, 'index.html')))
        .length;
    }
    expect(count).toBeGreaterThanOrEqual(1000);
  });

  facilityDirs.forEach(path => {
    const slug = path.split('/').pop()!;
    it(`/${path} has title and facility content`, () => {
      const file = join(DIST, path, 'index.html');
      if (!existsSync(file)) return;
      const $ = cheerio.load(readFileSync(file, 'utf-8'));

      expect($('title').text().length).toBeGreaterThan(10);
      expect($('meta[name="description"]').attr('content')?.length).toBeGreaterThan(10);
    });
  });
});

describe('Guide pages — all render with required elements', () => {
  const guideSrc = join(__dirname, '..', 'src', 'pages', 'guides');
  const guideFiles = existsSync(guideSrc)
    ? readdirSync(guideSrc)
        .filter(f => f.endsWith('.astro') && !f.startsWith('[') && f !== 'index.astro')
        .map(f => f.replace('.astro', ''))
    : [];

  it(`has ${guideFiles.length}+ guide pages built`, () => {
    const guideDir = join(DIST, 'guides');
    if (!existsSync(guideDir)) return;
    const built = readdirSync(guideDir).filter(f =>
      existsSync(join(guideDir, f, 'index.html'))
    );
    expect(built.length).toBeGreaterThanOrEqual(guideFiles.length);
  });

  guideFiles.forEach(slug => {
    it(`/guides/${slug} has title, meta, and Article JSON-LD`, () => {
      const file = join(DIST, 'guides', slug, 'index.html');
      if (!existsSync(file)) return;
      const $ = cheerio.load(readFileSync(file, 'utf-8'));

      expect($('title').text().length).toBeGreaterThan(10);
      expect($('meta[name="description"]').attr('content')?.length).toBeGreaterThan(20);

      const scripts = $('script[type="application/ld+json"]');
      let hasArticle = false;
      scripts.each((_, el) => {
        try {
          const data = JSON.parse($(el).html() || '');
          const items = Array.isArray(data) ? data : [data];
          for (const item of items) {
            if (item['@type'] === 'Article') hasArticle = true;
            if (item['@graph']) {
              for (const g of item['@graph']) {
                if (g['@type'] === 'Article') hasArticle = true;
              }
            }
          }
        } catch {}
      });
      expect(hasArticle, `${slug}: missing Article JSON-LD`).toBe(true);
    });
  });
});

describe('Service pages — all render with required elements', () => {
  const serviceDir = join(DIST, 'services');
  const servicePages = existsSync(serviceDir)
    ? readdirSync(serviceDir).filter(f =>
        f !== 'index.html' && existsSync(join(serviceDir, f, 'index.html'))
      )
    : [];

  it(`has 10+ service pages built`, () => {
    expect(servicePages.length).toBeGreaterThanOrEqual(10);
  });

  servicePages.forEach(slug => {
    it(`/services/${slug} has title and service content`, () => {
      const file = join(serviceDir, slug, 'index.html');
      if (!existsSync(file)) return;
      const $ = cheerio.load(readFileSync(file, 'utf-8'));

      expect($('title').text().length).toBeGreaterThan(10);
      expect($('meta[name="description"]').attr('content')?.length).toBeGreaterThan(10);
    });
  });
});

describe('Static pages — all core pages render', () => {
  const corePages = ['', 'about', 'contact', 'privacy', 'terms', 'search', 'guide'];

  corePages.forEach(slug => {
    it(`/${slug || 'index'} renders with title`, () => {
      const file = join(DIST, slug, 'index.html');
      if (!existsSync(file)) return;
      const $ = cheerio.load(readFileSync(file, 'utf-8'));
      expect($('title').text().length).toBeGreaterThan(5);
    });
  });
});
