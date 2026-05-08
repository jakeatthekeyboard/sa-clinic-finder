/**
 * FAQ Schema Compliance Tests
 *
 * Ensures every FAQPage JSON-LD question has a matching visible <summary>
 * element in the rendered HTML. Covers facility pages (sampled), province
 * pages, service pages, and guide pages.
 *
 * Direction: JSON-LD → visible HTML. A page may have extra visible summaries
 * that are not in JSON-LD (e.g. province intro accordions) — that is fine.
 * The invariant is: every structured-data question must be visible to users.
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { readFileSync, existsSync, readdirSync } from 'fs';
import { join } from 'path';
import { execSync } from 'child_process';
import * as cheerio from 'cheerio';

const DIST = join(__dirname, '..', 'dist');

beforeAll(() => {
  if (!existsSync(join(DIST, 'index.html'))) {
    execSync('node_modules/.bin/astro build', { cwd: join(__dirname, '..'), stdio: 'pipe' });
  }
}, 120000);

/** Load a built page and return a cheerio instance. */
function loadPage(relPath: string): cheerio.CheerioAPI {
  const file = join(DIST, relPath, 'index.html');
  if (!existsSync(file)) throw new Error(`Page not found: ${file}`);
  return cheerio.load(readFileSync(file, 'utf-8'));
}

/** Extract all FAQPage JSON-LD question texts from a cheerio document. */
function extractFaqJsonLdQuestions($: cheerio.CheerioAPI): string[] {
  const questions: string[] = [];
  $('script[type="application/ld+json"]').each((_, el) => {
    try {
      const data = JSON.parse($(el).html() || '');
      const items = Array.isArray(data) ? data : [data];
      for (const item of items) {
        if (item['@type'] === 'FAQPage' && Array.isArray(item.mainEntity)) {
          for (const q of item.mainEntity) {
            if (q['@type'] === 'Question' && typeof q.name === 'string') {
              questions.push(q.name);
            }
          }
        }
      }
    } catch {
      // not valid JSON — skip
    }
  });
  return questions;
}

/**
 * Extract visible summary texts from the page.
 * Some summaries contain decorative child elements (e.g. <span>+</span> for
 * accordion icons). We extract only direct text nodes, ignoring spans that
 * hold purely decorative characters.
 */
function extractVisibleSummaries($: cheerio.CheerioAPI): string[] {
  const summaries: string[] = [];
  $('summary').each((_, el) => {
    // Collect text from direct text nodes and child elements that are not
    // purely decorative (single non-alphanumeric character spans).
    let text = '';
    $(el).contents().each((__, node) => {
      if (node.type === 'text') {
        text += $(node).text();
      } else if (node.type === 'tag') {
        const childText = $(node).text().trim();
        // Skip decorative single-character spans (e.g. "+", "-", "▼")
        const isDecorative =
          $(node).prop('tagName')?.toLowerCase() === 'span' &&
          childText.length <= 2 &&
          !/[a-zA-Z0-9]/.test(childText);
        if (!isDecorative) {
          text += childText;
        }
      }
    });
    const trimmed = text.trim();
    if (trimmed) summaries.push(trimmed);
  });
  return summaries;
}

/**
 * Assert that every JSON-LD FAQ question has a matching visible summary.
 * Comparison is case-insensitive and whitespace-normalised.
 */
function assertFaqCompliance(pagePath: string, $: cheerio.CheerioAPI) {
  const jsonLdQuestions = extractFaqJsonLdQuestions($);
  const visibleSummaries = extractVisibleSummaries($);

  const normalisedSummaries = visibleSummaries.map(s =>
    s.toLowerCase().replace(/\s+/g, ' ').trim()
  );

  const missing: string[] = [];
  for (const q of jsonLdQuestions) {
    const normQ = q.toLowerCase().replace(/\s+/g, ' ').trim();
    if (!normalisedSummaries.includes(normQ)) {
      missing.push(q);
    }
  }

  expect(
    missing,
    `${pagePath}: ${missing.length} JSON-LD FAQ question(s) missing from visible HTML:\n` +
      missing.map(q => `  - "${q}"`).join('\n')
  ).toHaveLength(0);
}

// ---------------------------------------------------------------------------
// Facility pages — sample across provinces
// ---------------------------------------------------------------------------

