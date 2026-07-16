import { test } from "node:test";
import assert from "node:assert/strict";
import { NEEDS, getVerdict } from "../site/decision-tree.js";

test("standard charging needs no special cable", () => {
  const verdict = getVerdict(NEEDS.CHARGE_STANDARD);
  assert.match(verdict.headline, /any usb-c cable/i);
});

test("fast charging points to the lightning-bolt / 5A marking", () => {
  const verdict = getVerdict(NEEDS.CHARGE_FAST);
  assert.match(verdict.headline, /5A/);
});

test("4K video points to the DisplayPort marking", () => {
  const verdict = getVerdict(NEEDS.VIDEO_4K);
  assert.match(verdict.headline, /DP/);
});

test("fast transfer points to the SS10/SS20/Thunderbolt marking", () => {
  const verdict = getVerdict(NEEDS.TRANSFER_FAST);
  assert.match(verdict.headline, /SS/);
});

test("an unknown need throws instead of returning a bad verdict", () => {
  assert.throws(() => getVerdict("not_a_real_need"));
});
