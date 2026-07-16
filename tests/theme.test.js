// The diagram sets stroke/fill to CSS custom properties (var(--accent), etc.)
// rather than hard-coded colours, so a token renamed in styles.css would
// silently leave the schematic uncoloured. Assert every token the JS reaches
// for is actually defined in the stylesheet.

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = (rel) => readFileSync(new URL(rel, import.meta.url), "utf8");
const css = read("../site/styles.css");
const definedTokens = new Set(
  [...css.matchAll(/(--[a-z0-9-]+)\s*:/gi)].map((m) => m[1])
);

test("every token the JS references is defined in styles.css", () => {
  const js = read("../site/diagram.js") + read("../site/app.js");
  const used = [...js.matchAll(/var\((--[a-z0-9-]+)\)/gi)].map((m) => m[1]);
  assert.ok(used.length > 0, "the JS does reference theme tokens");
  for (const token of new Set(used)) {
    assert.ok(definedTokens.has(token), `${token} is defined in styles.css`);
  }
});

test("the design-direction core tokens are all present", () => {
  for (const token of ["--bg", "--accent", "--accent-support", "--text", "--danger", "--success"]) {
    assert.ok(definedTokens.has(token), `${token} is defined`);
  }
});