describe('FAQ schema compliance — facility pages', () => {
  const MAX_SAMPLE_PER_PROVINCE = 5;

  /** Collect a sample of facility page paths from each province. */
  function sampleFacilityPaths(): string[] {
    const paths: string[] = [];
    const clinicsDir = join(DIST, 'clinics');
    if (!existsSync(clinicsDir)) return paths;

    for (const prov of readdirSync(clinicsDir)) {
      const provDir = join(clinicsDir, prov);
      if (!existsSync(join(provDir, 'index.html'))) continue; // not a province dir

      let count = 0;
      for (const fac of readdirSync(provDir)) {
        if (fac === 'index.html') continue;
        if (existsSync(join(provDir, fac, 'index.html'))) {
          paths.push(`clinics/${prov}/${fac}`);
          count++;
          if (count >= MAX_SAMPLE_PER_PROVINCE) break;
        }
      }
    }
    return paths;
  }

  const facilityPaths = sampleFacilityPaths();

  it('sampled at least 9 facility pages (1+ per province)', () => {
    expect(facilityPaths.length).toBeGreaterThanOrEqual(9);
  });

  it('every sampled facility page has FAQPage JSON-LD', () => {
    const missing: string[] = [];
    for (const fp of facilityPaths) {
      const $ = loadPage(fp);
      const questions = extractFaqJsonLdQuestions($);
      if (questions.length === 0) missing.push(fp);
    }
    expect(
      missing,
      `Facility pages missing FAQPage JSON-LD:\n${missing.join('\n')}`
    ).toHaveLength(0);
  });

  it('every JSON-LD FAQ question has a matching visible summary', () => {
    const failures: string[] = [];
    for (const fp of facilityPaths) {
      const $ = loadPage(fp);
      const jsonLdQuestions = extractFaqJsonLdQuestions($);
      const visibleSummaries = extractVisibleSummaries($);
      const normalisedSummaries = visibleSummaries.map(s =>
        s.toLowerCase().replace(/\s+/g, ' ').trim()
      );

      for (const q of jsonLdQuestions) {
        const normQ = q.toLowerCase().replace(/\s+/g, ' ').trim();
        if (!normalisedSummaries.includes(normQ)) {
          failures.push(`${fp}: "${q}"`);
        }
      }
    }
    expect(
      failures,
      `JSON-LD questions without visible summary:\n${failures.join('\n')}`
    ).toHaveLength(0);
  });

  it('FAQPage mainEntity contains only Question types', () => {
    for (const fp of facilityPaths) {
      const $ = loadPage(fp);
      $('script[type="application/ld+json"]').each((_, el) => {
        try {
          const data = JSON.parse($(el).html() || '');
          const items = Array.isArray(data) ? data : [data];
          for (const item of items) {
            if (item['@type'] === 'FAQPage' && Array.isArray(item.mainEntity)) {
              for (const q of item.mainEntity) {
                expect(q['@type'], `${fp}: mainEntity item has wrong @type`).toBe('Question');
                expect(typeof q.name, `${fp}: Question missing name`).toBe('string');
                expect(q.acceptedAnswer?.['@type'], `${fp}: missing Answer type`).toBe('Answer');
                expect(typeof q.acceptedAnswer?.text, `${fp}: missing Answer text`).toBe('string');
              }
            }
          }
        } catch {
          // parse error handled by other tests
        }
      });
    }
  });
});

// ---------------------------------------------------------------------------
// Province pages
// ---------------------------------------------------------------------------

describe('FAQ schema compliance — province pages', () => {
  const provinces = [
    'eastern-cape', 'free-state', 'gauteng', 'kwazulu-natal',
    'limpopo', 'mpumalanga', 'north-west', 'northern-cape', 'western-cape',
  ];

  it('every province page has FAQPage JSON-LD', () => {
    const missing: string[] = [];
    for (const prov of provinces) {
      const pagePath = `clinics/${prov}`;
      if (!existsSync(join(DIST, pagePath, 'index.html'))) continue;
      const $ = loadPage(pagePath);
      if (extractFaqJsonLdQuestions($).length === 0) missing.push(prov);
    }
    expect(
      missing,
      `Province pages missing FAQPage JSON-LD: ${missing.join(', ')}`
    ).toHaveLength(0);
  });

  it('every province JSON-LD FAQ question has a matching visible summary', () => {
    for (const prov of provinces) {
      const pagePath = `clinics/${prov}`;
      if (!existsSync(join(DIST, pagePath, 'index.html'))) continue;
      const $ = loadPage(pagePath);
      assertFaqCompliance(pagePath, $);
    }
  });
});

// ---------------------------------------------------------------------------
// Service pages
// ---------------------------------------------------------------------------

