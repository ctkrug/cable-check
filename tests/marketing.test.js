// The landing contract: the head must carry search-facing metadata and the
// page must ship the below-the-fold guide, a GitHub link, and the portfolio
// cross-promotion. These are easy to drop in a refactor and invisible until
// traffic dries up, so guard them here.

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { JSDOM } from "jsdom";

const html = readFileSync(new URL("../site/index.html", import.meta.url), "utf8");
const doc = new JSDOM(html).window.document;

test("the head carries a title, description, and OG tags for search", () => {
  assert.match(doc.title, /Cable\s*Check/i);
  assert.match(doc.title, /100W/i, "title works in the primary query");
  const desc = doc.querySelector('meta[name="description"]');
  assert.ok(desc, "a meta description exists");
  assert.ok(desc.content.length <= 160, "description stays within ~160 chars");
  assert.match(desc.content, /compatibility checker/i, "description carries a target query");
  assert.ok(doc.querySelector('meta[property="og:title"]'), "og:title present");
  assert.ok(doc.querySelector('meta[property="og:description"]'), "og:description present");
});

test("the below-the-fold guide answers the target queries", () => {
  const guide = doc.querySelector(".guide");
  assert.ok(guide, "a guide section exists");
  const words = guide.textContent.trim().split(/\s+/).length;
  assert.ok(words >= 300 && words <= 600, `guide copy is ${words} words (want 300-600)`);
  const faq = [...doc.querySelectorAll(".faq-q")].map((h) => h.textContent);
  assert.ok(faq.length >= 3, "at least three FAQ questions");
  const joined = faq.join(" ").toLowerCase();
  assert.match(joined, /100w/, "an FAQ covers 100W charging");
  assert.match(joined, /thunderbolt/, "an FAQ covers Thunderbolt");
  assert.match(joined, /compatibility checker/, "an FAQ covers compatibility checking");
});

test("the page links to GitHub and cross-promotes the portfolio", () => {
  const hrefs = [...doc.querySelectorAll("a[href]")].map((a) => a.getAttribute("href"));
  assert.ok(
    hrefs.some((h) => h === "https://github.com/ctkrug/cable-check"),
    "a visible GitHub link points at the repo"
  );
  assert.ok(
    hrefs.some((h) => /apps\.charliekrug\.com/.test(h)),
    "the footer cross-promotes the showcase"
  );
});

test("the marketing copy has no em-dash slop tell", () => {
  assert.ok(!html.includes("—"), "no em-dash in the shipped page");
});
