// Small helpers for showing text, money and dates.

// Stops a listing name like <b>hi</b> from being treated as HTML.
export function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[c]));
}
// FORMAT BOTH RENT AND LABEL
export function formatRent(n) {
  return "KES " + Number(n).toLocaleString("en-KE");
}

export function bedroomLabel(n) {
  n = Number(n);
  if (n === 0) return "Bedsitter";
  return n === 1 ? "1 bedroom" : `${n} bedrooms`;
}
//FORMAT FOR DATE
export function formatDate(iso) {
  const d = new Date(iso);
  if (isNaN(d)) return "";
  // "2026-10-18" is read as UTC, so show it in UTC or it can slip a day.
  return d.toLocaleDateString("en-GB", {
    day: "numeric", month: "short", year: "numeric", timeZone: "UTC",
  });
}

export function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export function daysSince(iso) {
  const d = new Date(iso);
  if (isNaN(d)) return Infinity;
  return Math.floor((Date.now() - d) / 86400000);
}

// Builds the wa.me link that sends a report to the site owner.
export function reportWhatsAppLink(ownerPhone, listing, reason, details = "") {
  const lines = [
    "NyumbaSafe report",
    `Listing: ${listing.name}, ${listing.area} (id ${listing.id})`,
    `Reason: ${reason}`,
  ];
  if (details) lines.push(`Details: ${details}`);
  return `https://wa.me/${ownerPhone}?text=${encodeURIComponent(lines.join("\n"))}`;
}

// 254712345678 becomes 0712345678 for display.
export function localPhone(phone) {
  return phone.startsWith("254") ? "0" + phone.slice(3) : phone;
}