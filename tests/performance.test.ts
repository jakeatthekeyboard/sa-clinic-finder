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

const MAX_HTML_KB = 350;
const MAX_DOM_ELEMENTS = 5000;

/* EVERY built page, not a sample (#1248).
   Until this commit both caps were asserted against a hand-written list of nine
   pages. /services/immunisation — 1,044 facilities, the largest list on the site
   and the only page over the cap — was not one of the nine, so the guard passed
   for as long as it was broken, and the two locale copies of every sampled page
   (/xh/**, /zu/**) were invisible too: the xh and zu service templates are
   independent files that can drift from the English one, and both were in fact
   ~15 KB LARGER than the page that was being checked. A guard whose sample
   cannot reach its own subject passes forever
   (.claude/memory/feedback_guard_blind_to_its_own_subject.md), and the pipeline
   rule is to test ALL items, never a sample.

   Do not reintroduce a page list here. If a page must be exempted, exempt it by
   name in EXEMPT below with the item number that decided it — an exemption is
   visible and greppable, a missing list entry is not. */
const EXEMPT: Record<string, string> = {};

/** Every built HTML page, as a dist-relative route ('' is the homepage). */
function allBuiltPages(): { route: string; file: string }[] {
  const out: { route: string; file: string }[] = [];
  const walk = (dir: string) => {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, e.name);
      if (e.isDirectory()) {
        if (e.name === '_astro') continue;
        walk(full);
      } else if (e.name.endsWith('.html')) {
        const rel = full.slice(DIST.length + 1);
        const route = rel === 'index.html'
          ? ''
          : rel.endsWith('/index.html')
            ? rel.slice(0, -'/index.html'.length)
            : rel.slice(0, -'.html'.length);
        out.push({ route, file: full });
      }
    }
  };
  walk(DIST);
  return out.filter(p => !(p.route in EXEMPT));
}

/* Cheap upper-bound element count: every '<' followed by a letter is an opening
   tag. It over-counts (tag-like text inside the inline analytics script), never
   under-counts, so it is safe as a SCREEN — anything it flags is re-counted
   exactly with cheerio below. Parsing all ~3,360 pages (92 MB) with cheerio
   would put ~40s into every push; this keeps the sweep to about a second while
   the assertion that actually fires is still an exact one. */
function screenElementCount(html: string): number {
  return (html.match(/<[a-zA-Z]/g) || []).length;
}

describe('Built-page coverage', () => {
  it('sweeps the whole build, not a sample', () => {
    const pages = allBuiltPages();
    // Denominator, reported: a sweep that silently found nothing is the failure
    // mode this whole describe exists to prevent.
    expect(pages.length, 'built pages found under dist/').toBeGreaterThan(3000);
    const routes = new Set(pages.map(p => p.route));
    // The three pages #1248 was filed for. Pinned by name so a future narrowing
    // of the walk fails here instead of going quietly green.
    for (const r of ['services/immunisation', 'xh/services/immunisation', 'zu/services/immunisation']) {
      expect(routes.has(r), `${r} is not in the swept set`).toBe(true);
    }
    expect(routes.has(''), 'homepage is not in the swept set').toBe(true);
  });
});

describe('HTML size', () => {
  it(`every built page under ${MAX_HTML_KB}KB`, () => {
    const over = allBuiltPages()
      .map(p => ({ route: p.route, kb: statSync(p.file).size / 1024 }))
      .filter(p => p.kb >= MAX_HTML_KB)
      .sort((a, b) => b.kb - a.kb);
    expect(
      over.map(p => `/${p.route} is ${p.kb.toFixed(1)}KB`).join('\n'),
      `${over.length} page(s) at or over ${MAX_HTML_KB}KB`,
    ).toBe('');
  });
});

describe('DOM element count', () => {
  it(`every built page under ${MAX_DOM_ELEMENTS} elements`, () => {
    const over: string[] = [];
    for (const p of allBuiltPages()) {
      const html = readFileSync(p.file, 'utf-8');
      if (screenElementCount(html) < MAX_DOM_ELEMENTS) continue;
      const exact = cheerio.load(html)('*').length;
      if (exact >= MAX_DOM_ELEMENTS) over.push(`/${p.route} has ${exact} elements`);
    }
    expect(over.join('\n'), `${over.length} page(s) at or over ${MAX_DOM_ELEMENTS} elements`).toBe('');
  });
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
