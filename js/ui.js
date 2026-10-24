// Everything that draws on the page.
import { escapeHtml, formatRent, bedroomLabel, formatDate, localPhone } from "./format.js";
import { normalizePhone } from "./validators.js";

/*
  data-action and data-id tell main.js which button was clicked
  and which listing it belongs to.
*/

//listing cards with whatsapp calland facebook
function cardHTML(l) {
  const phone = normalizePhone(l.phone);
  const message = `Hello, I saw ${l.name} on NyumbaSafe. Is it still available?`;
  const whatsapp = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  const place = [l.area, l.location].filter(Boolean).map(escapeHtml).join(" · ");
  const id = escapeHtml(l.id);

  const facebook = /^https?:\/\//.test(l.facebook || "")
    ? `<a class="btn" href="${escapeHtml(l.facebook)}" target="_blank" rel="noopener">Facebook</a>`
    : "";

  const confirmed = l.confirmedOn
    ? `<p class="confirmed">Last confirmed vacant: ${escapeHtml(formatDate(l.confirmedOn))}</p>`
    : "";

  return `
    <article class="card ${l.verified ? "is-verified" : ""}" data-id="${id}">
      <div class="card-head">
        <div>
          <h3>${escapeHtml(l.name)}</h3>
          <p class="place">${place}</p>
        </div>
        <p class="rent">${escapeHtml(formatRent(l.rent))} <small>/month</small></p>
      </div>
      <ul class="badges">
        <li class="badge">${escapeHtml(bedroomLabel(l.bedrooms))}</li>
        <li class="badge ${l.verified ? "ok" : "no"}">${l.verified ? "Verified" : "Not verified yet"}</li>
      </ul>
      <p class="manager">Manager: ${escapeHtml(l.manager)} · ${escapeHtml(localPhone(phone))}</p>
      ${confirmed}
      <div class="actions">
        <a class="btn btn-wa" href="${whatsapp}" target="_blank" rel="noopener">WhatsApp</a>
        <a class="btn" href="tel:+${escapeHtml(phone)}">Call</a>
        ${facebook}
      </div>
      <div class="actions manage">
        <button type="button" class="text-btn" data-action="confirm" data-id="${id}">Confirm still vacant</button>
        <button type="button" class="text-btn" data-action="edit" data-id="${id}">Edit</button>
        <button type="button" class="text-btn danger" data-action="delete" data-id="${id}">Delete</button>
        <button type="button" class="text-btn warn" data-action="report" data-id="${id}">Report</button>
      </div>
    </article>`;
}
//renderCards and showMessage
export function renderCards(container, listings) {
  if (listings.length === 0) {
    showMessage(container, "No houses match your filters. Try clearing them.");
    return;
  }
  container.innerHTML = listings.map(cardHTML).join("");
}

// Used for "loading", "no results" and error messages.
export function showMessage(container, text) {
  container.innerHTML = `<p class="empty">${escapeHtml(text)}</p>`;
}

export function setCount(shown, total) {
  document.getElementById("count").textContent =
    `Showing ${shown} of ${total} houses`;
}

// Fills the Area dropdown and keeps the current choice if it still exists.
export function fillAreaSelect(select, areas) {
  const current = select.value;
  select.innerHTML =
    `<option value="all">All Areas</option>` +
    areas.map((a) => `<option value="${escapeHtml(a)}">${escapeHtml(a)}</option>`).join("");
  select.value = areas.includes(current) ? current : "all";
}

// Highlights the card whose pin was clicked and scrolls to it.
export function setActiveCard(id) {
  document.querySelectorAll(".card.is-active").forEach((c) => c.classList.remove("is-active"));
  const card = document.querySelector(`.card[data-id="${CSS.escape(String(id))}"]`);
  if (!card) return;
  card.classList.add("is-active");
  const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  card.scrollIntoView({ behavior: calm ? "auto" : "smooth", block: "center" });
}

let toastTimer;
export function showToast(text, isError = false) {
  const toast = document.getElementById("toast");
  toast.textContent = text;
  toast.className = "toast show" + (isError ? " error" : "");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 3500);
}

// Form helpers: errors, filling, and reading.
export function clearErrors(form) {
  form.querySelectorAll(".field-error").forEach((s) => (s.textContent = ""));
}

export function showErrors(form, errors) {
  clearErrors(form);
  Object.entries(errors).forEach(([field, message]) => {
    const span = form.querySelector(`[data-error-for="${field}"]`);
    if (span) span.textContent = message;
  });
  const first = Object.keys(errors)[0];
  if (first && form.elements[first]) form.elements[first].focus();
}

export function fillForm(form, data = {}) {
  Array.from(form.elements).forEach((el) => {
    if (!el.name) return;
    const value = data[el.name];
    el.value = value === undefined || value === null ? "" : String(value);
  });
}

// Reads every field into one object, with spaces trimmed.
export function readForm(form) {
  const values = {};
  new FormData(form).forEach((v, k) => (values[k] = String(v).trim()));
  return values;
}