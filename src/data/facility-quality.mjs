/**
 * facility-quality.mjs — decide which facility pages we are willing to SUBMIT.
 *
 * WHY (#929)
 * ----------
 * 21 facility pages in the submitted sitemap are titled with an OpenStreetMap `name`
 * tag that was never a facility name — "health care" x9, "Clinic" x4, "sick bay",
 * "middelbirg hospital" (a misspelling of a hospital already on the site, mapped
 * 4.8 km away by a different contributor). A further 16 same-province duplicate
 * clusters cost 21 more URLs. The page renders the string verbatim as its <h1> and
 * <title>, so a searcher sees "health care" in the results and lands on a page that
 * cannot help them.
 *
 * WHAT THIS DELIBERATELY DOES NOT DO
 * ----------------------------------
 * It does NOT edit `name`. `src/data/_provenance.json` declares name, address and
 * coordinates as `sourced`, so rewriting "middelbirg hospital" to "Middelburg
 * Hospital" would silently convert a sourced value into a modelled guess while it
 * still reads as sourced — and if the two records are NOT the same hospital, it
 * produces two identically-titled pages, one sending a sick person to coordinates
 * 4.8 km from the door. The same argument blocks auto-merging duplicates on name
 * equality. So every page stays live and every sourced value stays untouched; we
 * only stop VOLUNTEERING the ones we cannot stand behind.
 *
 * There was no pre-existing quality gate to re-tune: sitemap-priority-paths.json is
 * a static impression-derived allowlist (#868), and the 98 facility pages already
 * absent from it are absent because they never earned an impression, not because
 * anything judged them.
 */

// OSM `name` values that are a category, not a name. Compared case-insensitively.
const GENERIC_NAMES = new Set([
  'clinic', 'clinics', 'hospital', 'health care', 'healthcare', 'health',
  'health centre', 'health center', 'sick bay', 'surgery', 'pharmacy',
  'dispensary', 'mobile clinic', 'day hospital', 'consulting rooms',
]);

/** Reason this name is unusable as a page title, or null if it is fine. */
export function junkNameReason(name) {
  const s = (name || '').trim();
  if (!s) return 'empty';
  // An all-lowercase name is an OSM contributor's freeform note, never a proper
  // facility name — "middelbirg hospital", "slovo park clinic", "sick bay".
  if (s === s.toLowerCase() && /[a-z]/.test(s)) return 'all-lowercase';
  if (GENERIC_NAMES.has(s.toLowerCase())) return 'generic-noun';
  return null;
}

/** How much a record actually tells the reader. Used only to break duplicate ties. */
export function fieldFill(f) {
  const a = f.address || {};
  const c = f.contact || {};
  return [
    a.street, a.city, a.suburb, a.postal_code,
    c.phone, c.email, f.operator, f.operating_hours,
    Array.isArray(f.services) && f.services.length ? 'y' : '',
  ].filter(Boolean).length;
}

const normName = (s) => (s || '').toLowerCase().replace(/[^a-z0-9]/g, '');

/**
 * Keys ("<province>|<slug>") whose page should be withheld from the sitemap and
 * marked noindex. Pure function of the corpus — no I/O, so astro.config.mjs and the
 * page template can both call it and cannot disagree.
 */
export function withheldKeys(facilities) {
  const out = new Map();

  for (const f of facilities) {
    const r = junkNameReason(f.name);
    if (r) out.set(`${f.province}|${f.slug}`, r);
  }

  // Records that resolve to the SAME OpenStreetMap object are the same facility —
  // that is not a heuristic, it is what an OSM id means. #1228 surfaced three such
  // pairs while adjudicating the drift check's first MISSING findings: the node we
  // published had been DELETED BY A MAPPER BECAUSE IT WAS A DUPLICATE, and once our
  // record was repointed at the surviving building polygon it collided with a record
  // we were already publishing for the same building. The name rule below happens to
  // catch two of them ("Ha Grove Hospital" / "H.A. Grove Hospital" normalise the same,
  // as do the two "Tower Psychiatric Hospital" records) and structurally cannot catch
  // the third: "Elliot Provincial Hospital" and "Elliot Hospital" are different
  // strings for one 52-bed hospital at 1 Maclear Road, Khowa, and both were being
  // submitted. Identity beats spelling, so this runs FIRST.
  //
  // It cannot produce the false positive the name rule is careful about. Withholding
  // on name equality risks hiding two genuinely different clinics that share a name;
  // two records carrying one OSM id are one object by construction, so the only
  // question is which record describes it best.
  const byObject = new Map();
  for (const f of facilities) {
    const id = (f.facility_id || '').trim();
    if (!id) continue;
    if (!byObject.has(id)) byObject.set(id, []);
    byObject.get(id).push(f);
  }
  for (const group of byObject.values()) {
    if (group.length < 2) continue;
    const ranked = [...group].sort(
      (a, b) => fieldFill(b) - fieldFill(a)
             || (b.data_quality_score || 0) - (a.data_quality_score || 0)
             || String(a.slug).localeCompare(String(b.slug))
    );
    for (const f of ranked.slice(1)) {
      const key = `${f.province}|${f.slug}`;
      if (!out.has(key)) out.set(key, 'duplicate-osm-object');
    }
  }

  // Same-province duplicates: keep the single most-informative record, withhold the
  // rest. Ties break on slug so the choice is stable across builds — an unstable
  // sitemap would churn every deploy.
  const clusters = new Map();
  for (const f of facilities) {
    const k = `${f.province}|${normName(f.name)}`;
    if (!clusters.has(k)) clusters.set(k, []);
    clusters.get(k).push(f);
  }
  for (const group of clusters.values()) {
    if (group.length < 2) continue;
    const ranked = [...group].sort(
      (a, b) => fieldFill(b) - fieldFill(a)
             || (b.data_quality_score || 0) - (a.data_quality_score || 0)
             || String(a.slug).localeCompare(String(b.slug))
    );
    for (const f of ranked.slice(1)) {
      const key = `${f.province}|${f.slug}`;
      if (!out.has(key)) out.set(key, 'duplicate');
    }
  }
  return out;
}
