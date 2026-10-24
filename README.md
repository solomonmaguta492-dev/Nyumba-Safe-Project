# NyumbaSafe

# NyumbaSafe

**Find a house you can trust.**

NyumbaSafe ("nyumba" is Swahili for house) is a house-hunting website for Kenya. It helps people find rental houses and apartments without being scammed. Every listing shows the apartment name, location, rent, details and the manager's contact. Tenants can reach managers directly through WhatsApp, a phone call or Facebook.

> Never pay a deposit before you have viewed the house.

This is a student project.

## The problem and the solution

- **Problem:** Fake listings and agents who demand deposits before a viewing cost house hunters money and time.
- **Solution:** A searchable directory of real listings, with direct contact details and visible "last confirmed vacant" dates.
- **Target users:** Tenants (students, workers, families) and apartment managers or small real estate agents.

## Features

- Listing cards with name, area, landmark, rent, bedrooms and manager details
- WhatsApp (with a ready-made message), Call and Facebook buttons
- Search by name, and filter by area, maximum rent and bedrooms
- Map with a pin for each listing (Leaflet and OpenStreetMap)
- Add, edit and delete listings through pop-up forms with validation
- "Verified" badge and "Last confirmed vacant" date
- "Confirm still vacant" button that sets the date to today
- "Report this listing" form
- Mobile-friendly layout, keyboard focus styles, a skip link and screen-reader support

## Built with

- HTML, CSS and JavaScript (ES modules, no framework)
- [Leaflet](https://leafletjs.com/) 1.9.4 for the map
- A Node.js API (`server.js`) with data in `db.json`
- Google Fonts: Nunito Sans and Outfit

## Project structure

```
Nyumba-Safe-Project/
├── index.html
├── style.css
├── server.js
├── db.json
├── package.json
├── images/
│   └── header-bg.svg
└── js/
    ├── config.js
    ├── api.js
    ├── format.js
    ├── validators.js
    ├── filters.js
    ├── ui.js
    ├── map.js
    └── main.js
```

## Getting started

You need [Node.js](https://nodejs.org/) installed.

1. Install the dependencies:

```bash
   npm install
```

2. In one terminal, start the API (it runs on port 3000):

```bash
   npm run api
```

3. In a second terminal, serve the website:

```bash
   npx serve .
```

4. Open the address that `serve` prints, such as `http://localhost:57835`. Port 3000 is used by the API, so `serve` picks another port.

Do not open `index.html` by double-clicking it. The JavaScript uses modules, which only work through a server.

If you change a file and see no difference, save it and press **Ctrl + Shift + R** to bypass the browser cache.

## Data format

Each listing in `db.json` looks like this:

```json
{
  "id": 1,
  "name": "Sunrise Apartments",
  "area": "Juja",
  "location": "Near Gate C",
  "bedrooms": 1,
  "rent": 8500,
  "manager": "Jane Wanjiru",
  "phone": "254712345678",
  "facebook": "https://facebook.com/sunrise",
  "lat": -1.1018,
  "lng": 37.0144,
  "verified": true,
  "confirmedOn": "2026-10-15"
}
```

- `bedrooms`: `0` means a bedsitter.
- `phone`: stored in the `254...` form, which WhatsApp links need.
- `facebook`, `lat`, `lng` and `location` are optional.
- Reports are saved in a `reports` list, so `db.json` needs `"reports": []`.

## File guide

### HTML

**`index.html`** is the single page. It contains:

- the header and the safety message
- the filter form (search, area, maximum rent, bedrooms, Clear Filters and Add Listing)
- the results area and the map area
- two pop-up forms: **Add a Listing** (also used for editing) and **Report this Listing**
- a toast area for messages, a `noscript` notice and the footer

It loads Leaflet, then loads `js/main.js` as a module. `main.js` loads all the other JavaScript files.

### CSS

**`style.css`** styles the whole page.

- Colors and the warm green and terracotta theme are set once in `:root` as variables.
- The layout is mobile first. On small screens there is one column with the map above the listings. At 960px and wider there are two columns, and the map stays in view as you scroll.
- It also styles the filter bar, listing cards (green top border when verified), buttons, pop-up forms, toast messages, the skip link and the footer.
- It respects the "reduce motion" setting.

### JavaScript (`js/`)

Each File and  What it does 

1.config.js -> Settings: API address, map start and zoom, and how many days before an unconfirmed listing is hidden. 

2.api.js -> All requests to the server: get, add, replace, update and delete listings, and send reports. It also checks for 404 and 500 errors. 

3.format.js -> Display helpers: escapes HTML, formats rent, bedrooms, dates and phone numbers. 

4.validators.js -> Form checks: Kenyan phone numbers, required fields, Facebook links and coordinates. 

5.filters.js -> Decides which listings are shown, and builds the list of areas. 

6.ui.js -> Draws the cards, count, area dropdown, active card, toast messages and form errors.

7.map.js -> Creates the Leaflet map, adds pins, and moves the map to a clicked card. 

8.main.js -> Starts the app and connects the filters, forms, card buttons and API. 

How they fit together: `main.js` asks `api.js` for the listings, `filters.js` picks which to show, and `ui.js` and `map.js` draw them.

## Safety

- Every card and the page header remind users never to pay before viewing.
- Anything typed into a listing is escaped before it is shown, so it cannot inject HTML.
- Users can report listings that ask for money early, do not exist, are already taken or have wrong details.

## Roadmap

**MVP 1: Core listings** (done): listings page, contact buttons, search and filters, mobile-friendly design, map.

**MVP 2: Trust features:**

- "Verified" badge, given after confirming the manager by phone
- "Last confirmed vacant" date, with old listings hidden
- "Report this listing" button
- Safety tips on every listing

**MVP 3: Manager accounts:**

- Managers sign up and post their own listings
- Admin approval before a listing goes live
- Mark a house as taken or available
- Backend with Firebase or Supabase

**Later:** saved favourites, reviews from past tenants, and more counties.

**Success measure for MVP 1:** 20 real listings in one area, and 10 people who say it helped them contact a real manager.
