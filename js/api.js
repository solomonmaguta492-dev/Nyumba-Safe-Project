// All talking to the server (or the listings file) happens here.
import { API_URL, STATIC_MODE, LISTINGS_FILE } from "./config.js";

/*
  fetch does not throw on 404 or 500 errors by itself,
  so we check res.ok and throw our own error.
*/
async function request(path, options = {}) {
  const res = await fetch(API_URL + path, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) throw new Error(`Request failed (${res.status})`);
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

// In static mode, read listings.json. It can be a plain list or a copy of db.json.
export async function getListings() {
  if (!STATIC_MODE) return request("/listings");
  const res = await fetch(LISTINGS_FILE);
  if (!res.ok) throw new Error(`Request failed (${res.status})`);
  const data = await res.json();
  return Array.isArray(data) ? data : data.listings;
}

export const createListing = (data) =>
  request("/listings", { method: "POST", body: JSON.stringify(data) });

// PUT replaces the whole record, so send every field.
export const replaceListing = (id, data) =>
  request(`/listings/${id}`, { method: "PUT", body: JSON.stringify(data) });

// PATCH changes only the fields you send.
export const patchListing = (id, data) =>
  request(`/listings/${id}`, { method: "PATCH", body: JSON.stringify(data) });

export const deleteListing = (id) =>
  request(`/listings/${id}`, { method: "DELETE" });

// Houses sent by owners wait in "submissions" until the site owner checks them.
export const submitListing = (data) =>
  request("/submissions", { method: "POST", body: JSON.stringify(data) });

export const sendReport = (data) =>
  request("/reports", { method: "POST", body: JSON.stringify(data) });
