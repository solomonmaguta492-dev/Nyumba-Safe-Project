// CONNECTS THE PAGE, THE MODULES AND THE API
import * as api from "./api";
import {validateListing, buildListing, validateReport } from "./validators.js";
import { filterListings, getAreas, todayIso } from "./filters.js";
import { renderListings, showMessage, showToast, showFormErrors, clearFormErrors } from "./ui.js";
import { initMap, showMarkers, focusMarker } from "./map.js";