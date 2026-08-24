/**
 * Shared getStaticPaths bodies for the three dynamic route families.
 *
 * Every locale renders the SAME set of pages — the URL prefix is the only thing that
 * differs, and that is carried by the file's location under src/pages/. Extracting the
 * path logic here means the ~1,000 facility pages, 9 province pages and 10 service
 * pages are enumerated ONCE. Copying these bodies into six more .astro files would
 * triple the surface for a data bug and let the locales silently diverge in which
 * facilities they publish — the very drift `page-parity` in tests/i18n-integrity
 * exists to catch.
 *
 * Presentation stays per-locale (prose must be translatable); DATA and LOGIC live here.
 */
import { allFacilityRecords, PROVINCES, SERVICE_MAP, provinceSlug, typeLabel } from '../helpers';
import { withheldKeys } from '../facility-quality.mjs';

export function provincePaths() {
  return PROVINCES.map((p) => ({
    params: { province: provinceSlug(p) },
    props: { provinceName: p },
  }));
}

export function servicePaths() {
  return Object.entries(SERVICE_MAP).map(([key, svc]) => ({
    params: { service: svc.slug },
    props: { serviceKey: key, serviceName: svc.plain, serviceLabel: svc.label },
  }));
}

export function facilityPaths() {
  // #1381 — `allFacilityRecords`, not `facilities`. `facilities` is now the SOUTH
  // AFRICAN directory and excludes the three Maseru records adjudicated in
  // `outside-sa.ts`; those records keep their live, indexed URLs, because the page
  // is where the correction is delivered. Routing off the narrowed corpus would
  // replace three pages that say "this is in Lesotho" with three 404s.
  const validFacilities = allFacilityRecords.filter((f) => PROVINCES.includes(f.province as any));

  // #929 — pages whose OSM `name` is a category string ("health care", "Clinic") or
  // that duplicate a facility already on the site are withheld from the sitemap by
  // astro.config.mjs. Mark the SAME set noindex so the two signals agree; a page in
  // neither the sitemap nor the index is one we have simply stopped volunteering,
  // while staying live for anyone who reaches it. No sourced value is edited.
  const withheld = withheldKeys(validFacilities);

  // ── Duplicate-title disambiguation (#929, corrected #1239a) ─────────────
  //
  // The <title> a facility page renders is
  //     `${name} — ${typeLabel(type)} in ${province}${titleSuffix}`
  // so the ONLY thing that can make two of those differ is titleSuffix. This
  // block used to count duplicates on the BASE title alone and then choose the
  // suffix from `city || suburb || district`. Where a duplicate group shares a
  // district and has no address — which is the normal shape for an OSM node
  // carrying nothing but a name and a pair of coordinates — every member of the
  // group got the SAME suffix and the titles stayed identical. The
  // disambiguator was keyed on a value the whole group shares.
  //
  // That shipped 15 duplicate-title groups across the three locales, the worst
  // being 12 pages all titled "health care — Clinic in Mpumalanga, Ehlanzeni
  // District". tests/seo-integrity.test.ts asserted zero the whole time and had
  // never run at push (#1239a).
  //
  // The fix is a SECOND pass over the FULL title. Anything still colliding is
  // disambiguated by coordinates, which is the one field every record has and
  // no two records share. Coordinates are also the only honest choice here:
  // these records have no street, no suburb, no city and no sub-district, so
  // there is nothing else true to say about where they are. A slug tail was
  // rejected — the old fallback would have produced "(limpopo-2)" for a
  // facility in MPUMALANGA, because those slugs were minted under an earlier
  // province assignment and are frozen (a slug is a URL; renaming it 404s an
  // indexed page). Putting a wrong province name in the title of a clinic page
  // on a humanitarian site is the exact harm this is meant to prevent.
  //
  // No sourced value is edited, and no URL changes.
  const dms = (lat: number, lng: number) =>
    `${Math.abs(lat).toFixed(2)}°${lat < 0 ? 'S' : 'N'}, ${Math.abs(lng).toFixed(2)}°${lng < 0 ? 'W' : 'E'}`;

  const baseTitleOf = (f: (typeof validFacilities)[number]) =>
    `${f.name} — ${typeLabel(f.type)} in ${f.province}`;

  // Pass 1 — how many records share the base title?
  const titleCounts = new Map<string, number>();
  for (const f of validFacilities) {
    const b = baseTitleOf(f);
    titleCounts.set(b, (titleCounts.get(b) || 0) + 1);
  }

  // Pass 1b — the locality suffix, where one exists and the base collides.
  const localitySuffix = new Map<string, string>();
  for (const f of validFacilities) {
    if ((titleCounts.get(baseTitleOf(f)) || 0) < 2) {
      localitySuffix.set(f.slug, '');
      continue;
    }
    const loc = f.address.city || f.address.suburb || f.sub_district || f.district;
    localitySuffix.set(f.slug, loc ? `, ${loc}` : '');
  }

  // Pass 2 — count the FULL title. Whatever still collides gets coordinates.
  const fullCounts = new Map<string, number>();
  for (const f of validFacilities) {
    const t = baseTitleOf(f) + (localitySuffix.get(f.slug) || '');
    fullCounts.set(t, (fullCounts.get(t) || 0) + 1);
  }

  const suffixes = new Map<string, string>();
  for (const f of validFacilities) {
    const loc = localitySuffix.get(f.slug) || '';
    const full = baseTitleOf(f) + loc;
    if ((fullCounts.get(full) || 0) < 2) {
      suffixes.set(f.slug, loc);
      continue;
    }
    suffixes.set(f.slug, `${loc} (${dms(f.coordinates.lat, f.coordinates.lng)})`);
  }

  return validFacilities.map((f) => {
    const titleSuffix = suffixes.get(f.slug) || '';

    return {
      params: { province: provinceSlug(f.province), slug: f.slug },
      props: {
        facility: f,
        titleSuffix,
        withheldReason: withheld.get(`${f.province}|${f.slug}`) ?? null,
      },
    };
  });
}
