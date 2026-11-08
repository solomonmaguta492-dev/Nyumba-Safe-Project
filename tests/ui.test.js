// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  renderCards, showMessage, setCount, fillAreaSelect, setActiveCard, showToast,
  clearErrors, showErrors, fillForm, readForm,
} from "../js/ui.js";

const listing = {
  id: 1,
  name: "Sunrise <Apartments>",
  area: "Juja",
  location: "Near Gate C",
  bedrooms: 0,
  rent: 6500,
  manager: "Mr. Kamau",
  phone: "0712345678",
  verified: true,
  confirmedOn: "2026-10-18",
  facebook: "https://www.facebook.com/sunrise",
};

beforeEach(() => {
  document.body.innerHTML = `
    <div id="results"></div>
    <p id="count"></p>
    <select id="area"></select>
    <div id="toast"></div>
    <form id="f">
      <input name="name"><span class="field-error" data-error-for="name"></span>
      <input name="rent"><span class="field-error" data-error-for="rent"></span>
    </form>`;
  window.matchMedia = () => ({ matches: true });
  Element.prototype.scrollIntoView = vi.fn();
});

describe("renderCards", () => {
  it("draws one card per listing", () => {
    const results = document.getElementById("results");
    renderCards(results, [listing, { ...listing, id: 2, facebook: "" }]);
    expect(results.querySelectorAll(".card")).toHaveLength(2);
  });

  it("escapes the listing name", () => {
    const results = document.getElementById("results");
    renderCards(results, [listing]);
    expect(results.querySelector("h3").textContent).toBe("Sunrise <Apartments>");
    expect(results.querySelector("h3 apartments")).toBeNull();
  });

  it("shows contact links, the date and only Report in static mode", () => {
    const results = document.getElementById("results");
    renderCards(results, [listing]);
    const card = results.querySelector(".card");
    expect(card.querySelector(".btn-wa").href).toContain("wa.me/254712345678");
    expect(card.querySelector('a[href^="tel:"]').getAttribute("href")).toBe("tel:+254712345678");
    expect(card.textContent).toContain("Facebook");
    expect(card.textContent).toContain("18 Oct 2026");
    const actions = [...card.querySelectorAll("[data-action]")].map((b) => b.dataset.action);
    expect(actions).toEqual(["report"]);
  });

  it("hides the Facebook button when there is no link", () => {
    const results = document.getElementById("results");
    renderCards(results, [{ ...listing, facebook: "" }]);
    expect(results.textContent).not.toContain("Facebook");
  });

  it("shows a message when nothing matches", () => {
    const results = document.getElementById("results");
    renderCards(results, []);
    expect(results.querySelector(".empty").textContent).toMatch(/No houses/);
  });
});

describe("small page helpers", () => {
  it("showMessage and setCount write text", () => {
    showMessage(document.getElementById("results"), "Loading...");
    setCount(3, 10);
    expect(document.getElementById("results").textContent).toBe("Loading...");
    expect(document.getElementById("count").textContent).toBe("Showing 3 of 10 houses");
  });

  it("fillAreaSelect keeps the current choice when it still exists", () => {
    const select = document.getElementById("area");
    fillAreaSelect(select, ["Juja", "Ruaka"]);
    select.value = "Ruaka";
    fillAreaSelect(select, ["Juja", "Ruaka", "Thika"]);
    expect(select.value).toBe("Ruaka");
    fillAreaSelect(select, ["Juja"]);
    expect(select.value).toBe("all");
  });

  it("setActiveCard highlights one card", () => {
    const results = document.getElementById("results");
    renderCards(results, [listing, { ...listing, id: 2 }]);
    setActiveCard(2);
    expect(results.querySelector(".is-active").dataset.id).toBe("2");
    setActiveCard(99);
    expect(results.querySelectorAll(".is-active")).toHaveLength(0);
  });

  it("showToast shows and then hides", () => {
    vi.useFakeTimers();
    const toast = document.getElementById("toast");
    showToast("Saved", true);
    expect(toast.className).toBe("toast show error");
    vi.advanceTimersByTime(4000);
    expect(toast.classList.contains("show")).toBe(false);
    vi.useRealTimers();
  });
});

describe("form helpers", () => {
  it("fills, reads, and shows errors", () => {
    const form = document.getElementById("f");
    fillForm(form, { name: "  Sunrise ", rent: null });
    expect(readForm(form)).toEqual({ name: "Sunrise", rent: "" });

    showErrors(form, { rent: "Enter the monthly rent." });
    expect(form.querySelector('[data-error-for="rent"]').textContent).toBe("Enter the monthly rent.");
    expect(document.activeElement.name).toBe("rent");

    clearErrors(form);
    expect(form.querySelector('[data-error-for="rent"]').textContent).toBe("");
  });
});
