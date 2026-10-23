// Decides which listings are shown.
import { HIDE_AFTER_DAYS } from "./config.js";
import { daysSince } from "./format.js";

function isFresh(listing) {
  if (HIDE_AFTER_DAYS === 0) return true;
  return daysSince(listing.confirmedOn) <= HIDE_AFTER_DAYS;
}

/*
  filters = { search, area, maxRent, bedrooms }
  bedrooms "3" means 3 or more.
*/
export function applyFilters(listings, filters) {
  const search = filters.search.trim().toLowerCase();
  const maxRent = filters.maxRent === "" ? null : Number(filters.maxRent);

  return listings.filter((l) => {
    if (!isFresh(l)) return false;
    if (search && !String(l.name).toLowerCase().includes(search)) return false;
    if (filters.area !== "all" && l.area !== filters.area) return false;
    if (maxRent !== null && Number(l.rent) > maxRent) return false;
    if (filters.bedrooms !== "any") {
      const wanted = Number(filters.bedrooms);
      const beds = Number(l.bedrooms);
      if (wanted === 3 ? beds < 3 : beds !== wanted) return false;
    }
    return true;
  });
}

// A sorted list of the areas that exist, for the Area dropdown.
export function getAreas(listings) {
  return [...new Set(listings.map((l) => l.area).filter(Boolean))].sort();
}