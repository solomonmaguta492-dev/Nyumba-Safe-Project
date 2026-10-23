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
