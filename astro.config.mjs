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
  // Translated locales (#1 isiXhosa / #2 isiZulu): only the locale HUB pages are
  // nominated — the homepage, the guides hub and (added with the isiXhosa province,
  // service and facility routes) the provinces and services hubs. All four are <=2
  // clicks from the English homepage via the language switcher, so they meet the
  // sitemap-growth criterion of structural reachability.
  //
  // Everything BELOW those hubs is deliberately NOT nominated: the individual translated
  // guides, the 9 translated province pages, the translated service pages, and above all
  // the ~1,000 translated facility detail pages. Per pipeline sitemap discipline a new
  // URL earns inclusion by demonstrating demand, and CF must not outrun indexing —
  // declaring a locale's facility corpus would roughly TRIPLE the submitted set on a site
  // whose whole growth story is that it was left alone. They stay reachable through
  // internal links and the switcher in the meantime.
  //
  // Note the `structuralPrefixes` loop below cannot reach these: a locale path has one
  // extra segment, so `/xh/clinics` does not start with `/clinics/` and
  // `/xh/clinics/gauteng` fails the <=3-segment test. Nomination here is the only route in.
  if (['/', '/clinics', '/services', '/guide', '/guides', '/search',
       '/how-this-site-is-made', '/about',
       '/xh', '/xh/guides', '/xh/clinics', '/xh/services',
       '/zu', '/zu/guides', '/zu/clinics', '/zu/services'].includes(path)) return true;
  for (const prefix of structuralPrefixes) {
    if (path.startsWith(prefix) && path.split('/').length <= 3) return true;
  }
  return false;
}

// #1063 — the log line used to print withheldPaths.size, the CANDIDATE set, and
// overstated the gate's effect by 18 (54 printed, 36 real). Withholding only DOES
// anything to a path the sitemap filter would otherwise ADMIT, and the admission rule
// is `isSubmittable` below: a facility detail path has four segments, so isStructural
// can never admit one, which leaves the impressions-derived priority manifest as the
// only way in. 18 of the 54 were never in that manifest, so withholding them changed
// nothing — they were candidates, not effects. This number is the ONLY visible readout
// of a data-quality gate, and an inflated one makes the gate look like it is doing 50%
// more than it is; a session sizing the #1002 problem from this log would over-count.
//
// The count is derived from isSubmittable rather than from `priorityPaths` directly so
// it cannot drift again: if the admission rule ever changes — a new structural prefix,
// facility paths becoming structural — the effective count follows it automatically
// instead of silently going back to describing something else. Both numbers are
// printed, because "36 of 54 candidates" is the honest shape: the other 18 are real
// quality findings that simply have no sitemap consequence.
function isSubmittable(path) {
  return priorityPaths.has(path) || isStructural(path);
}
const withheldEffective = [...withheldPaths].filter(isSubmittable);
console.log(
  `[sitemap] #929 quality gate: withholding ${withheldEffective.length} facility page(s) ` +
    `from the submitted sitemap (of ${withheldPaths.size} withhold candidate(s); the other ` +
    `${withheldPaths.size - withheldEffective.length} are not in the submitted set, so ` +
    `withholding them has no effect)`
);

export default defineConfig({
  site: 'https://clinicfinder.co.za',
  adapter: vercel(),
  integrations: [
    sitemap({
      filter: (page) => {
        const path = page.replace('https://clinicfinder.co.za', '') || '/';
        if (withheldPaths.has(path)) return false;
        return isSubmittable(path);
      },
    }),
  ],
  trailingSlash: 'never',
  build: {
    format: 'file',
  },
});
