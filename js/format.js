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