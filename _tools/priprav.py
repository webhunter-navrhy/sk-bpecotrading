#!/usr/bin/env python3
"""Príprava dát: realizácie z podklady/ref/refs.json + súradnice obcí -> _data/realizacie.json, src/_mapa.svg.
   Mapa: okresy z geoBoundaries (SVK ADM2, CC BY 4.0), súradnice obcí z OpenStreetMap Nominatim."""
import json, math, os, re, shutil
from PIL import Image, ImageOps
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
P = lambda *a: os.path.join(ROOT, *a)
refs = json.load(open(P('podklady/ref/refs.json')))
towns = json.load(open(P('podklady/geo/towns.json')))
adm2 = json.load(open(P('podklady/geo/adm2.geojson')))

LON0, LON1, LAT0, LAT1 = 20.02, 21.86, 48.64, 49.36
K = 1000 / ((LON1 - LON0) * math.cos(math.radians(49)))
W, H = 1000, round((LAT1 - LAT0) * K)
def xy(lon, lat):
    return round((lon - LON0) * math.cos(math.radians(49)) * K, 1), round((LAT1 - lat) * K, 1)

# realizácie
out = []
for i, r in enumerate(refs):
    m = re.match(r'(.+?),\s*výkon\s*[–-]?\s*([\d,]+)\s*kWp,\s*realizácia\s*(\d{4})', r['popis'].replace('\xa0', ' '))
    obec, kwp, rok = m.group(1).strip(), float(m.group(2).replace(',', '.')), int(m.group(3))
    src = P('podklady', r['soubor'])
    fn = f"ref/r{i:03d}.jpg"
    dst = P('img', fn)
    if not os.path.exists(dst):
        im = ImageOps.exif_transpose(Image.open(src)).convert('RGB')
        im.thumbnail((1920, 1920))
        im.save(dst, quality=86)
    t = towns.get(obec)
    x, y = xy(t['lon'], t['lat']) if t else (None, None)
    out.append({"id": i, "obec": obec, "kwp": kwp, "kwp_txt": m.group(2), "rok": rok, "sektor": r['sektor'],
                "foto": fn, "x": x, "y": y, "na_mape": bool(t and 0 <= x <= W and 0 <= y <= H)})
json.dump(out, open(P('_data/realizacie.json'), 'w'), ensure_ascii=False, indent=1)

# okresy -> SVG path
def ring_path(ring):
    pts, last = [], None
    for lon, lat in ring:
        p = xy(lon, lat)
        if last and abs(p[0]-last[0]) + abs(p[1]-last[1]) < 2.2: continue
        pts.append(p); last = p
    if len(pts) < 3: return ''
    return 'M' + 'L'.join(f"{x:g},{y:g}" for x, y in pts) + 'Z'
paths = []
for f in adm2['features']:
    g = f['geometry']
    polys = g['coordinates'] if g['type'] == 'MultiPolygon' else [g['coordinates']]
    lons = [c[0] for poly in polys for ring in poly for c in ring]; lats = [c[1] for poly in polys for ring in poly for c in ring]
    if max(lons) < LON0 - .3 or min(lons) > LON1 + .3 or max(lats) < LAT0 - .3 or min(lats) > LAT1 + .3: continue
    d = ''.join(ring_path(poly[0]) for poly in polys)
    if d: paths.append(d)
svg = [f'<svg class="mapa-svg" viewBox="0 0 {W} {H}" role="img" aria-labelledby="mapa-t">',
       '<title id="mapa-t">Mapa realizácií BP EcoTrading na Spiši a vo východnom Slovensku</title>',
       '<g class="okresy">' + ''.join(f'<path d="{d}"/>' for d in paths) + '</g>']
tx, ty = xy(20.17, 49.215)
svg.append(f'<text class="mapa-hory" x="{tx}" y="{ty}">Vysoké Tatry</text>')
svg.append('<g class="obce"></g></svg>')
open(P('src/_mapa.svg'), 'w').write('\n'.join(svg) + '\n')
print(f"{len(out)} realizácií, na mape {sum(o['na_mape'] for o in out)}, okresov {len(paths)}, viewBox {W}x{H}")
