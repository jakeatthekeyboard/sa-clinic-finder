import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { parsePhones, telephoneSchemaValue } from '../src/data/phone';

const facilities = JSON.parse(readFileSync('src/data/facilities.json', 'utf-8')) as Array<{
  slug: string;
  contact: { phone: string };
}>;

describe('parsePhones', () => {
  it('leaves a single ordinary number alone but strips its punctuation from the href', () => {
    expect(parsePhones('+27 12 734 4274')).toEqual([
      { display: '+27 12 734 4274', href: '+27127344274' },
    ]);
  });

  it('segments the OSM multi-value `;` form into one dialable link per number', () => {
    // Citrusdal Hospital — the live page linked all three as one tel: URI.
    expect(parsePhones('+27 22 921 2153; +27 22 921 2154; +27 22 921 2155')).toEqual([
      { display: '+27 22 921 2153', href: '+27229212153' },
      { display: '+27 22 921 2154', href: '+27229212154' },
      { display: '+27 22 921 2155', href: '+27229212155' },
    ]);
  });

  it('keeps an extension in the text a reader sees and out of the number that is dialled', () => {
    // Gansbaai Clinic. `x3535` is not dialable digits, but it IS what to ask for.
    expect(parsePhones('+27 28 814 3530 x3535')).toEqual([
      { display: '+27 28 814 3530 x3535', href: '+27288143530' },
    ]);
    expect(parsePhones('+27 27 482 2166 x07')[0].href).toBe('+27274822166');
    expect(parsePhones('+27 23 614 8102 ext. 8100')[0].href).toBe('+27236148102');
  });

  it('keeps a national-format number national rather than inventing a country code', () => {
    expect(parsePhones('021 444 2918')).toEqual([
      { display: '021 444 2918', href: '0214442918' },
    ]);
  });

  it('emits nothing for an empty or digitless value rather than a bare tel: link', () => {
    expect(parsePhones('')).toEqual([]);
    expect(parsePhones(';  ;')).toEqual([]);
    expect(parsePhones('n/a')).toEqual([]);
  });
});

describe('telephoneSchemaValue', () => {
  it('is a string for one number and an array for several', () => {
    expect(telephoneSchemaValue('+27 12 734 4274')).toBe('+27127344274');
    expect(telephoneSchemaValue('+27 22 921 2153; +27 22 921 2154')).toEqual([
      '+27229212153',
      '+27229212154',
    ]);
    expect(telephoneSchemaValue('')).toBeUndefined();
  });
});

describe('the published corpus', () => {
  it('yields a dialable href for every record that carries a phone number', () => {
    const broken: string[] = [];
    for (const f of facilities) {
      if (!f.contact.phone.trim()) continue;
      const parsed = parsePhones(f.contact.phone);
      if (parsed.length === 0) {
        broken.push(`${f.slug}: parsed to nothing from ${JSON.stringify(f.contact.phone)}`);
        continue;
      }
      for (const p of parsed) {
        // Nothing but an optional leading + and digits may reach a tel: URI. A `;`
        // would be read as a URI parameter and an `x` is not dialable — those two
        // characters are the whole reason this module exists.
        if (!/^\+?\d{6,}$/.test(p.href)) {
          broken.push(`${f.slug}: ${JSON.stringify(p.href)}`);
        }
      }
    }
    expect(broken).toEqual([]);
  });

  it('still shows the reader the sourced string, character for character', () => {
    for (const f of facilities) {
      if (!f.contact.phone.trim()) continue;
      const rejoined = parsePhones(f.contact.phone).map(p => p.display).join(';');
      const sourced = f.contact.phone
        .split(';')
        .map(s => s.trim())
        .filter(Boolean)
        .join(';');
      expect(rejoined).toBe(sourced);
    }
  });
});
