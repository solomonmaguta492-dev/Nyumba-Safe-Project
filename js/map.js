// The Leaflet map. Leaflet is loaded in index.html as the global L.
import { MAP_CENTER, MAP_ZOOM } from "./config.js";
import { escapeHtml } from "./format.js";
import { pinPoint, areaCenter } from "./areas.js";

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

/*
  Pins use pinPoint, so a listing always lands in its own area.
  When an area is chosen, the map moves to that area.
*/
export function showPins(listings, area = "all") {
  pinLayer.clearLayers();
  pins.clear();
  const points = [];

  listings.forEach((l) => {
    const point = pinPoint(l);
    if (!point) return;
    const pin = L.marker(point).addTo(pinLayer);
    pin.bindPopup(`<strong>${escapeHtml(l.name)}</strong><br>${escapeHtml(l.area)}`);
    pin.on("click", () => onPinClick(l.id));
    pins.set(String(l.id), pin);
    points.push(point);
  });

  const center = area === "all" ? null : areaCenter(area);
  if (points.length) map.fitBounds(points, { padding: [30, 30], maxZoom: 15 });
  else if (center) map.setView(center, 14);
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