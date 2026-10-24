// Checks the form values before anything is sent to the server.

/*
  Turns 0712345678 or +254712345678 into 254712345678.
  The pattern means: 254, then 7 or 1, then 8 more digits.
*/
export const PHONE_PATTERN = /^254[17]\d{8}$/;

export function normalizePhone(raw) {
  const digits = String(raw ?? "").replace(/[\s\-()]/g, "").replace(/^\+/, "");
  if (/^0[17]\d{8}$/.test(digits)) return "254" + digits.slice(1);
  return digits;
}

function isBlank(v) {
  return v === undefined || v === null || String(v).trim() === "";
}

/*
  Returns an object like { phone: "message" }.
  An empty object means the form is valid.
  Coordinates come as a pair: give both or neither.
*/
export function validateListing(v) {
  const errors = {};

  if (isBlank(v.name)) errors.name = "Enter the apartment name.";
  if (isBlank(v.area)) errors.area = "Enter the area.";
  if (isBlank(v.bedrooms)) errors.bedrooms = "Choose the number of bedrooms.";

  if (isBlank(v.rent)) errors.rent = "Enter the monthly rent.";
  else if (!(Number(v.rent) > 0)) errors.rent = "Rent must be more than 0.";

  if (isBlank(v.manager)) errors.manager = "Enter the manager's name.";

  if (isBlank(v.phone)) errors.phone = "Enter the manager's phone.";
  else if (!PHONE_PATTERN.test(normalizePhone(v.phone))) {
    errors.phone = "Use a Kenyan number like 0712345678.";
  }

  if (!isBlank(v.facebook)) {
    try {
      const url = new URL(v.facebook);
      const ok = /^https?:$/.test(url.protocol) && /(facebook\.com|fb\.com)$/.test(url.hostname.replace(/^www\./, ""));
      if (!ok) errors.facebook = "Enter a facebook.com link.";
    } catch {
      errors.facebook = "Enter a full link starting with https://";
    }
  }

  const hasLat = !isBlank(v.lat);
  const hasLng = !isBlank(v.lng);
  if (hasLat !== hasLng) {
    errors[hasLat ? "lng" : "lat"] = "Give both latitude and longitude.";
  } else if (hasLat && hasLng) {
    const lat = Number(v.lat);
    const lng = Number(v.lng);
    if (!(lat >= -5 && lat <= 5.5)) errors.lat = "Latitude should be between -5 and 5.5.";
    if (!(lng >= 33 && lng <= 42)) errors.lng = "Longitude should be between 33 and 42.";
  }

  return errors;
}

export function validateReport(v) {
  const errors = {};
  if (isBlank(v.reason)) errors.reason = "Choose a reason.";
  if (String(v.details ?? "").length > 400) errors.details = "Keep it under 400 characters.";
  return errors;
}