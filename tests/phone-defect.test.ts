/**
 * #1510 — a published telephone number is dialable, in every language.
 */
import { describe, it, expect } from 'vitest';
import { allFacilityRecords } from '../src/data/helpers';
import { renderablePhones, telephoneSchema, parsePhones } from '../src/data/phone';
import { PHONE_WITHHELD, phoneWithheldReason } from '../src/data/phone-defect';

const rec = (slug: string) => allFacilityRecords.find(f => f.slug === slug)!;

describe('#1510 — withheld numbers reach no surface', () => {
  it.each(Object.keys(PHONE_WITHHELD))('%s renders no number and no schema', (slug) => {
    const f = rec(slug);
    expect(f, `${slug} left the corpus`).toBeDefined();
    expect(renderablePhones(f)).toEqual([]);
    expect(telephoneSchema(f)).toBeUndefined();
  });

  it('the sourced value is UNTOUCHED — withholding is a rendering decision', () => {
    // care-role.ts's discipline: we stop offering a value we cannot stand behind, we do
    // not rewrite what OpenStreetMap holds.
    for (const slug of Object.keys(PHONE_WITHHELD)) {
      expect(rec(slug).contact.phone, `${slug}'s sourced number was edited`).not.toBe('');
    }
  });

  it('every withheld entry states OSM evidence and a digit count', () => {
    for (const [slug, reason] of Object.entries(PHONE_WITHHELD)) {
      expect(reason, slug).toMatch(/OSM (node|way|relation) \d+/);
      expect(reason, slug).toMatch(/digits/);
    }
  });

  it('a published record still renders its number', () => {
    const f = rec('comprehensive-health-care-parow-valley-cape-town');
    expect(phoneWithheldReason(f.slug)).toBeNull();
    expect(renderablePhones(f).map(p => p.href)).toEqual(['+27219334545']);
  });

  it('Parow Valley carries the value OSM way 740437416 actually holds', () => {
    // Re-sourced from changeset 182687941 (rdwade, 2026-05-15), not guessed.
    expect(rec('comprehensive-health-care-parow-valley-cape-town').contact.phone).toBe('+27 21 933 4545');
  });

  it('every published number has a nine-digit subscriber part', () => {
    const bad: string[] = [];
    for (const f of allFacilityRecords) {
      for (const p of renderablePhones(f)) {
        const d = p.href.replace(/\D/g, '');
        const len = p.href.startsWith('+') ? d.length - 2 : (d.startsWith('0') ? d.length - 1 : d.length - 2);
        if (len !== 9) bad.push(`${f.slug}: ${p.display}`);
      }
    }
    expect(bad).toEqual([]);
  });

  it('withholding is per RECORD, not per string — an identical number elsewhere still renders', () => {
    // The defect is in a specific record's sourced tag, so the adjudication is keyed on
    // the slug. A different facility legitimately sharing a switchboard is unaffected.
    const withheldStrings = new Set(Object.keys(PHONE_WITHHELD).map(s => rec(s).contact.phone));
    for (const f of allFacilityRecords) {
      if (phoneWithheldReason(f.slug)) continue;
      if (withheldStrings.has(f.contact.phone) && f.contact.phone) {
        expect(renderablePhones(f).length).toBeGreaterThan(0);
      }
    }
  });

  it('parsePhones itself is unchanged — the filter is in renderablePhones, not the parser', () => {
    // Keeping the parser pure is what lets tools/phone-format-check.py mirror it.
    const f = rec('pietertjie-de-beer-clinic-eastern-cape');
    expect(parsePhones(f.contact.phone).length).toBe(1);
    expect(renderablePhones(f).length).toBe(0);
  });
});
