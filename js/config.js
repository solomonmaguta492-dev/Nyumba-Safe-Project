// Settings shared by every file.

export const API_URL = "http://localhost:3000";

// true: read listings.json, no API needed. false: use the API.
export const STATIC_MODE = true;
export const LISTINGS_FILE = "listings.json";

// The website owner's WhatsApp number. Reports are sent here.
export const OWNER_WHATSAPP = "254798913169";

export const MAP_CENTER = [-1.1018, 37.0144];
export const MAP_ZOOM = 12;

// Hide listings not confirmed vacant for this many days. 0 means never hide.
export const HIDE_AFTER_DAYS = 0;
