import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  getListings, createListing, replaceListing, patchListing, deleteListing, sendReport,
  submitListing,
} from "../js/api.js";
import { API_URL, LISTINGS_FILE } from "../js/config.js";

// A fake fetch that answers with the given status and body.
function mockFetch(body, status = 200) {
  const fn = vi.fn(async () => ({
    ok: status >= 200 && status < 300,
    status,
    text: async () => (body === undefined ? "" : JSON.stringify(body)),
    json: async () => body,
  }));
  vi.stubGlobal("fetch", fn);
  return fn;
}

beforeEach(() => vi.unstubAllGlobals());
afterEach(() => vi.unstubAllGlobals());

describe("getListings (static mode)", () => {
  it("reads a plain list from listings.json", async () => {
    const fetch = mockFetch([{ id: 1 }]);
    expect(await getListings()).toEqual([{ id: 1 }]);
    expect(fetch).toHaveBeenCalledWith(LISTINGS_FILE);
  });

  it("also reads a copy of db.json", async () => {
    mockFetch({ listings: [{ id: 2 }], reports: [] });
    expect(await getListings()).toEqual([{ id: 2 }]);
  });

  it("throws when the file is missing", async () => {
    mockFetch(undefined, 404);
    await expect(getListings()).rejects.toThrow("404");
  });
});

describe("write requests", () => {
  it("POSTs a new listing", async () => {
    const fetch = mockFetch({ id: 11, name: "New" }, 201);
    const result = await createListing({ name: "New" });
    expect(result).toEqual({ id: 11, name: "New" });
    const [url, options] = fetch.mock.calls[0];
    expect(url).toBe(`${API_URL}/listings`);
    expect(options.method).toBe("POST");
    expect(JSON.parse(options.body)).toEqual({ name: "New" });
  });

  it("PUTs a whole listing", async () => {
    const fetch = mockFetch({ id: 1 });
    await replaceListing(1, { id: 1, name: "X" });
    expect(fetch.mock.calls[0][0]).toBe(`${API_URL}/listings/1`);
    expect(fetch.mock.calls[0][1].method).toBe("PUT");
  });

  it("PATCHes some fields", async () => {
    const fetch = mockFetch({ id: 1 });
    await patchListing(1, { confirmedOn: "2026-11-08" });
    expect(fetch.mock.calls[0][1].method).toBe("PATCH");
  });

  it("DELETEs a listing and handles an empty reply", async () => {
    const fetch = mockFetch(undefined);
    expect(await deleteListing(1)).toBeNull();
    expect(fetch.mock.calls[0][1].method).toBe("DELETE");
  });

  it("POSTs a report", async () => {
    const fetch = mockFetch({ id: 1 }, 201);
    await sendReport({ listingId: 1, reason: "Fake" });
    expect(fetch.mock.calls[0][0]).toBe(`${API_URL}/reports`);
  });

  it("POSTs an owner's house to submissions", async () => {
    const fetch = mockFetch({ id: 1 }, 201);
    await submitListing({ name: "New" });
    expect(fetch.mock.calls[0][0]).toBe(`${API_URL}/submissions`);
    expect(fetch.mock.calls[0][1].method).toBe("POST");
  });

  it("throws on a server error", async () => {
    mockFetch(undefined, 500);
    await expect(createListing({})).rejects.toThrow("500");
  });
});
