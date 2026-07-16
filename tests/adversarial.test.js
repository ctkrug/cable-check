// Hostile-input sweep for the pure verdict logic: null, non-string, empty,
// whitespace, and emoji answers must all be rejected loudly rather than
// coerced into a plausible-but-wrong verdict.

import { test } from "node:test";
import assert from "node:assert/strict";
import { NEEDS, MARKINGS, getVerdict } from "../site/decision-tree.js";

test("a null or non-string need is rejected as unknown", () => {
  for (const bad of [null, 42, {}, [], true, Symbol.for("x")]) {
    assert.throws(() => getVerdict(bad, MARKINGS.PRESENT), /Unknown need/);
  }
});

test("an empty or whitespace need is rejected, not treated as standard", () => {
  for (const bad of ["", "   ", "charge", "CHARGE_STANDARD"]) {
    assert.throws(() => getVerdict(bad, MARKINGS.PRESENT), /Unknown need/);
  }
});
