// The diagram renders SVG, so it needs a DOM. Booting a bare jsdom document is
// enough to drive createDiagram end to end: mounting, annotating, fanning the
// labels out, clearing, and the anchor fallback — the behaviour the string-only
// smoke test in diagram.test.js can't reach.

import { test } from "node:test";
import assert from "node:assert/strict";
import { JSDOM } from "jsdom";

const dom = new JSDOM("<!doctype html><div id='host'></div>", { url: "http://localhost/" });
globalThis.window = dom.window;
globalThis.document = dom.window.document;

const { createDiagram } = await import("../site/diagram.js");

function fresh() {
  const host = document.createElement("div");
  document.body.appendChild(host);
  return { host, diagram: createDiagram(host) };
}

const callouts = (host) => host.querySelectorAll(".callout");

test("annotate mounts a callout with a line, a dot, and a label", () => {
  const { host, diagram } = fresh();
  diagram.annotate({ anchor: "shell", label: "Fast charging" });
  const group = host.querySelector(".callout");
  assert.ok(group, "a callout group is added");
  assert.ok(group.querySelector("line"), "a leader line");
  assert.ok(group.querySelector("circle"), "an anchor dot");
  assert.equal(group.querySelector("text").textContent, "Fast charging");
});

test("successive labels fan out across the parking slots then wrap", () => {
  const { host, diagram } = fresh();
  const xs = [];
  for (let i = 0; i < 4; i++) {
    diagram.annotate({ anchor: "pins", label: `L${i}` });
    xs.push(host.querySelectorAll(".callout text")[i].getAttribute("x"));
  }
  assert.equal(new Set(xs.slice(0, 3)).size, 3, "first three slots are distinct");
  assert.equal(xs[3], xs[0], "the fourth wraps back to the first slot");
});

test("clear removes every callout and resets the fan-out", () => {
  const { host, diagram } = fresh();
  diagram.annotate({ anchor: "pins", label: "A" });
  diagram.annotate({ anchor: "pins", label: "B" });
  assert.equal(callouts(host).length, 2);
  diagram.clear();
  assert.equal(callouts(host).length, 0, "callouts removed");
  diagram.annotate({ anchor: "pins", label: "C" });
  const x = host.querySelector(".callout text").getAttribute("x");
  assert.equal(x, "200", "the next label starts back at the first slot");
});

test("an unknown anchor falls back to the overmold, never off-diagram", () => {
  const { host, diagram } = fresh();
  diagram.annotate({ anchor: "nonexistent", label: "?" });
  const line = host.querySelector(".callout line");
  assert.equal(line.getAttribute("x2"), "165", "overmold x");
  assert.equal(line.getAttribute("y2"), "132", "overmold y");
});

test("the amber tone strokes with the support accent, not the primary", () => {
  const { host, diagram } = fresh();
  diagram.annotate({ anchor: "overmold", label: "here", tone: "amber", strong: true });
  const line = host.querySelector(".callout-strong line");
  assert.equal(line.getAttribute("stroke"), "var(--accent-support)");
});

test("prefers-reduced-motion skips the stroke-draw animation", () => {
  // Installed last so the animated-path tests above run under the default.
  globalThis.matchMedia = (query) => ({
    matches: query.includes("reduce"),
    media: query,
  });
  const { host, diagram } = fresh();
  diagram.annotate({ anchor: "shell", label: "instant" });
  const line = host.querySelector(".callout line");
  assert.equal(line.style.strokeDasharray, "none", "no dash offset to animate");
  assert.equal(line.style.transition, "", "no transition scheduled");
  delete globalThis.matchMedia;
});
