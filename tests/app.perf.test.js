// Long-session sanity for the perf sweep: playing many rounds must not leak
// annotations onto the diagram. Each restart clears the overlay, so after ten
// full check-another-cable cycles the callout count matches a single round —
// not ten rounds' worth accumulated.

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
function tap(text) {
  [...card().querySelectorAll("button.option")]
    .find((b) => b.textContent.includes(text))
    .click();
}
const calloutCount = () => document.querySelectorAll("#diagram .callout").length;

function playOneRound() {
  tap("Laptop");
  tap("Fast charging");
  tap("Nothing visible");
}

test("ten rounds do not accumulate diagram annotations", () => {
  playOneRound();
  const perRound = calloutCount();
  assert.ok(perRound > 0, "a round draws callouts");
  for (let i = 0; i < 9; i++) {
    tap("Check another cable");
    assert.equal(calloutCount(), 0, "restart clears the overlay");
    playOneRound();
  }
  assert.equal(calloutCount(), perRound, "no buildup across rounds");
});
