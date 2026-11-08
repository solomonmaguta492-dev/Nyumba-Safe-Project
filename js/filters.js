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
    if (filters.area !== "all" && areaKey(l.area) !== areaKey(filters.area)) return false;
    if (maxRent !== null && Number(l.rent) > maxRent) return false;
    if (filters.bedrooms !== "any") {
      const wanted = Number(filters.bedrooms);
      const beds = Number(l.bedrooms);
      if (wanted === 3 ? beds < 3 : beds !== wanted) return false;
    }
    return true;
  });
}

// "juja" and "Juja " count as the same area.
const areaKey = (area) => String(area ?? "").trim().toLowerCase();

// A sorted list of the areas that exist, for the Area dropdown.
export function getAreas(listings) {
  const byKey = new Map();
  listings.forEach((l) => {
    const name = String(l.area ?? "").trim();
    if (name && !byKey.has(name.toLowerCase())) byKey.set(name.toLowerCase(), name);
  });
  return [...byKey.values()].sort((a, b) => a.localeCompare(b));
}