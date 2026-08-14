#!/usr/bin/env python3
"""Cross-check facilities.json `province` against each record's own `coordinates`.

Why (2026-08-14): 130 of 1,076 records (12%) named a NEIGHBOURING province -- Kimberley
Hospital under Free State, Ermelo Hospital under KwaZulu-Natal, Sebokeng Hospital under
North West. `province` drives the URL (/clinics/<province>/<slug>) and every province
listing, so a wrong value files a facility in a province a reader would never look in.

Method: point-in-polygon each record's coordinates against the 52 SA district-municipality
boundaries, mapped to their provinces via D2P below. Coordinates are the reliable sourced
value; the province tag is not.

Usage:
  curl -sL https://raw.githubusercontent.com/codeforgermany/click_that_hood/main/public/data/south-africa.geojson -o /tmp/za.geojson
  python3 ops/validate-province-by-coords.py

Exits 1 if any mismatch is found. Boundary noise: treat hits under ~3 km from the stated
province's border as needing manual confirmation against address.city before changing.
"""
import json
D2P = {
 'Alfred Nzo District':'Eastern Cape','Amathole District':'Eastern Cape','Buffalo City Metropolitan':'Eastern Cape',
 'Chris Hani District':'Eastern Cape','Joe Gqabi District':'Eastern Cape','Nelson Mandela Bay Metropolitan':'Eastern Cape',
 'O.R. Tambo District':'Eastern Cape','Sarah Baartman District':'Eastern Cape',
 'Fezile Dabi District':'Free State','Lejweleputswa District':'Free State','Mangaung Metropolitan':'Free State',
 'Thabo Mofutsanyana District':'Free State','Xhariep District':'Free State',
 'City of Johannesburg Metropolitan':'Gauteng','City of Tshwane Metropolitan':'Gauteng','Ekurhuleni Metropolitan':'Gauteng',
 'Sedibeng District':'Gauteng','West Rand District':'Gauteng',
 'Amajuba District':'KwaZulu-Natal','eThekwini Metropolitan':'KwaZulu-Natal','iLembe District':'KwaZulu-Natal',
 'Sisonke District':'KwaZulu-Natal','Ugu District':'KwaZulu-Natal','uMgungundlovu District':'KwaZulu-Natal',
 'Umkhanyakude District':'KwaZulu-Natal','Umzinyathi District':'KwaZulu-Natal','Uthukela District':'KwaZulu-Natal',
 'uThungulu District':'KwaZulu-Natal','Zululand District':'KwaZulu-Natal',
 'Capricorn District':'Limpopo','Mopani District':'Limpopo','Sekhukhune District':'Limpopo','Vhembe District':'Limpopo','Waterberg District':'Limpopo',
 'Ehlanzeni District':'Mpumalanga','Gert Sibande District':'Mpumalanga','Nkangala District':'Mpumalanga',
 'Bojanala Platinum District':'North West','Dr Kenneth Kaunda District':'North West','Dr Ruth Segomotsi Mompati District':'North West','Ngaka Modiri Molema District':'North West',
 'Frances Baard District':'Northern Cape','John Taolo Gaetsewe District':'Northern Cape','Namakwa District':'Northern Cape','Pixley ka Seme District':'Northern Cape','ZF Mgcawu District':'Northern Cape',
 'Cape Winelands District':'Western Cape','Central Karoo District':'Western Cape','City of Cape Town':'Western Cape','Eden District':'Western Cape','Overberg District':'Western Cape','West Coast District':'Western Cape',
}
g=json.load(open('/tmp/za.geojson'))
polys=[]
for f in g['features']:
    n=f['properties']['name']; gm=f['geometry']
    parts = gm['coordinates'] if gm['type']=='MultiPolygon' else [gm['coordinates']]
    for p in parts:
        ring=p[0]
        xs=[c[0] for c in ring]; ys=[c[1] for c in ring]
        polys.append((n, D2P[n], ring, [h for h in p[1:]], min(xs),max(xs),min(ys),max(ys)))

def inring(x,y,ring):
    inside=False; n=len(ring); j=n-1
    for i in range(n):
        xi,yi=ring[i][0],ring[i][1]; xj,yj=ring[j][0],ring[j][1]
        if ((yi>y)!=(yj>y)) and (x < (xj-xi)*(y-yi)/(yj-yi)+xi): inside=not inside
        j=i
    return inside

def locate(lng,lat):
    for n,prov,ring,holes,x0,x1,y0,y1 in polys:
        if x0<=lng<=x1 and y0<=lat<=y1 and inring(lng,lat,ring):
            if any(inring(lng,lat,h) for h in holes): continue
            return n,prov
    return None,None

if __name__ == '__main__':
    import sys, os
    root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    fac = json.load(open(os.path.join(root, 'src/data/facilities.json')))
    bad = []
    for f in fac:
        c = f.get('coordinates') or {}
        if c.get('lat') is None or c.get('lng') is None:
            continue
        d, p = locate(c['lng'], c['lat'])
        if p and p != f['province']:
            bad.append(f"{f['province']:>14} -> {p:<14} | {f['name'][:50]:<50} | {d}")
    for b in bad:
        print(b)
    print(f"{len(bad)} province/coordinate mismatch(es) across {len(fac)} facilities")
    sys.exit(1 if bad else 0)
