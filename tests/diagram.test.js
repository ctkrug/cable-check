// The rendered diagram needs a DOM, but its static schematic markup is a plain
// string we can smoke-test: the plug's parts must all be present.

import { test } from "node:test";
import assert from "node:assert/strict";
import { PLUG_MARKUP } from "../site/diagram.js";

test("the plug markup draws the cable, overmold, shell, tongue, and pins", () => {
  for (const part of [
    "plug-cable",
    "plug-overmold",
    "plug-shell",
    "plug-tongue",
    "plug-pins",
  ]) {
    assert.match(PLUG_MARKUP, new RegExp(part), `${part} is drawn`);
  }
});

test("the plug is stroked with the accent token, not a hard-coded colour", () => {
  assert.match(PLUG_MARKUP, /var\(--accent\)/);
});
