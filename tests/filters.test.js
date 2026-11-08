import { describe, it, expect } from "vitest";
import { applyFilters, getAreas } from "../js/filters.js";

const listings = [
  { id: 1, name: "Sunrise Apartments", area: "Juja", rent: 6500, bedrooms: 0 },
  { id: 2, name: "Greenview Court", area: "Juja", rent: 11000, bedrooms: 1 },
  { id: 3, name: "Acacia Heights", area: "Kasarani", rent: 22000, bedrooms: 2 },
  { id: 4, name: "Baraka Gardens", area: "Ruaka", rent: 35000, bedrooms: 3 },
  { id: 5, name: "Big House", area: "Ruaka", rent: 50000, bedrooms: 4 },
];

const none = { search: "", area: "all", maxRent: "", bedrooms: "any" };
const ids = (list) => list.map((l) => l.id);

describe("applyFilters", () => {
  it("shows everything with no filters", () => {
    expect(applyFilters(listings, none)).toHaveLength(5);
  });

  it("searches by name, ignoring case and spaces", () => {
    expect(ids(applyFilters(listings, { ...none, search: "  sunrise " }))).toEqual([1]);
  });

  it("filters by area", () => {
    expect(ids(applyFilters(listings, { ...none, area: "Juja" }))).toEqual([1, 2]);
  });

  it("filters by maximum rent", () => {
    expect(ids(applyFilters(listings, { ...none, maxRent: "11000" }))).toEqual([1, 2]);
  });

  it("matches an exact bedroom count", () => {
    expect(ids(applyFilters(listings, { ...none, bedrooms: "0" }))).toEqual([1]);
  });

  it("treats 3 as 3 or more", () => {
    expect(ids(applyFilters(listings, { ...none, bedrooms: "3" }))).toEqual([4, 5]);
  });

  it("combines filters", () => {
    const result = applyFilters(listings, { ...none, area: "Ruaka", maxRent: "40000" });
    expect(ids(result)).toEqual([4]);
  });
});

describe("getAreas", () => {
  it("returns each area once, sorted", () => {
    expect(getAreas(listings)).toEqual(["Juja", "Kasarani", "Ruaka"]);
  });

  it("skips listings with no area", () => {
    expect(getAreas([{ area: "" }, { area: "Juja" }])).toEqual(["Juja"]);
  });
});
