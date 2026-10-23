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
