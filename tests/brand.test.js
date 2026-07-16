// D4 rejects a page with no favicon or a default globe. These lock the brand
// assets: a code-drawn SVG favicon in the accent colour, and a valid web
// manifest that deploys from a relative start_url.

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = (name) => readFileSync(new URL(`../site/${name}`, import.meta.url), "utf8");

test("the favicon is a custom SVG drawn in the accent colour, not a globe", () => {
  const svg = read("favicon.svg");
  assert.match(svg, /<svg[\s>]/, "an inline SVG");
  assert.match(svg, /#4fd8e8/i, "uses the cyan accent token colour");
  // A real drawing, not an empty or single-rect placeholder.
  assert.ok((svg.match(/<(rect|circle|path|line)/g) || []).length >= 2);
});

test("the web manifest is valid and deploys from a relative start_url", () => {
  const manifest = JSON.parse(read("manifest.webmanifest"));
  assert.equal(manifest.name, "Cable Check");
  assert.ok(!manifest.start_url.startsWith("/"), "start_url is relative");
  assert.ok(Array.isArray(manifest.icons) && manifest.icons.length > 0, "has icons");
  assert.match(manifest.theme_color, /^#[0-9a-f]{6}$/i, "a real theme colour");
});
