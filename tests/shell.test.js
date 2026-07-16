// The index.html shell carries the a11y contract (landmarks, labels, live
// region) and the subpath-deploy contract (every asset reference relative, so
// the bundle drops in at /cable-check/ unchanged). Guard both against silent
// regression without needing a full DOM.

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { JSDOM } from "jsdom";

const html = readFileSync(new URL("../site/index.html", import.meta.url), "utf8");
const doc = new JSDOM(html).window.document;

test("the page declares a language and a single wordmark heading", () => {
  assert.equal(doc.documentElement.getAttribute("lang"), "en");
  const h1s = doc.querySelectorAll("h1");
  assert.equal(h1s.length, 1, "exactly one top-level heading");
  assert.match(h1s[0].textContent, /Cable\s*Check/i);
});

test("the a11y landmarks are present: skip link, live region, labelled mute", () => {
  const skip = doc.querySelector("a.skip-link");
  assert.ok(skip && skip.getAttribute("href") === "#question-card", "skip link");
  assert.ok(
    doc.getElementById(skip.getAttribute("href").slice(1)),
    "skip link points at a real element"
  );
  const live = doc.getElementById("live-status");
  assert.equal(live.getAttribute("role"), "status");
  assert.equal(live.getAttribute("aria-live"), "polite");
  const mute = doc.getElementById("mute-toggle");
  assert.ok(mute.getAttribute("aria-label"), "the icon-only mute button is labelled");
});

test("a noscript fallback still tells the user what to look for", () => {
  const noscript = doc.querySelector("noscript");
  assert.ok(noscript, "a noscript block exists");
  assert.match(noscript.textContent, /5A|DP|SS10|marking/i);
});

test("every asset reference is relative for subpath deployment", () => {
  const refs = [
    ...[...doc.querySelectorAll("link[href]")].map((l) => l.getAttribute("href")),
    ...[...doc.querySelectorAll("script[src]")].map((s) => s.getAttribute("src")),
  ];
  const local = refs.filter((r) => !/^https?:\/\//.test(r));
  assert.ok(local.length > 0, "there are local assets to check");
  for (const ref of local) {
    assert.ok(!ref.startsWith("/"), `${ref} must be relative, not root-absolute`);
  }
});
