import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync, readdirSync } from 'fs';
import { join, resolve } from 'path';
import { globSync } from 'glob';

const ROOT = resolve(__dirname, '..');
const DIST = join(ROOT, 'dist');
const DATA = join(ROOT, 'src', 'data');

const facilities: any[] = JSON.parse(
  readFileSync(join(DATA, 'facilities.json'), 'utf-8')
);

describe('facilities.json', () => {
  it('has 1,000+ facility records', () => {
    expect(facilities.length).toBeGreaterThan(1000);
  });

  it('every facility has required fields (name, slug, url_path)', () => {
    for (const f of facilities) {
      expect(f.name, `Facility missing name`).toBeTruthy();
      expect(f.slug, `${f.name} missing slug`).toBeTruthy();
      expect(f.url_path, `${f.name} missing url_path`).toBeTruthy();
    }
  });

  it('fewer than 2% of facilities have empty province', () => {
    const emptyProv = facilities.filter(f => !f.province);
    expect(emptyProv.length, `${emptyProv.length} facilities have empty province`).toBeLessThan(
      facilities.length * 0.02
    );
  });

  it('facility slugs are unique', () => {
    const slugs = facilities.map(f => f.slug);
    const dupes = slugs.filter((s, i) => slugs.indexOf(s) !== i);
    expect(dupes.length, `Duplicate slugs: ${dupes.slice(0, 5).join(', ')}`).toBe(0);
  });

  it('all provinces are valid SA provinces', () => {
    const valid = new Set([
      'Eastern Cape', 'Free State', 'Gauteng', 'KwaZulu-Natal',
      'Limpopo', 'Mpumalanga', 'North West', 'Northern Cape', 'Western Cape',
    ]);
    const invalid: string[] = [];
    for (const f of facilities) {
      if (f.province && !valid.has(f.province)) {
        invalid.push(`${f.name}: ${f.province}`);
      }
    }
    expect(invalid.length, `Invalid provinces: ${invalid.slice(0, 5).join(', ')}`).toBe(0);
  });

  it('coordinates are valid SA lat/lng when present', () => {
    for (const f of facilities) {
      if (f.coordinates?.lat && f.coordinates?.lng) {
        expect(f.coordinates.lat, `${f.name} lat out of SA range`).toBeGreaterThan(-35);
        expect(f.coordinates.lat, `${f.name} lat out of SA range`).toBeLessThan(-22);
        expect(f.coordinates.lng, `${f.name} lng out of SA range`).toBeGreaterThan(16);
        expect(f.coordinates.lng, `${f.name} lng out of SA range`).toBeLessThan(33);
      }
    }
  });

  it('services arrays contain known service types', () => {
    const knownServices = new Set([
      'General', 'HIV Testing', 'ARVs', 'TB', 'Maternity',
      'Family Planning', 'Child Health', 'Immunisation', 'Mental Health',
      'Chronic Medication', 'Dental', 'Emergency', 'Eye Care',
      'Rehabilitation', 'Pharmacy', 'X-Ray', 'Laboratory',
    ]);
    let unknownCount = 0;
    for (const f of facilities) {
      if (Array.isArray(f.services)) {
        for (const s of f.services) {
          if (!knownServices.has(s)) unknownCount++;
        }
      }
    }
    expect(unknownCount, 'Too many unknown service types').toBeLessThan(facilities.length * 0.05);
  });

  it('data_quality_score is 0-100 when present', () => {
    for (const f of facilities) {
      if (typeof f.data_quality_score === 'number') {
        expect(f.data_quality_score).toBeGreaterThanOrEqual(0);
        expect(f.data_quality_score).toBeLessThanOrEqual(100);
      }
    }
  });

  it('url_path starts with /clinics/', () => {
    for (const f of facilities) {
      expect(f.url_path, `${f.name} url_path malformed`).toMatch(/^\/clinics\//);
    }
  });

  it('every province has at least 10 facilities', () => {
    const byCounts: Record<string, number> = {};
    for (const f of facilities) {
      if (f.province) {
        byCounts[f.province] = (byCounts[f.province] || 0) + 1;
      }
    }
    for (const [prov, count] of Object.entries(byCounts)) {
      expect(count, `${prov} has too few facilities`).toBeGreaterThanOrEqual(10);
    }
  });
});

describe('editorial link validation', () => {
  const editorialFiles = globSync(join(DATA, '*.ts'));
  const linkRe = /href="(\/[^"]+)"/g;

  const allLinks: { file: string; href: string }[] = [];
  for (const f of editorialFiles) {
    const content = readFileSync(f, 'utf-8');
    let m: RegExpExecArray | null;
    while ((m = linkRe.exec(content)) !== null) {
      allLinks.push({ file: f.replace(ROOT + '/', ''), href: m[1] });
    }
  }

  const uniqueHrefs = [...new Set(allLinks.map(l => l.href))];

  it('editorial .ts files contain internal links', () => {
    expect(allLinks.length).toBeGreaterThan(0);
  });

  it('every editorial internal link resolves to a built page', () => {
    if (!existsSync(join(DIST, 'index.html'))) return;
    const broken: string[] = [];
    for (const href of uniqueHrefs) {
      const pagePath = join(DIST, href, 'index.html');
      if (!existsSync(pagePath)) {
        const sources = allLinks.filter(l => l.href === href).map(l => l.file);
        broken.push(`${href} (in ${sources.join(', ')})`);
      }
    }
    expect(broken, `Broken editorial links:\n${broken.join('\n')}`).toHaveLength(0);
  });
});

describe('vercel.json redirects', () => {
  const vercelConfig = JSON.parse(readFileSync(join(ROOT, 'vercel.json'), 'utf-8'));
  const redirects: { source: string; destination: string; permanent: boolean }[] =
    vercelConfig.redirects || [];

  it('has redirects defined', () => {
    expect(redirects.length).toBeGreaterThan(0);
  });

  it('redirect destinations resolve to existing pages or known paths', () => {
    if (!existsSync(join(DIST, 'index.html'))) return;
    const broken: string[] = [];
    for (const r of redirects) {
      const dest = r.destination.replace(/\?.*$/, '');
      const asFile = join(DIST, dest);
      const asDir = join(DIST, dest, 'index.html');
      if (!existsSync(asFile) && !existsSync(asDir)) {
        broken.push(`${r.source} → ${r.destination}`);
      }
    }
    expect(broken, `Broken redirect destinations:\n${broken.join('\n')}`).toHaveLength(0);
  });

  it('no circular redirects', () => {
    const sources = new Set(redirects.map(r => r.source));
    const circular = redirects.filter(r => r.destination === r.source);
    expect(circular.map(r => r.source)).toHaveLength(0);
  });

  it('no redirect chains', () => {
    const sourceSet = new Set(redirects.map(r => r.source));
    const chains = redirects.filter(r => sourceSet.has(r.destination));
    expect(chains.map(r => `${r.source} → ${r.destination}`)).toHaveLength(0);
  });
});
