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

function loadPage(path: string): cheerio.CheerioAPI {
  const file = join(DIST, path, 'index.html');
  if (!existsSync(file)) throw new Error(`Page not found: ${file}`);
  return cheerio.load(readFileSync(file, 'utf-8'));
}

describe('Homepage', () => {
  let $: cheerio.CheerioAPI;
  beforeAll(() => { $ = loadPage(''); });

  it('has title containing site name', () => {
    const title = $('title').text().toLowerCase();
    expect(title).toContain('clinic');
  });

  it('has meta description', () => {
    const desc = $('meta[name="description"]').attr('content');
    expect(desc).toBeTruthy();
    expect(desc!.length).toBeGreaterThan(20);
  });

  it('has JSON-LD structured data', () => {
    const jsonLd = $('script[type="application/ld+json"]').html();
    expect(jsonLd).toBeTruthy();
    JSON.parse(jsonLd!);
  });

  it('has navigation with key sections', () => {
    const html = $('nav').html() || '';
    expect(html).toContain('/clinics');
    expect(html).toContain('/services');
  });

  it('has google-site-verification', () => {
    expect($('meta[name="google-site-verification"]').attr('content')).toBeTruthy();
  });

  it('has footer', () => {
    expect($('footer').length).toBe(1);
  });

  it('has search link', () => {
    const links = $('a[href*="/search"]').length;
    expect(links).toBeGreaterThan(0);
  });
});

describe('Province pages', () => {
  const provinces = [
    'eastern-cape', 'free-state', 'gauteng', 'kwazulu-natal',
    'limpopo', 'mpumalanga', 'north-west', 'northern-cape', 'western-cape',
  ];

  it('clinics index page exists', () => {
    const $ = loadPage('clinics');
    expect($('title').text()).toBeTruthy();
    expect($('a[href*="/clinics/"]').length).toBeGreaterThan(0);
  });

  it('all 9 province pages are generated', () => {
    for (const prov of provinces) {
      const file = join(DIST, 'clinics', prov, 'index.html');
      expect(existsSync(file), `Missing province page: ${prov}`).toBe(true);
    }
  });

  it('province pages have correct structure', () => {
    const $ = loadPage('clinics/western-cape');
    expect($('title').text()).toContain('Western Cape');
    expect($('h1').length).toBe(1);
    expect($.html().toLowerCase()).toContain('breadcrumb');
  });

  it('province pages have JSON-LD', () => {
    const $ = loadPage('clinics/gauteng');
    expect($('script[type="application/ld+json"]').length).toBeGreaterThanOrEqual(1);
  });

  it('province pages have facility listings', () => {
    const $ = loadPage('clinics/western-cape');
    const html = $.html().toLowerCase();
    expect(html).toContain('facility');
  });
});

describe('Facility pages', () => {
  it('1,000+ facility pages are generated', () => {
    let count = 0;
    const clinicsDir = join(DIST, 'clinics');
    for (const prov of readdirSync(clinicsDir)) {
      const provDir = join(clinicsDir, prov);
      if (!existsSync(join(provDir, 'index.html'))) continue;
      for (const fac of readdirSync(provDir)) {
        if (fac === 'index.html') continue;
        if (existsSync(join(provDir, fac, 'index.html'))) count++;
      }
    }
    expect(count).toBeGreaterThan(1000);
  });

  it('facility pages have title and h1', () => {
    const $ = loadPage('clinics/western-cape/touwsrivier-kliniek-western-cape');
    expect($('title').text()).toBeTruthy();
    expect($('h1').length).toBe(1);
  });

  it('facility pages have JSON-LD', () => {
    const $ = loadPage('clinics/western-cape/touwsrivier-kliniek-western-cape');
    expect($('script[type="application/ld+json"]').length).toBeGreaterThanOrEqual(1);
  });

  it('facility pages have breadcrumbs', () => {
    const $ = loadPage('clinics/western-cape/touwsrivier-kliniek-western-cape');
    expect($.html().toLowerCase()).toContain('breadcrumb');
  });

  it('facility pages show services', () => {
    const $ = loadPage('clinics/western-cape/touwsrivier-kliniek-western-cape');
    expect($.html().toLowerCase()).toContain('service');
  });
});

