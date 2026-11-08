import { describe, it, expect } from "vitest";
import { areaCenter, distanceKm, pinPoint, isOutsideArea, AREA_CENTERS } from "../js/areas.js";

describe("areaCenter", () => {
  it("finds an area ignoring case and spaces", () => {
    expect(areaCenter(" ruaka ")).toEqual(AREA_CENTERS.ruaka);
    expect(areaCenter("South B")).toEqual(AREA_CENTERS["south b"]);
  });

  it("returns null for an unknown area", () => {
    expect(areaCenter("Atlantis")).toBeNull();
    expect(areaCenter(undefined)).toBeNull();
  });
});

describe("distanceKm", () => {
  it("is 0 for the same point", () => {
    expect(distanceKm([-1.2, 36.8], [-1.2, 36.8])).toBe(0);
  });

  it("measures Juja to Karen at about 42 km", () => {
    const km = distanceKm(AREA_CENTERS.juja, AREA_CENTERS.karen);
    expect(km).toBeGreaterThan(38);
    expect(km).toBeLessThan(46);
  });
});

describe("pinPoint", () => {
  it("keeps coordinates that are inside the area", () => {
    expect(pinPoint({ area: "Ruaka", lat: -1.21, lng: 36.79 })).toEqual([-1.21, 36.79]);
  });

  it("moves a pin with wrong coordinates to its area", () => {
    const karenListingWithJujaCoords = { area: "Karen", lat: -1.1019, lng: 37.0144 };
    expect(pinPoint(karenListingWithJujaCoords)).toEqual(AREA_CENTERS.karen);
  });

  it("uses the area centre when there are no coordinates", () => {
    expect(pinPoint({ area: "juja", lat: null, lng: null })).toEqual(AREA_CENTERS.juja);
  });

  it("keeps its own coordinates when the area is unknown", () => {
    expect(pinPoint({ area: "Atlantis", lat: "-1.5", lng: "37.5" })).toEqual([-1.5, 37.5]);
  });

  it("gives no pin for an unknown area with no coordinates", () => {
    expect(pinPoint({ area: "Atlantis", lat: "", lng: "" })).toBeNull();
  });
});

describe("isOutsideArea", () => {
  it("flags coordinates far from the area", () => {
    expect(isOutsideArea("Ruaka", -1.1018, 37.0144)).toBe(true);
  });

  it("accepts coordinates inside the area", () => {
    expect(isOutsideArea("Ruaka", "-1.2054", "36.7826")).toBe(false);
  });

  it("does not judge unknown areas", () => {
    expect(isOutsideArea("Atlantis", 0, 40)).toBe(false);
  });
});
