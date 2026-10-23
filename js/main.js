// Starts the app and connects the page, the filters, the forms and the API.
import {
  getListings, createListing, replaceListing, patchListing, deleteListing, sendReport,
} from "./api.js";
import { applyFilters, getAreas } from "./filters.js";
import { validateListing, validateReport, normalizePhone } from "./validators.js";
import { todayISO } from "./format.js";
import { initMap, showPins, focusPin, refreshMap } from "./map.js";
import {
  renderCards, showMessage, setCount, fillAreaSelect, setActiveCard, showToast,
  clearErrors, showErrors, fillForm, readForm,
} from "./ui.js";

const $ = (id) => document.getElementById(id);
const results = $("results");

let listings = [];
let editingId = null;
let reportingId = null;

const findById = (id) => listings.find((l) => String(l.id) === String(id));

// Filters.
function currentFilters() {
  return {
    search: $("search").value,
    area: $("area").value,
    maxRent: $("max-rent").value,
    bedrooms: $("bedrooms").value,
  };
}

function render() {
  const shown = applyFilters(listings, currentFilters());
  renderCards(results, shown);
  showPins(shown);
  setCount(shown.length, listings.length);
}

async function load() {
  showMessage(results, "Loading houses...");
  try {
    listings = await getListings();
    fillAreaSelect($("area"), getAreas(listings));
    render();
  } catch {
    showMessage(results, "Could not load houses. Check that the API is running (npm run api).");
    setCount(0, 0);
  }
}

// Add and edit listing form.
const listingDialog = $("listing-dialog");
const listingForm = $("listing-form");

function openListingForm(listing = null) {
  editingId = listing ? listing.id : null;
  $("listing-title").textContent = listing ? "Edit Listing" : "Add a Listing";
  clearErrors(listingForm);
  fillForm(listingForm, listing || {});
  listingDialog.showModal();
}

// Turns the form text into the record we store.
function toListing(v) {
  const hasCoords = v.lat !== "" && v.lng !== "";
  return {
    name: v.name,
    area: v.area,
    location: v.location,
    bedrooms: Number(v.bedrooms),
    rent: Number(v.rent),
    manager: v.manager,
    phone: normalizePhone(v.phone),
    facebook: v.facebook,
    lat: hasCoords ? Number(v.lat) : null,
    lng: hasCoords ? Number(v.lng) : null,
  };
}

/*
  preventDefault() stops the page from reloading.
  On edit, PUT replaces the record, so we spread the old one
  first to keep the id, verified and date.
*/
listingForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const errors = validateListing(readForm(listingForm));
  showErrors(listingForm, errors);
  if (Object.keys(errors).length) return;

  const data = toListing(readForm(listingForm));
  const button = listingForm.querySelector('[type="submit"]');
  button.disabled = true;

  try {
    if (editingId !== null) {
      await replaceListing(editingId, { ...findById(editingId), ...data });
      showToast("Listing updated.");
    } else {
      await createListing({ ...data, verified: false, confirmedOn: todayISO() });
      showToast("Listing added.");
    }
    listingDialog.close();
    await load();
  } catch {
    showToast("Could not save the listing. Try again.", true);
  } finally {
    button.disabled = false;
  }
});

$("add-listing").addEventListener("click", () => openListingForm());
$("listing-cancel").addEventListener("click", () => listingDialog.close());

// Report form.
const reportDialog = $("report-dialog");
const reportForm = $("report-form");

function openReportForm(listing) {
  reportingId = listing.id;
  $("report-target").textContent = `${listing.name}, ${listing.area}`;
  clearErrors(reportForm);
  reportForm.reset();
  reportDialog.showModal();
}

reportForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const values = readForm(reportForm);
  const errors = validateReport(values);
  showErrors(reportForm, errors);
  if (Object.keys(errors).length) return;

  const button = reportForm.querySelector('[type="submit"]');
  button.disabled = true;
  try {
    await sendReport({
      listingId: reportingId,
      reason: values.reason,
      details: values.details,
      createdAt: new Date().toISOString(),
    });
    reportDialog.close();
    showToast("Thank you. Your report was sent.");
  } catch {
    showToast("Could not send the report. Try again.", true);
  } finally {
    button.disabled = false;
  }
});

$("report-cancel").addEventListener("click", () => reportDialog.close());
