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
