import { describe, it, expect, beforeAll } from 'vitest';
import { execSync } from 'child_process';
import { readFileSync, existsSync, readdirSync, statSync } from 'fs';
import { join } from 'path';
import * as cheerio from 'cheerio';
import { LOCALES, LOCALE_CODES, localePath, stripLocale, localeOf } from '../src/i18n/config';
import { TRANSLATED } from '../src/i18n/translated';
import { STRINGS } from '../src/i18n/strings';

/**
 * Guards the i18n contract. Every assertion here exists because the failure it
 * catches is INVISIBLE from the site: a missing hreflang, a switcher pointing at a
 * 404, a half-English page, or a translated health page shipping without its
 * machine-translation disclaimer all render as a perfectly normal 200.
 */

const ROOT = join(__dirname, '..');
const DIST_CANDIDATES = [join(ROOT, '.vercel', 'output', 'static'), join(ROOT, 'dist')];

let DIST = '';

beforeAll(() => {
  DIST = DIST_CANDIDATES.find((d) => existsSync(join(d, 'index.html'))) ?? '';
  if (!DIST) {
    execSync('node_modules/.bin/astro build', { cwd: ROOT, stdio: 'pipe' });
    DIST = DIST_CANDIDATES.find((d) => existsSync(join(d, 'index.html'))) ?? '';
  }
  expect(DIST, 'no build output found — astro build produced neither .vercel/output/static nor dist').not.toBe('');
}, 180000);

/** Resolve a site path to its built HTML file, tolerating both Astro build formats. */
function pageFile(path: string): string | null {
  const rel = path === '/' ? 'index.html' : path.replace(/^\//, '');
  for (const candidate of [join(DIST, rel + '.html'), join(DIST, rel, 'index.html'), join(DIST, rel)]) {
    if (existsSync(candidate) && statSync(candidate).isFile()) return candidate;
  }
  return null;
}

function walkHtml(dir: string, out: string[] = []): string[] {
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walkHtml(full, out);
    else if (entry.endsWith('.html')) out.push(full);
  }
  return out;
}

describe('path helpers', () => {
  it('round-trips a nested guide path through every locale', () => {
    const base = '/guides/how-to-get-arvs';
    for (const code of LOCALE_CODES) {
      expect(stripLocale(localePath(base, code))).toBe(base);
      expect(localeOf(localePath(base, code))).toBe(code);
    }
  });

  it('maps the homepage to a bare prefix, not a trailing slash', () => {
    expect(localePath('/', 'xh')).toBe('/xh');
    expect(localePath('/', 'zu')).toBe('/zu');
    expect(localePath('/', 'en')).toBe('/');
    expect(stripLocale('/xh')).toBe('/');
  });

  it('leaves English paths untouched', () => {
    expect(localePath('/guides', 'en')).toBe('/guides');
    expect(stripLocale('/guides')).toBe('/guides');
  });
});

describe('translation manifest', () => {
  it('lists only canonical English paths, never prefixed ones', () => {
    for (const [code, paths] of Object.entries(TRANSLATED)) {
      for (const p of paths) {
        expect(p, `${code}: manifest entry must be the English path`).toBe(stripLocale(p));
        expect(p.startsWith('/'), `${code}: ${p} must be absolute`).toBe(true);
      }
    }
  });

  it('every listed translation actually built', () => {
    const missing: string[] = [];
    for (const code of Object.keys(TRANSLATED) as (keyof typeof TRANSLATED)[]) {
      for (const p of TRANSLATED[code]) {
        const target = localePath(p, code);
        if (!pageFile(target)) missing.push(target);
      }
    }
    expect(missing, 'manifest advertises pages that do not exist — hreflang would point at 404s').toEqual([]);
  });

  it('a locale shipping pages has finished its chrome strings', () => {
    for (const code of Object.keys(TRANSLATED) as (keyof typeof TRANSLATED)[]) {
      if (TRANSLATED[code].length === 0) continue;
      expect(STRINGS[code], `${code} ships pages but its chrome strings are still null — nav, footer and the disclaimer would render in English`).not.toBeNull();
      for (const [key, value] of Object.entries(STRINGS[code]!)) {
        expect(String(value).trim().length, `${code}.${key} is empty`).toBeGreaterThan(0);
      }
    }
  });
});

describe('built translated pages', () => {
  it('every non-English page carries the translation disclaimer', () => {
    const offenders: string[] = [];
    for (const code of LOCALE_CODES) {
      const prefix = LOCALES[code].prefix;
      if (!prefix) continue;
      for (const file of [...walkHtml(join(DIST, prefix.slice(1))), ...(pageFile(prefix) ? [pageFile(prefix)!] : [])]) {
        const $ = cheerio.load(readFileSync(file, 'utf-8'));
        if ($('[data-translation-disclaimer]').length === 0) offenders.push(file.replace(DIST, ''));
      }
    }
    expect(offenders, 'translated health pages must never ship without the machine-translation disclaimer').toEqual([]);
  });

  it('declares its own lang and links back to the English page', () => {
    const offenders: string[] = [];
    for (const code of LOCALE_CODES) {
      const prefix = LOCALES[code].prefix;
      if (!prefix) continue;
      for (const file of walkHtml(join(DIST, prefix.slice(1)))) {
        const $ = cheerio.load(readFileSync(file, 'utf-8'));
        if ($('html').attr('lang') !== code) offenders.push(`${file.replace(DIST, '')} (lang)`);
        if ($('[data-translation-disclaimer] a[hreflang="en-ZA"]').length === 0) {
          offenders.push(`${file.replace(DIST, '')} (no link to English)`);
        }
      }
    }
    expect(offenders).toEqual([]);
  });
});

describe('English pages are unchanged by the scaffolding', () => {
  it('the homepage still builds and stays un-prefixed', () => {
    expect(pageFile('/')).not.toBeNull();
  });

  it('emits no hreflang cluster while nothing is translated', () => {
    const anyTranslated = Object.values(TRANSLATED).some((p) => p.length > 0);
    if (anyTranslated) return;
    const $ = cheerio.load(readFileSync(pageFile('/')!, 'utf-8'));
    expect($('link[rel="alternate"][hreflang]').length, 'a one-language hreflang cluster is worse than none').toBe(0);
  });

  it('does not offer a switcher option that has no page', () => {
    const $ = cheerio.load(readFileSync(pageFile('/')!, 'utf-8'));
    $('[data-language-switcher] a').each((_, el) => {
      const href = $(el).attr('href')!;
      expect(pageFile(href), `switcher offers ${href} but it did not build`).not.toBeNull();
    });
  });
});
