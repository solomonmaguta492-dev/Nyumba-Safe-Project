// The Leaflet map. Leaflet is loaded in index.html as the global L.
import { MAP_CENTER, MAP_ZOOM } from "./config.js";
import { escapeHtml } from "./format.js";

let map;
let pinLayer;
let onPinClick = () => {};
const pins = new Map();

export function initMap(pinClickHandler) {
  onPinClick = pinClickHandler;
  map = L.map("map").setView(MAP_CENTER, MAP_ZOOM);
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "&copy; OpenStreetMap contributors",
  }).addTo(map);
  pinLayer = L.layerGroup().addTo(map);
}

function hasCoords(l) {
  const ok = (v) => v !== null && v !== undefined && v !== "" && Number.isFinite(Number(v));
  return ok(l.lat) && ok(l.lng);
}

// Listings without coordinates are skipped.
export function showPins(listings) {
  pinLayer.clearLayers();
  pins.clear();
  const points = [];

  listings.filter(hasCoords).forEach((l) => {
    const point = [Number(l.lat), Number(l.lng)];
    const pin = L.marker(point).addTo(pinLayer);
    pin.bindPopup(`<strong>${escapeHtml(l.name)}</strong><br>${escapeHtml(l.area)}`);
    pin.on("click", () => onPinClick(l.id));
    pins.set(String(l.id), pin);
    points.push(point);
  });

  if (points.length) map.fitBounds(points, { padding: [30, 30], maxZoom: 15 });
}

// Called when a card is clicked: move the map to its pin.
export function focusPin(id) {
  const pin = pins.get(String(id));
  if (!pin) return;
  map.setView(pin.getLatLng(), Math.max(map.getZoom(), 15));
  pin.openPopup();
}

// Needed when the map's container changes size.
export function refreshMap() {
  if (map) map.invalidateSize();
}