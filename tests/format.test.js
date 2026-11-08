import { describe, it, expect, vi, afterEach } from "vitest";
import {
  escapeHtml, formatRent, bedroomLabel, formatDate, todayISO,
  daysSince, localPhone, reportWhatsAppLink, submissionWhatsAppLink,
} from "../js/format.js";

afterEach(() => vi.useRealTimers());

describe("escapeHtml", () => {
  it("escapes HTML characters", () => {
    expect(escapeHtml(`<b>"Tom's" & co</b>`)).toBe(
      "&lt;b&gt;&quot;Tom&#39;s&quot; &amp; co&lt;/b&gt;"
    );
  });

  it("turns null into an empty string", () => {
    expect(escapeHtml(null)).toBe("");
  });
});

describe("formatRent and bedroomLabel", () => {
  it("formats rent in KES", () => {
    expect(formatRent(11000)).toBe("KES 11,000");
  });

  it("labels bedrooms", () => {
    expect(bedroomLabel(0)).toBe("Bedsitter");
    expect(bedroomLabel(1)).toBe("1 bedroom");
    expect(bedroomLabel("3")).toBe("3 bedrooms");
  });
});

describe("dates", () => {
  it("formats a date", () => {
    expect(formatDate("2026-10-18")).toBe("18 Oct 2026");
  });

  it("returns empty text for a bad date", () => {
    expect(formatDate("not a date")).toBe("");
  });

  it("gives today as YYYY-MM-DD", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-11-08T12:00:00Z"));
    expect(todayISO()).toBe("2026-11-08");
  });

  it("counts days since a date", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-11-08T00:00:00Z"));
    expect(daysSince("2026-11-01")).toBe(7);
  });

  it("treats a missing date as very old", () => {
    expect(daysSince(undefined)).toBe(Infinity);
  });
});

describe("localPhone", () => {
  it("shows 254 numbers as 07...", () => {
    expect(localPhone("254712345678")).toBe("0712345678");
  });

  it("leaves other numbers alone", () => {
    expect(localPhone("0712345678")).toBe("0712345678");
  });
});

describe("reportWhatsAppLink", () => {
  const listing = { id: 3, name: "Acacia Heights", area: "Kasarani" };

  it("builds a wa.me link to the owner", () => {
    const link = reportWhatsAppLink("254798913169", listing, "The house does not exist");
    expect(link.startsWith("https://wa.me/254798913169?text=")).toBe(true);
    const text = decodeURIComponent(link.split("?text=")[1]);
    expect(text).toContain("Acacia Heights, Kasarani (id 3)");
    expect(text).toContain("Reason: The house does not exist");
    expect(text).not.toContain("Details:");
  });

  it("adds details when given", () => {
    const link = reportWhatsAppLink("254798913169", listing, "Other", "Asked for a deposit");
    expect(decodeURIComponent(link)).toContain("Details: Asked for a deposit");
  });
});

describe("submissionWhatsAppLink", () => {
  const house = {
    name: "Ruaka Terrace",
    area: "Ruaka",
    location: "Off Limuru Road",
    bedrooms: 2,
    rent: 25000,
    manager: "Mary",
    phone: "254712345678",
    facebook: "",
    lat: null,
    lng: null,
  };
  const text = (link) => decodeURIComponent(link.split("?text=")[1]);

  it("sends all the house details to the owner", () => {
    const link = submissionWhatsAppLink("254798913169", house);
    expect(link.startsWith("https://wa.me/254798913169?text=")).toBe(true);
    expect(text(link)).toBe(
      "New house for NyumbaSafe\n" +
        "Name: Ruaka Terrace\n" +
        "Area: Ruaka (Off Limuru Road)\n" +
        "Bedrooms: 2 bedrooms\n" +
        "Rent: KES 25,000 per month\n" +
        "Manager: Mary, 0712345678"
    );
  });

  it("adds Facebook and map lines when given", () => {
    const link = submissionWhatsAppLink("254798913169", {
      ...house, location: "", facebook: "https://facebook.com/ruaka", lat: -1.2054, lng: 36.7826,
    });
    expect(text(link)).toContain("Area: Ruaka\n");
    expect(text(link)).toContain("Facebook: https://facebook.com/ruaka");
    expect(text(link)).toContain("Map: -1.2054, 36.7826");
  });
});
