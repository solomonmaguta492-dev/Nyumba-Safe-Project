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
