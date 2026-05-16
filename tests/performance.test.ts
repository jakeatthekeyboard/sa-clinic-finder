import { describe, it, expect, beforeAll } from 'vitest';
import { readFileSync, existsSync, readdirSync, statSync } from 'fs';
import { join } from 'path';
import * as cheerio from 'cheerio';

const DIST = join(__dirname, '..', 'dist');

beforeAll(() => {
  if (!existsSync(join(DIST, 'index.html'))) {
    throw new Error('Build dist/ first: npx astro build');
  }
});

function loadPage(subpath: string): cheerio.CheerioAPI {
  const file = subpath === ''
    ? join(DIST, 'index.html')
    : join(DIST, subpath, 'index.html');
  if (!existsSync(file)) throw new Error(`Page not found: ${file}`);
  return cheerio.load(readFileSync(file, 'utf-8'));
}

function pageSizeKB(subpath: string): number {
  const file = subpath === ''
    ? join(DIST, 'index.html')
    : join(DIST, subpath, 'index.html');
  return statSync(file).size / 1024;
}

const MAX_HTML_KB = 350;
const MAX_DOM_ELEMENTS = 5000;

const samplePages = [
  { name: 'Homepage', path: '' },
  { name: 'Province (Gauteng)', path: 'clinics/gauteng' },
  { name: 'Province (Western Cape)', path: 'clinics/western-cape' },
  { name: 'Guides index', path: 'guides' },
  { name: 'Guide (HIV testing)', path: 'guides/hiv-testing-guide' },
  { name: 'Services index', path: 'services' },
  { name: 'Service (ARVs)', path: 'services/arvs' },
  { name: 'Search', path: 'search' },
  { name: 'About', path: 'about' },
];

describe('HTML size', () => {
  for (const p of samplePages) {
    it(`${p.name} under ${MAX_HTML_KB}KB`, () => {
      const file = p.path === ''
        ? join(DIST, 'index.html')
        : join(DIST, p.path, 'index.html');
      if (!existsSync(file)) return;
      const size = pageSizeKB(p.path);
      expect(size).toBeLessThan(MAX_HTML_KB);
    });
  }
});

describe('DOM element count', () => {
  for (const p of samplePages) {
    it(`${p.name} under ${MAX_DOM_ELEMENTS} elements`, () => {
      const file = p.path === ''
        ? join(DIST, 'index.html')
        : join(DIST, p.path, 'index.html');
      if (!existsSync(file)) return;
      const $ = loadPage(p.path);
      const count = $('*').length;
      expect(count).toBeLessThan(MAX_DOM_ELEMENTS);
    });
  }
});

describe('CSS bundle size', () => {
  it('CSS files under 50KB each', () => {
    const astroDir = join(DIST, '_astro');
    if (!existsSync(astroDir)) return;
    const cssFiles = readdirSync(astroDir).filter(f => f.endsWith('.css'));
    for (const f of cssFiles) {
      const size = statSync(join(astroDir, f)).size / 1024;
      expect(size, `${f} is ${size.toFixed(1)}KB`).toBeLessThan(50);
    }
  });
});

describe('Content rendering', () => {
  it('province page lists facilities', () => {
    const $ = loadPage('clinics/gauteng');
    const links = $('a[href*="/clinics/gauteng/"]').length;
    expect(links).toBeGreaterThan(10);
  });

  it('homepage links to provinces', () => {
    const $ = loadPage('');
    const provinceLinks = $('a[href*="/clinics/"]').length;
    expect(provinceLinks).toBeGreaterThan(5);
  });

  it('guide page has health content', () => {
    const $ = loadPage('guides/hiv-testing-guide');
    $('script, style, noscript').remove();
    const text = $('body').text().toLowerCase();
    expect(text).toMatch(/hiv|test|clinic/);
  });

  it('service page has service content', () => {
    const $ = loadPage('services/arvs');
    $('script, style, noscript').remove();
    const text = $('body').text().toLowerCase();
    expect(text).toMatch(/arv|antiretroviral|treatment/);
  });

  it('no pages render undefined or NaN', () => {
    const checkPaths = ['', 'clinics/gauteng', 'guides/hiv-testing-guide', 'services/arvs'];
    for (const p of checkPaths) {
      const $ = loadPage(p);
      $('script, style, noscript').remove();
      const text = $('body').text();
      expect(text, `${p} contains 'undefined'`).not.toContain('undefined');
      expect(text, `${p} contains 'NaN'`).not.toContain('NaN');
    }
  });
});

describe('Facility page spot check', () => {
  it('facility page has proper structure', () => {
    const gautengDir = join(DIST, 'clinics', 'gauteng');
    if (!existsSync(gautengDir)) return;
    const facilities = readdirSync(gautengDir, { withFileTypes: true })
      .filter(e => e.isDirectory() && existsSync(join(gautengDir, e.name, 'index.html')));
    expect(facilities.length).toBeGreaterThan(50);

    const first = facilities[0].name;
    const $ = loadPage(`clinics/gauteng/${first}`);
    expect($('h1').length).toBe(1);
    expect($('title').text().length).toBeGreaterThan(10);
  });
});
