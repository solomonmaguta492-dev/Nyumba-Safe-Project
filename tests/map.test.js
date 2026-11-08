import { describe, it, expect, vi, beforeAll } from "vitest";
import { initMap, showPins, focusPin, refreshMap } from "../js/map.js";
import { AREA_CENTERS } from "../js/areas.js";

// A tiny fake of Leaflet, so the map code can run without a browser.
const markers = [];
const fakeMap = {
  setView: vi.fn(() => fakeMap),
  fitBounds: vi.fn(),
  getZoom: () => 12,
  invalidateSize: vi.fn(),
};

function fakeMarker(point) {
  const marker = {
    point,
    handlers: {},
    addTo: () => marker,
    bindPopup: vi.fn(),
    on: (event, fn) => (marker.handlers[event] = fn),
    getLatLng: () => point,
    openPopup: vi.fn(),
  };
  markers.push(marker);
  return marker;
}

const onPinClick = vi.fn();

beforeAll(() => {
  globalThis.L = {
    map: () => fakeMap,
    tileLayer: () => ({ addTo: vi.fn() }),
    layerGroup: () => ({ addTo: function () { return this; }, clearLayers: vi.fn() }),
    marker: fakeMarker,
  };
  initMap(onPinClick);
});

const listings = [
  { id: 1, name: "Sunrise", area: "Juja", lat: -1.1, lng: 37.01 },
  { id: 2, name: "No pin", area: "Atlantis", lat: null, lng: null },
  { id: 3, name: "Acacia", area: "Kasarani", lat: "-1.22", lng: "36.9" },
  { id: 4, name: "Wrong pin", area: "Karen", lat: -1.1019, lng: 37.0144 },
];

describe("map", () => {
  it("adds a pin only for listings with coordinates", () => {
    showPins(listings);
    expect(markers).toHaveLength(3);
    expect(markers[1].point).toEqual([-1.22, 36.9]);
    expect(fakeMap.fitBounds).toHaveBeenCalled();
  });

  it("puts a pin with wrong coordinates in its own area", () => {
    expect(markers[2].point).toEqual(AREA_CENTERS.karen);
  });

  it("tells the page which pin was clicked", () => {
    markers[0].handlers.click();
    expect(onPinClick).toHaveBeenCalledWith(1);
  });

  it("moves to a pin when its card is clicked", () => {
    focusPin(3);
    expect(fakeMap.setView).toHaveBeenLastCalledWith([-1.22, 36.9], 15);
    expect(markers[1].openPopup).toHaveBeenCalled();
  });

  it("ignores a listing with no pin", () => {
    fakeMap.setView.mockClear();
    focusPin(2);
    expect(fakeMap.setView).not.toHaveBeenCalled();
  });

  it("refreshes the map size", () => {
    refreshMap();
    expect(fakeMap.invalidateSize).toHaveBeenCalled();
  });

  it("moves to the chosen area when it has no pins", () => {
    showPins([], "Ruaka");
    expect(fakeMap.setView).toHaveBeenLastCalledWith(AREA_CENTERS.ruaka, 14);
  });
});