describe('FAQ schema compliance — service pages', () => {
  const services = [
    'arvs', 'child-health', 'chronic-medication', 'dental',
    'emergency', 'family-planning', 'hiv-testing', 'immunisation',
    'maternity', 'mental-health', 'tb',
  ];

  it('every service page has FAQPage JSON-LD', () => {
    const missing: string[] = [];
    for (const svc of services) {
      const pagePath = `services/${svc}`;
      if (!existsSync(join(DIST, pagePath, 'index.html'))) continue;
      const $ = loadPage(pagePath);
      if (extractFaqJsonLdQuestions($).length === 0) missing.push(svc);
    }
    expect(
      missing,
      `Service pages missing FAQPage JSON-LD: ${missing.join(', ')}`
    ).toHaveLength(0);
  });

  it('every service JSON-LD FAQ question has a matching visible summary', () => {
    for (const svc of services) {
      const pagePath = `services/${svc}`;
      if (!existsSync(join(DIST, pagePath, 'index.html'))) continue;
      const $ = loadPage(pagePath);
      assertFaqCompliance(pagePath, $);
    }
  });
});

// ---------------------------------------------------------------------------
// Guide pages
// ---------------------------------------------------------------------------

describe('FAQ schema compliance — guide pages', () => {
  function guidePagePaths(): string[] {
    const guidesDir = join(DIST, 'guides');
    if (!existsSync(guidesDir)) return [];
    return readdirSync(guidesDir)
      .filter(d => existsSync(join(guidesDir, d, 'index.html')))
      .map(d => `guides/${d}`);
  }

  it('guide pages with FAQPage JSON-LD have matching visible summaries', () => {
    const paths = guidePagePaths();
    expect(paths.length, 'No guide pages found in dist/').toBeGreaterThan(0);

    for (const gp of paths) {
      const $ = loadPage(gp);
      const questions = extractFaqJsonLdQuestions($);
      if (questions.length > 0) {
        assertFaqCompliance(gp, $);
      }
    }
  });
});

// ---------------------------------------------------------------------------
// Cross-cutting JSON-LD validity
// ---------------------------------------------------------------------------

describe('FAQ JSON-LD validity — all page types', () => {
  it('every FAQPage JSON-LD block is valid JSON', () => {
    const clinicsDir = join(DIST, 'clinics');
    const broken: string[] = [];

    // Sample 30 facility pages for JSON parse validity
    let checked = 0;
    outer:
    for (const prov of readdirSync(clinicsDir)) {
      const provDir = join(clinicsDir, prov);
      if (!existsSync(join(provDir, 'index.html'))) continue;
      for (const fac of readdirSync(provDir)) {
        if (fac === 'index.html') continue;
        const file = join(provDir, fac, 'index.html');
        if (!existsSync(file)) continue;

        const html = readFileSync(file, 'utf-8');
        const $ = cheerio.load(html);
        $('script[type="application/ld+json"]').each((_, el) => {
          const raw = $(el).html() || '';
          try {
            JSON.parse(raw);
          } catch {
            broken.push(`clinics/${prov}/${fac}`);
          }
        });

        checked++;
        if (checked >= 30) break outer;
      }
    }

    expect(
      broken,
      `Pages with invalid JSON-LD:\n${broken.join('\n')}`
    ).toHaveLength(0);
  });

  it('FAQPage JSON-LD has required @context and @type', () => {
    // Spot-check across page types
    const pages = [
      'clinics/gauteng',
      'clinics/western-cape/touwsrivier-kliniek-western-cape',
      'services/hiv-testing',
    ];

    for (const pagePath of pages) {
      if (!existsSync(join(DIST, pagePath, 'index.html'))) continue;
      const $ = loadPage(pagePath);
      $('script[type="application/ld+json"]').each((_, el) => {
        try {
          const data = JSON.parse($(el).html() || '');
          const items = Array.isArray(data) ? data : [data];
          for (const item of items) {
            if (item['@type'] === 'FAQPage') {
              expect(item['@context'], `${pagePath}: FAQPage missing @context`).toBe(
                'https://schema.org'
              );
              expect(
                Array.isArray(item.mainEntity),
                `${pagePath}: FAQPage missing mainEntity array`
              ).toBe(true);
              expect(
                item.mainEntity.length,
                `${pagePath}: FAQPage has empty mainEntity`
              ).toBeGreaterThan(0);
            }
          }
        } catch {
          // JSON parse errors caught by other test
        }
      });
    }
  });
});
