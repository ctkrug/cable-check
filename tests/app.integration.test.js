// End-to-end verification of the wow moment: boot the real app.js against the
// real index.html in jsdom, then drive the three-tap flow, the verdict, the
// restart, and the mute toggle exactly as a user would.

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { JSDOM } from "jsdom";

const html = readFileSync(new URL("../site/index.html", import.meta.url), "utf8");
const dom = new JSDOM(html, { url: "http://localhost/", pretendToBeVisual: true });

// Expose the jsdom globals the app closes over before importing it. WebAudio and
// matchMedia are intentionally left undefined — the app must degrade cleanly.
globalThis.window = dom.window;
globalThis.document = dom.window.document;
globalThis.localStorage = dom.window.localStorage;

await import("../site/app.js");
dom.window.document.dispatchEvent(new dom.window.Event("DOMContentLoaded"));

const card = document.getElementById("question-card");
const liveStatus = document.getElementById("live-status");
const muteBtn = document.getElementById("mute-toggle");

function optionByText(text) {
  const button = [...card.querySelectorAll("button.option")].find((b) =>
    b.textContent.includes(text)
  );
  assert.ok(button, `option "${text}" is present`);
  return button;
}

test("the flow boots on the device question with option buttons", () => {
  assert.match(card.textContent, /Question 1 of 3/);
  assert.match(card.textContent, /What are you plugging in\?/);
  assert.equal(card.querySelectorAll("button.option").length, 4);
});

test("three taps resolve to a verdict announced in the live region", () => {
  optionByText("Laptop").click();
  assert.match(card.textContent, /Question 2 of 3/);

  optionByText("Fast charging").click();
  assert.match(card.textContent, /Question 3 of 3/);

  optionByText("Nothing visible").click();

  const headline = card.querySelector(".verdict-headline");
  assert.ok(headline, "a verdict headline renders");
  assert.match(headline.textContent, /5A/);
  assert.match(liveStatus.textContent, /5A/, "verdict is announced");
  assert.ok(optionByText("Check another cable"), "restart control is present");
});

test("the diagram accrues callouts as the flow progresses", () => {
  const callouts = document.querySelectorAll("#diagram .callout");
  assert.ok(callouts.length >= 2, "device, need, and verdict callouts drawn");
  assert.ok(
    document.querySelector("#diagram .callout-strong"),
    "the verdict draws a strong amber callout"
  );
});

test("restart returns to question one without reloading", () => {
  optionByText("Check another cable").click();
  assert.match(card.textContent, /Question 1 of 3/);
  assert.equal(liveStatus.textContent, "", "the stale verdict is cleared");
  assert.equal(
    document.querySelectorAll("#diagram .callout").length,
    0,
    "prior annotations are cleared"
  );
});

test("the mute toggle flips state and persists it", () => {
  assert.equal(muteBtn.getAttribute("aria-pressed"), "false");
  muteBtn.click();
  assert.equal(muteBtn.getAttribute("aria-pressed"), "true");
  assert.equal(localStorage.getItem("cablecheck:muted"), "1");
  muteBtn.click();
  assert.equal(muteBtn.getAttribute("aria-pressed"), "false");
});
