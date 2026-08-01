// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';
import { readFileSync } from 'node:fs';
import { withheldKeys } from './src/data/facility-quality.mjs';

const priorityPaths = new Set(
  JSON.parse(readFileSync(new URL('./src/data/sitemap-priority-paths.json', import.meta.url), 'utf-8'))
);

// #929 — the manifest is an impression-derived allowlist, so a page can be in it and
// still be one we should not volunteer: 21 titled with an OSM category string
// ("health care", "Clinic", "sick bay") and 21 more that duplicate a facility already
// on the site. Withhold those from the sitemap WITHOUT touching any sourced value.
// The page stays live and reachable; the detail template marks the same set noindex,
// so the two signals agree.
const facilitiesData = JSON.parse(
  readFileSync(new URL('./src/data/facilities.json', import.meta.url), 'utf-8')
);
const withheld = withheldKeys(facilitiesData);
const withheldPaths = new Set(
  [...withheld.keys()].map((k) => {
    const [province, slug] = k.split('|');
    return `/clinics/${province.toLowerCase().replace(/ /g, '-')}/${slug}`;
  })
);
console.log(`[sitemap] #929 quality gate: withholding ${withheldPaths.size} facility page(s)`);

const structuralPrefixes = ['/clinics/', '/services/', '/guides/'];
function isStructural(path) {
  // /how-this-site-is-made is nominated deliberately (#844): it is the AI-transparency and
  // E-E-A-T asset, it documents the EU AI Act Art.50(4) editorial-responsibility carve-out
  // the portfolio relies on, and tools/ai-transparency-check.py already guards its content
  // every 2h. It belongs HERE rather than in sitemap-priority-paths.json because that
  // manifest is impressions-derived and regenerated (876 -> 1015 paths at 69da63c), so a
  // hand-added zero-impression entry would be silently dropped on the next refresh.
  // /about is nominated for the same reason, added 2026-08-01. It is homepage-linked
  // (one click), indexable (no robots noindex, unlike /contact, /privacy and /terms which
  // ARE noindex and are correctly absent), and carries BreadcrumbList schema — so it meets
  // the sitemap-growth criterion of being reachable in <=2 clicks. It matters more here
  // than on a typical site: a clinic finder is YMYL health content, where "who is behind
  // this site" is a first-order E-E-A-T signal. It has zero impressions, so it can never
  // enter the impressions-derived manifest on its own; the structural list is the only
  // place a deliberate nomination survives a manifest refresh.
  if (['/', '/clinics', '/services', '/guide', '/guides', '/search',
       '/how-this-site-is-made', '/about'].includes(path)) return true;
  for (const prefix of structuralPrefixes) {
    if (path.startsWith(prefix) && path.split('/').length <= 3) return true;
  }
  return false;
}

export default defineConfig({
  site: 'https://clinicfinder.co.za',
  adapter: vercel(),
  integrations: [
    sitemap({
      filter: (page) => {
        const path = page.replace('https://clinicfinder.co.za', '') || '/';
        if (withheldPaths.has(path)) return false;
        return priorityPaths.has(path) || isStructural(path);
      },
    }),
  ],
  trailingSlash: 'never',
  build: {
    format: 'file',
  },
});
