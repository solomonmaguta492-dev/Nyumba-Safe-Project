import { describe, it, expect } from "vitest";
import { normalizePhone, validateListing, validateReport } from "../js/validators.js";

const good = {
  name: "Sunrise Apartments",
  area: "Juja",
  bedrooms: "1",
  rent: "8500",
  manager: "Mr. Kamau",
  phone: "0712345678",
  facebook: "",
  lat: "",
  lng: "",
};

describe("normalizePhone", () => {
  it("turns 07... into 2547...", () => {
    expect(normalizePhone("0712345678")).toBe("254712345678");
  });

  it("removes +, spaces and dashes", () => {
    expect(normalizePhone("+254 712-345-678")).toBe("254712345678");
  });

  it("accepts 01... numbers", () => {
    expect(normalizePhone("0112345678")).toBe("254112345678");
  });

  it("handles empty values", () => {
    expect(normalizePhone(undefined)).toBe("");
  });
});

describe("validateListing", () => {
  it("returns no errors for a good listing", () => {
    expect(validateListing(good)).toEqual({});
  });

  it("requires name, area, bedrooms, rent, manager and phone", () => {
    const errors = validateListing({});
    expect(Object.keys(errors)).toEqual(
      expect.arrayContaining(["name", "area", "bedrooms", "rent", "manager", "phone"])
    );
  });

  it("rejects rent of 0 or less", () => {
    expect(validateListing({ ...good, rent: "0" }).rent).toBeDefined();
  });

  it("rejects a non-Kenyan phone", () => {
    expect(validateListing({ ...good, phone: "12345" }).phone).toBeDefined();
  });

  it("accepts a facebook.com link", () => {
    expect(validateListing({ ...good, facebook: "https://www.facebook.com/sunrise" })).toEqual({});
  });

  it("rejects links to other sites", () => {
    expect(validateListing({ ...good, facebook: "https://example.com" }).facebook).toBeDefined();
  });

  it("rejects text that is not a link", () => {
    expect(validateListing({ ...good, facebook: "sunrise page" }).facebook).toMatch(/https/);
  });

  it("needs both coordinates or neither", () => {
    expect(validateListing({ ...good, lat: "-1.1" }).lng).toBeDefined();
    expect(validateListing({ ...good, lng: "37" }).lat).toBeDefined();
  });

  it("rejects coordinates outside Kenya", () => {
    const errors = validateListing({ ...good, lat: "40", lng: "10" });
    expect(errors.lat).toBeDefined();
    expect(errors.lng).toBeDefined();
  });

  it("accepts coordinates inside Kenya", () => {
    expect(validateListing({ ...good, lat: "-1.1", lng: "37.01" })).toEqual({});
  });
});

describe("validateReport", () => {
  it("requires a reason", () => {
    expect(validateReport({ reason: "" }).reason).toBeDefined();
  });

  it("limits details to 400 characters", () => {
    const errors = validateReport({ reason: "Fake", details: "a".repeat(401) });
    expect(errors.details).toBeDefined();
  });

  it("passes a normal report", () => {
    expect(validateReport({ reason: "Fake", details: "No house there" })).toEqual({});
  });
});
