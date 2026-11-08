// Known areas and their centre points, so pins land in the right place.

export const AREA_CENTERS = {
  juja: [-1.1018, 37.0144],
  thika: [-1.0333, 37.0693],
  ruiru: [-1.1466, 36.9609],
  "kahawa west": [-1.1856, 36.9257],
  "kahawa wendani": [-1.1966, 36.9336],
  roysambu: [-1.2186, 36.8869],
  kasarani: [-1.2216, 36.8985],
  githurai: [-1.2006, 36.9124],
  zimmerman: [-1.2105, 36.8920],
  ruaka: [-1.2054, 36.7826],
  kiambu: [-1.1714, 36.8356],
  westlands: [-1.2676, 36.8108],
  parklands: [-1.2610, 36.8180],
  kileleshwa: [-1.2810, 36.7830],
  kilimani: [-1.2891, 36.7850],
  lavington: [-1.2786, 36.7697],
  karen: [-1.3197, 36.7076],
  langata: [-1.3401, 36.7643],
  "south b": [-1.3110, 36.8370],
  "south c": [-1.3180, 36.8250],
  "nairobi cbd": [-1.2864, 36.8172],
  eastleigh: [-1.2741, 36.8484],
  embakasi: [-1.3189, 36.8954],
  "utawala": [-1.2845, 36.9645],
  kitengela: [-1.4749, 36.9600],
  rongai: [-1.3963, 36.7444],
  ngong: [-1.3590, 36.6535],
  kikuyu: [-1.2463, 36.6629],
};

// A pin further than this from its area's centre is treated as a mistake.
export const MAX_DISTANCE_KM = 8;

const key = (area) => String(area ?? "").trim().toLowerCase();

export function areaCenter(area) {
  return AREA_CENTERS[key(area)] || null;
}

// Straight-line distance between two [lat, lng] points, in km.
export function distanceKm([lat1, lng1], [lat2, lng2]) {
  const rad = (d) => (d * Math.PI) / 180;
  const a =
    Math.sin(rad(lat2 - lat1) / 2) ** 2 +
    Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(rad(lng2 - lng1) / 2) ** 2;
  return 6371 * 2 * Math.asin(Math.sqrt(a));
}

function ownCoords(l) {
  const ok = (v) => v !== null && v !== undefined && v !== "" && Number.isFinite(Number(v));
  return ok(l.lat) && ok(l.lng) ? [Number(l.lat), Number(l.lng)] : null;
}

/*
  Where to put a listing's pin:
  its own coordinates if they are inside its area,
  otherwise the area's centre, otherwise no pin.
*/
export function pinPoint(listing) {
  const own = ownCoords(listing);
  const center = areaCenter(listing.area);
  if (!center) return own;
  if (own && distanceKm(own, center) <= MAX_DISTANCE_KM) return own;
  return center;
}

// True when the coordinates are too far from a known area.
export function isOutsideArea(area, lat, lng) {
  const center = areaCenter(area);
  if (!center) return false;
  return distanceKm([Number(lat), Number(lng)], center) > MAX_DISTANCE_KM;
}
