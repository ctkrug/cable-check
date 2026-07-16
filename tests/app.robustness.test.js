// Adversarial UI robustness: a fresh app booted in jsdom, then abused the way a
// hostile or fumble-fingered user would — double-taps, stale clicks, and
// clicking a control whose question has already been answered. None of it may
// crash the flow or produce an impossible verdict.

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { JSDOM } from "jsdom";

const html = readFileSync(new URL("../site/index.html", import.meta.url), "utf8");

function boot() {
  const dom = new JSDOM(html, { url: "http://localhost/", pretendToBeVisual: true });
  globalThis.window = dom.window;
  globalThis.document = dom.window.document;
  globalThis.localStorage = dom.window.localStorage;
  return dom;
}

const dom = boot();
await import("../site/app.js");
dom.window.document.dispatchEvent(new dom.window.Event("DOMContentLoaded"));

const card = () => document.getElementById("question-card");
function pick(text) {
  return [...card().querySelectorAll("button.option")].find((b) =>
    b.textContent.includes(text)
  );
}

test("a stale click on an already-answered option is ignored, not replayed", () => {
  const laptop = pick("Laptop");
  laptop.click(); // answers the device question, advances to the need question
  // The same detached button is clicked again (a physical double-tap): it must
  // NOT write the device value into the need slot and skip ahead.
  assert.doesNotThrow(() => laptop.click());
  assert.match(card().textContent, /Question 2 of 3/, "still on the need question");
});

test("the flow still completes cleanly to a real verdict after the abuse", () => {
  pick("Fast charging").click();
  pick("Nothing visible").click();
  const headline = card().querySelector(".verdict-headline");
  assert.ok(headline, "a verdict renders");
  assert.match(headline.textContent, /5A/, "the verdict is the correct one");
});
