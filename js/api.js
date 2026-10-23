// All talking to the server happens here.
import { API_URL } from "./config.js";

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

//GET for get listing
export const getListings = () => request("/listings");

// POST creates listing
export const createListing = (data) =>
  request("/listings", { method: "POST", body: JSON.stringify(data) });

// PUT replaces the whole record, so send every field.
export const replaceListing = (id, data) =>
  request(`/listings/${id}`, { method: "PUT", body: JSON.stringify(data) });

// PATCH changes only the fields you send.
export const patchListing = (id, data) =>
  request(`/listings/${id}`, { method: "PATCH", body: JSON.stringify(data) });