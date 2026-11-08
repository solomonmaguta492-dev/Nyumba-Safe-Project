import { describe, it, expect, vi, beforeAll } from "vitest";
import { initMap, showPins, focusPin, refreshMap } from "../js/map.js";

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
  { id: 2, name: "No pin", area: "Juja", lat: null, lng: null },
  { id: 3, name: "Acacia", area: "Kasarani", lat: "-1.22", lng: "36.9" },
];

describe("map", () => {
  it("adds a pin only for listings with coordinates", () => {
    showPins(listings);
    expect(markers).toHaveLength(2);
    expect(markers[1].point).toEqual([-1.22, 36.9]);
    expect(fakeMap.fitBounds).toHaveBeenCalled();
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
});
