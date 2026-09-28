/**
 * #1745 — a care-role record must not advertise services anywhere on its page.
 *
 * The visible services section was already suppressed for NOT_WALK_IN_CARE records,
 * but two other surfaces still read `facility.services` directly: the JSON-LD
 * `medicalSpecialty` array and the WhatsApp share text. Measured 2026-09-28 before the
 * fix: 9 of 13 care-role pages told search engines the place offers ARV/TB/HIV care,
 * and all 13 put the service list into the share message — so "Men's Health Clinics —
 * HIV / ARVs, TB treatment" was one tap from reaching someone looking for ARVs, for a
 * private herbal sexual-health business that had moved away from the pin.
 *
 * Asserted on BUILT output in all three locales, because the page is where the claim
 * reaches a reader. Positive control: an ordinary public clinic still carries both.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, existsSync } from 'fs';
import { join } from 'path';
import { NOT_WALK_IN_CARE } from '../src/data/care-role';

const DIST = 'dist';
const LOCALES = ['', 'xh/', 'zu/'];

function pageFor(locale: string, slug: string): string | null {
  const base = join(DIST, `${locale}clinics`);
  if (!existsSync(base)) return null;
  for (const prov of readdirSync(base)) {
    const f = join(base, prov, slug, 'index.html');
    if (existsSync(f)) return readFileSync(f, 'utf8');
  }
  return null;
}

function shareText(html: string): string {
  const m = html.match(/wa\.me\/\?text=([^"]*)/);
  return m ? decodeURIComponent(m[1].replace(/&#38;/g, '&')) : '';
}

describe('care-role pages advertise no services (#1745)', () => {
  for (const slug of Object.keys(NOT_WALK_IN_CARE)) {
    for (const locale of LOCALES) {
      it(`${locale}${slug}`, () => {
        const html = pageFor(locale, slug);
        expect(html, `no built page for ${locale}${slug} — run astro build`).not.toBeNull();
        expect(html!).not.toContain('medicalSpecialty');
        expect(shareText(html!)).not.toMatch(/ARV|TB treatment|Vaccinations|Family planning/);
      });
    }
  }

  it('positive control: an ordinary public clinic keeps both', () => {
    const html = pageFor('', 'hillbrow-community-health-centre-hillbrowjohannesburg');
    expect(html).not.toBeNull();
    expect(html!).toContain('medicalSpecialty');
    expect(shareText(html!)).toMatch(/ARVs/);
  });
});
