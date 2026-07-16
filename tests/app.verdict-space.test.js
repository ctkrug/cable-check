// End-to-end coverage of the whole verdict space through the real UI: every
// need × marking combination is tapped out in jsdom and must land on a
// well-formed, announced verdict with a known status class — the DOM-level
// mirror of combinations.test.js's pure-logic sweep.

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { JSDOM } from "jsdom";

const html = readFileSync(new URL("../site/index.html", import.meta.url), "utf8");
const dom = new JSDOM(html, { url: "http://localhost/", pretendToBeVisual: true });
globalThis.window = dom.window;
globalThis.document = dom.window.document;
globalThis.localStorage = dom.window.localStorage;

await import("../site/app.js");
dom.window.document.dispatchEvent(new dom.window.Event("DOMContentLoaded"));

const card = () => document.getElementById("question-card");
const live = () => document.getElementById("live-status");
function tap(text) {
  const btn = [...card().querySelectorAll("button.option")].find((b) =>
    b.textContent.includes(text)
  );
  assert.ok(btn, `option "${text}" present`);
  btn.click();
}

const NEEDS = ["Fast charging", "Driving a display", "Fast file transfer", "Just basic charging"];
const MARKINGS = ["A marking or icon", "Nothing visible", "Not sure"];
const KNOWN = ["verdict-any", "verdict-check", "verdict-missing", "verdict-conservative"];

for (const need of NEEDS) {
  for (const marking of MARKINGS) {
    test(`UI path: ${need} × ${marking} yields an announced verdict`, () => {
      tap("Phone");
      tap(need);
      tap(marking);
      const headline = card().querySelector(".verdict-headline");
      assert.ok(headline, "a verdict headline renders");
      assert.ok(headline.textContent.trim().length > 0, "headline non-empty");
      assert.ok(
        KNOWN.some((c) => headline.classList.contains(c)),
        `status class is known (${headline.className})`
      );
      assert.ok(live().textContent.trim().length > 0, "verdict announced");
      tap("Check another cable"); // restart for the next combination
    });
  }
}
