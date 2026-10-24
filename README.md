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
