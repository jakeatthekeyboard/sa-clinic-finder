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
import { facilities, PROVINCES, SERVICE_MAP, provinceSlug, typeLabel } from '../helpers';
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
  const validFacilities = facilities.filter((f) => PROVINCES.includes(f.province as any));

  // #929 — pages whose OSM `name` is a category string ("health care", "Clinic") or
  // that duplicate a facility already on the site are withheld from the sitemap by
  // astro.config.mjs. Mark the SAME set noindex so the two signals agree; a page in
  // neither the sitemap nor the index is one we have simply stopped volunteering,
  // while staying live for anyone who reaches it. No sourced value is edited.
  const withheld = withheldKeys(validFacilities);

  // Detect duplicate base titles: "Name — Type in Province"
  const titleCounts = new Map<string, number>();
  for (const f of validFacilities) {
    const baseTitle = `${f.name} — ${typeLabel(f.type)} in ${f.province}`;
    titleCounts.set(baseTitle, (titleCounts.get(baseTitle) || 0) + 1);
  }

  return validFacilities.map((f) => {
    const baseTitle = `${f.name} — ${typeLabel(f.type)} in ${f.province}`;
    let titleSuffix = '';
    if ((titleCounts.get(baseTitle) || 0) > 1) {
      // Disambiguate: prefer city > suburb > district > slug tail
      const loc = f.address.city || f.address.suburb || f.district;
      if (loc) {
        titleSuffix = `, ${loc}`;
      } else {
        // Extract suffix from slug (e.g. "health-care-limpopo-2" → "2")
        const namePart = f.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        const tail = f.slug.slice(namePart.length).replace(/^-/, '');
        if (tail) {
          titleSuffix = ` (${tail})`;
        }
      }
    }

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
