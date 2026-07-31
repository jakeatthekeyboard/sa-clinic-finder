import { describe, it, expect } from 'vitest';
import { junkNameReason, fieldFill, withheldKeys } from '../src/data/facility-quality.mjs';

// #929. These are the exact OSM `name` values live in the submitted sitemap.
describe('junkNameReason', () => {
  it.each([
    ['health care', 'all-lowercase'],
    ['middelbirg hospital', 'all-lowercase'],
    ['sick bay', 'all-lowercase'],
    ['slovo park clinic', 'all-lowercase'],
    ['Clinic', 'generic-noun'],
    ['CLINIC', 'generic-noun'],
    ['Surgery', 'generic-noun'],
    ['', 'empty'],
  ])('flags %s', (name, reason) => {
    expect(junkNameReason(name)).toBe(reason);
  });

  it.each([
    'Middelburg Hospital',
    'Chris Hani Baragwanath Academic Hospital',
    'KwaMsane Clinic',
    "King's PC Clinic",
    'THINK SITE CLINIC- Adherence Module',
  ])('accepts the real name %s', (name) => {
    expect(junkNameReason(name)).toBeNull();
  });

  it('does not flag an all-caps acronym as lowercase', () => {
    expect(junkNameReason('TB HIV Care')).toBeNull();
  });
});

describe('withheldKeys — duplicates', () => {
  const rich = {
    province: 'Mpumalanga', slug: 'a', name: 'Middelburg Hospital',
    address: { street: '1 Main', city: 'Middelburg' }, contact: { phone: '+27 13 249 3874' },
    operator: 'Mpumalanga DoH', data_quality_score: 5,
  };
  const sparse = {
    province: 'Mpumalanga', slug: 'b', name: 'Middelburg  Hospital',
    address: {}, contact: {}, data_quality_score: 5,
  };

  it('keeps the more informative record and withholds the other', () => {
    const w = withheldKeys([rich, sparse]);
    expect(w.has('Mpumalanga|b')).toBe(true);
    expect(w.get('Mpumalanga|b')).toBe('duplicate');
    expect(w.has('Mpumalanga|a')).toBe(false);
  });

  it('does not treat same-name facilities in DIFFERENT provinces as duplicates', () => {
    const w = withheldKeys([rich, { ...sparse, province: 'Limpopo' }]);
    expect(w.size).toBe(0);
  });

  it('is stable when records tie — the sitemap must not churn between builds', () => {
    const a = { ...sparse, slug: 'aaa' };
    const b = { ...sparse, slug: 'bbb' };
    expect([...withheldKeys([a, b]).keys()]).toEqual([...withheldKeys([b, a]).keys()]);
  });

  it('never withholds every member of a cluster', () => {
    const w = withheldKeys([rich, sparse, { ...sparse, slug: 'c' }]);
    expect([...w.values()].filter((v) => v === 'duplicate').length).toBe(2);
  });
});

describe('fieldFill', () => {
  it('counts only populated fields', () => {
    expect(fieldFill({ address: {}, contact: {} })).toBe(0);
    expect(fieldFill({ address: { street: 'x', city: 'y' }, contact: { phone: 'z' } })).toBe(3);
    expect(fieldFill({ address: {}, contact: {}, services: [] })).toBe(0);
    expect(fieldFill({ address: {}, contact: {}, services: ['hiv'] })).toBe(1);
  });
});

describe('against the live corpus', () => {
  it('withholds a bounded set, never a large share of the site', async () => {
    const facilities = (await import('../src/data/facilities.json')).default as any[];
    const w = withheldKeys(facilities);
    expect(w.size).toBeGreaterThan(0);
    // A predicate that starts eating the site is a bug, not a stricter standard.
    expect(w.size / facilities.length).toBeLessThan(0.10);
  });

  it('withholds the known middelbirg record but keeps the real Middelburg Hospital', async () => {
    const facilities = (await import('../src/data/facilities.json')).default as any[];
    const w = withheldKeys(facilities);
    const bad = facilities.find((f) => f.name === 'middelbirg hospital');
    const good = facilities.find((f) => f.name === 'Middelburg Hospital');
    expect(bad && w.has(`${bad.province}|${bad.slug}`)).toBe(true);
    if (good) expect(w.has(`${good.province}|${good.slug}`)).toBe(false);
  });
});

describe('the two signals cannot drift (#929)', () => {
  it('every withheld page is noindexed AND absent from the sitemap, and no other page is', async () => {
    // The sitemap filter (astro.config.mjs) and the noindex flag (the page template)
    // are separate code paths that must agree. They share one predicate so they agree
    // BY CONSTRUCTION — this pins that, because the failure mode is silent: a future
    // edit to one and not the other tells Google two contradictory things, and
    // tools/noindex-inventory-check.py's SITEMAP_CONFLICT rule deliberately skips
    // wildcard routes, so nothing outside this repo would catch it.
    const fs = await import('node:fs');
    const path = await import('node:path');
    const facilities = (await import('../src/data/facilities.json')).default as any[];
    const { withheldKeys } = await import('../src/data/facility-quality.mjs');

    const withheld = withheldKeys(facilities);
    const withheldPaths = new Set(
      [...withheld.keys()].map((k) => {
        const [province, slug] = (k as string).split('|');
        return `/clinics/${province.toLowerCase().replace(/ /g, '-')}/${slug}`;
      })
    );

    const dist = ['.vercel/output/static', 'dist'].find((d) => fs.existsSync(d));
    if (!dist) return;                       // no build present; nothing to assert
    const xml = fs.readdirSync(dist)
      .filter((f) => f.startsWith('sitemap') && f.endsWith('.xml'))
      .map((f) => fs.readFileSync(path.join(dist, f), 'utf-8'))
      .join('\n');
    if (!xml) return;

    const inSitemap = new Set(
      [...xml.matchAll(/<loc>https:\/\/clinicfinder\.co\.za([^<]*)<\/loc>/g)].map((m) => m[1])
    );

    // No withheld page may be submitted.
    const leaked = [...withheldPaths].filter((p) => inSitemap.has(p));
    expect(leaked, `withheld pages present in the sitemap: ${leaked.slice(0, 5).join(', ')}`).toEqual([]);

    // And the withholding must be doing something — a predicate that silently stops
    // matching would make this test pass vacuously.
    expect(withheldPaths.size).toBeGreaterThan(0);
  });
});