describe('Service pages', () => {
  const services = [
    'arvs', 'child-health', 'chronic-medication', 'dental',
    'emergency', 'family-planning', 'hiv-testing', 'immunisation',
    'maternity', 'mental-health', 'tb',
  ];

  it('services index page exists', () => {
    const $ = loadPage('services');
    expect($('title').text()).toBeTruthy();
    expect($('a[href*="/services/"]').length).toBeGreaterThan(0);
  });

  it('all service pages are generated', () => {
    for (const svc of services) {
      const file = join(DIST, 'services', svc, 'index.html');
      expect(existsSync(file), `Missing service page: ${svc}`).toBe(true);
    }
  });

  it('service pages have h1 and JSON-LD', () => {
    const $ = loadPage('services/hiv-testing');
    expect($('h1').length).toBe(1);
    expect($('script[type="application/ld+json"]').length).toBeGreaterThanOrEqual(1);
  });

  it('service pages link to facilities', () => {
    const $ = loadPage('services/hiv-testing');
    expect($('a[href*="/clinics/"]').length).toBeGreaterThan(0);
  });
});

describe('Guide pages', () => {
  it('guides index page exists', () => {
    const $ = loadPage('guides');
    expect($('title').text()).toBeTruthy();
  });

  it('13+ guide pages are generated', () => {
    const guidesDir = join(DIST, 'guides');
    const dirs = readdirSync(guidesDir).filter(d =>
      existsSync(join(guidesDir, d, 'index.html'))
    );
    expect(dirs.length).toBeGreaterThanOrEqual(13);
  });

  it('guide pages have h1 and JSON-LD', () => {
    const $ = loadPage('guides/hiv-testing-guide');
    expect($('h1').length).toBe(1);
    expect($('script[type="application/ld+json"]').length).toBeGreaterThanOrEqual(1);
  });
});

describe('Search page', () => {
  it('search page exists', () => {
    const $ = loadPage('search');
    expect($('title').text()).toBeTruthy();
    expect($('h1').length).toBe(1);
  });
});

describe('SEO essentials', () => {
  const pages = ['', 'clinics', 'services', 'clinics/gauteng', 'services/hiv-testing'];

  it('all sample pages have meta description', () => {
    for (const page of pages) {
      const $ = loadPage(page);
      const desc = $('meta[name="description"]').attr('content');
      expect(desc, `${page} missing meta description`).toBeTruthy();
      expect(desc!.length, `${page} meta description too short`).toBeGreaterThan(20);
    }
  });

  it('no duplicate titles among sample pages', () => {
    const titles = pages.map(p => loadPage(p)('title').text());
    expect(new Set(titles).size).toBe(titles.length);
  });
});

describe('Sitemap', () => {
  it('sitemap-index.xml exists', () => {
    expect(existsSync(join(DIST, 'sitemap-index.xml'))).toBe(true);
  });

  it('sitemap has URLs', () => {
    let totalUrls = 0;
    for (let i = 0; i < 10; i++) {
      const path = join(DIST, `sitemap-${i}.xml`);
      if (!existsSync(path)) break;
      const xml = readFileSync(path, 'utf-8');
      totalUrls += (xml.match(/<loc>/g) || []).length;
    }
    expect(totalUrls).toBeGreaterThan(100);
  });

  it('vercel.json has sitemap redirect', () => {
    const vercelJson = join(__dirname, '..', 'vercel.json');
    expect(existsSync(vercelJson)).toBe(true);
    const config = JSON.parse(readFileSync(vercelJson, 'utf-8'));
    const redirects: Array<{ source: string; destination: string }> = config.redirects || [];
    const r = redirects.find(r => r.source === '/sitemap.xml');
    expect(r, 'Missing redirect: /sitemap.xml').toBeTruthy();
  });
});

describe('Static assets', () => {
  it('robots.txt exists', () => {
    expect(existsSync(join(DIST, 'robots.txt'))).toBe(true);
  });

  it('llms.txt exists', () => {
    expect(existsSync(join(DIST, 'llms.txt'))).toBe(true);
  });
});

describe('Page count', () => {
  it('total build output has 1,000+ pages', () => {
    let count = 0;
    function walk(dir: string) {
      for (const entry of readdirSync(dir, { withFileTypes: true })) {
        if (entry.isDirectory()) walk(join(dir, entry.name));
        else if (entry.name === 'index.html') count++;
      }
    }
    walk(DIST);
    expect(count).toBeGreaterThan(1000);
  });
});
