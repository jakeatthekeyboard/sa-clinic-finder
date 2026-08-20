import facilitiesRaw from './facilities.json';
import { careRole } from './care-role';

export interface Facility {
  facility_id: string;
  name: string;
  type: string;
  province: string;
  district: string;
  sub_district: string;
  address: {
    street: string;
    suburb: string;
    city: string;
    postal_code: string;
  };
  coordinates: {
    lat: number;
    lng: number;
  };
  contact: {
    phone: string;
    email: string;
    website: string;
  };
  operating_hours: {
    raw: string;
    is_24_hour: boolean;
  };
  services: Record<string, boolean>;
  operator: string;
  operator_type: string;
  data_source: string;
  data_quality_score: number;
  last_verified: string;
  slug: string;
  url_path: string;
}

export const facilities: Facility[] = facilitiesRaw as Facility[];

/**
 * Does this facility provide `serviceKey` to a member of the public?
 *
 * WHY THIS IS NOT JUST `f.services[key]` (#1376)
 * ----------------------------------------------
 * Temba SANTA Hospital in Makhanda CLOSED on 2023-07-01. Its record still carries
 * `services.emergency_24h: true`, so it was listed on /services/emergency as a place
 * to go with a medical emergency, counted in the emergency editorial's stated totals
 * and counted in the medical-emergency guide — for a building that stood empty within
 * a fortnight of the closure and has since been stripped by thieves. Someone acting on
 * that at 2am drives to a locked, vandalised site instead of to Settlers Hospital.
 *
 * The obvious repair is to set the flag false. #1349 forbids it, explicitly and
 * correctly: `emergency_24h` is not a sourced value, it was inferred from facility
 * TYPE (commit 3d5d03c), and this claim sits in emergency-basis.json's `unevidenced`
 * list. Flipping it would assert "this hospital does not run a 24-hour casualty",
 * which is a claim about a SERVICE and is not what we know. What we know — and what
 * `care-role.ts` already records, with the Eastern Cape DoH Annual Report 2023/24,
 * Spotlight and Grocott's Mail behind it — is that the FACILITY is closed. That is a
 * fact about the place, not about the service, so it is answered where facts about
 * the place live, and the sourced record is left exactly as OpenStreetMap has it.
 *
 * So the honest answer to "does a closed hospital belong in the emergency corpus" is
 * no, and it generalises with no special case: a facility adjudicated in `care-role.ts`
 * is by definition not somewhere a member of the public is treated, so it cannot be
 * listed as providing ANY service. That covers the state mortuary, the bedding
 * retailer, the veterinary practice, the office building, the shopping centre, the
 * blood bank, the retail pharmacy and the decommissioned hospital in one predicate —
 * 15 service listings in total, of which the emergency one is the dangerous one.
 *
 * The pages themselves are untouched and stay live, indexed and in the sitemap, per
 * `care-role.ts`'s own policy: people search for these places and the useful answer is
 * a page saying plainly what they are and where to go instead.
 */
export function providesService(f: Facility, serviceKey: string): boolean {
  return Boolean(f.services[serviceKey]) && careRole(f.slug) === null;
}

/**
 * The facilities that can appear in a service listing or count — everything except
 * the `care-role.ts` adjudications. Use this, not `facilities`, wherever a service is
 * being counted or listed, in EVERY locale: the three languages must agree or
 * tools/numeric-parity-check.py fails, and it should fail, because a count that
 * differs by language is a count one of them has got wrong.
 */
export const serviceCorpus: Facility[] = facilities.filter(f => careRole(f.slug) === null);

export const PROVINCES = [
  'Eastern Cape',
  'Free State',
  'Gauteng',
  'KwaZulu-Natal',
  'Limpopo',
  'Mpumalanga',
  'North West',
  'Northern Cape',
  'Western Cape',
] as const;

export const SERVICE_MAP: Record<string, { label: string; plain: string; slug: string }> = {
  arv_treatment: { label: 'ARV Treatment', plain: 'HIV / ARVs', slug: 'arvs' },
  tb_treatment: { label: 'TB Treatment', plain: 'TB treatment', slug: 'tb' },
  maternity_antenatal: { label: 'Maternity', plain: 'Having a baby', slug: 'maternity' },
  chronic_medication: { label: 'Chronic Medication', plain: 'Chronic meds', slug: 'chronic-medication' },
  emergency_24h: { label: '24h Emergency', plain: '24-hour emergency', slug: 'emergency' },
  dental: { label: 'Dental', plain: 'Dental care', slug: 'dental' },
  mental_health: { label: 'Mental Health', plain: 'Mental health', slug: 'mental-health' },
  child_health: { label: 'Child Health', plain: 'Child health', slug: 'child-health' },
  family_planning: { label: 'Family Planning', plain: 'Family planning', slug: 'family-planning' },
  immunisation: { label: 'Immunisation', plain: 'Vaccinations', slug: 'immunisation' },
  hiv_testing: { label: 'HIV Testing', plain: 'HIV testing', slug: 'hiv-testing' },
};

export const SERVICE_SLUGS = Object.fromEntries(
  Object.entries(SERVICE_MAP).map(([key, val]) => [val.slug, key])
);

export function provinceSlug(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '-');
}

export function typeLabel(type: string): string {
  const map: Record<string, string> = {
    clinic: 'Clinic',
    district_hospital: 'District Hospital',
    community_health_centre: 'Community Health Centre',
    regional_hospital: 'Regional Hospital',
    tertiary_hospital: 'Tertiary Hospital',
    central_hospital: 'Central Hospital',
    specialised_hospital: 'Specialised Hospital',
    mobile_clinic: 'Mobile Clinic',
    satellite_clinic: 'Satellite Clinic',
  };
  return map[type] || type.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

export function facilitiesByProvince(prov: string): Facility[] {
  return facilities.filter(f => f.province === prov);
}

export function facilitiesByService(serviceKey: string): Facility[] {
  return serviceCorpus.filter(f => f.services[serviceKey]);
}

export function nearbyFacilities(facility: Facility, count = 3): Facility[] {
  return facilities
    .filter(f => f.facility_id !== facility.facility_id && f.coordinates.lat !== 0)
    .map(f => ({
      f,
      dist: haversine(facility.coordinates.lat, facility.coordinates.lng, f.coordinates.lat, f.coordinates.lng),
    }))
    .sort((a, b) => a.dist - b.dist)
    .slice(0, count)
    .map(x => x.f);
}

function haversine(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function mapsUrl(lat: number, lng: number, name: string): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&destination_place_id=&travelmode=driving`;
}

export function whatsappShareUrl(facility: Facility): string {
  const services = Object.entries(facility.services)
    .filter(([, v]) => v)
    .map(([k]) => SERVICE_MAP[k]?.plain || k)
    .slice(0, 4)
    .join(', ');
  const text = `${facility.name} — ${services} — https://clinicfinder.co.za${facility.url_path}`;
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}
