import facilitiesRaw from './facilities.json';

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
    satellite_clinic: 'Satellite Clinic',
  };
  return map[type] || type.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

export function facilitiesByProvince(prov: string): Facility[] {
  return facilities.filter(f => f.province === prov);
}

export function facilitiesByService(serviceKey: string): Facility[] {
  return facilities.filter(f => f.services[serviceKey]);
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
